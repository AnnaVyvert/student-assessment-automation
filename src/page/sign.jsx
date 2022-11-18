import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useKeypress from 'react-use-keypress';
import { account_req, async_get, async_post } from '../server-api/requests_api';
import { registrationEntityFields } from '../utills/registration_entity_fields';
import useAsyncState from '../utills/use_async_state';

const fields = registrationEntityFields('account');

const SignPage = () => {
  const navigate = useNavigate();
  const [changeover, set_changeover] = useState(1);
  const [current_role, set_current_role] = useAsyncState(0);
  const [form_data, set_form_data] = useAsyncState({
    login: '',
    password: '',
    email: '',
    role_id: '',
    role: 'Не указано',
    name: '',
    surname: '',
    patronym: '',
    phone: '',
  });
  const onChange = (e) => {
    set_form_data({ ...form_data, [e.target.name]: e.target.value });
  };
  const label = (value, required) => (
    <div className="sign-label">
      {value}
      {required && (
        <span style={{ color: 'orange', cursor: 'default' }}>*</span>
      )}
    </div>
  );
  const field = (name, type, required) => (
    <input
      type={type}
      className="field"
      name={name}
      onChange={(e) => onChange(e)}
      required={required}
      autoComplete="off"
    />
  );
  const role_label = useRef();
  const roles = ['Не указано', 'Судья', 'Админ'];
  const select_role2 = (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '5% 20% 5%',
        justifyContent: 'center',
      }}
    >
      <span
        onClick={() => {
          upd_current_role(false);
        }}
      >
        &#10092;
      </span>
      <span ref={role_label} style={{ cursor: 'default' }}>
        {roles[current_role]}
      </span>
      <span
        onClick={() => {
          upd_current_role(true);
        }}
      >
        &#10093;
      </span>
    </div>
  );
  const changeover_div = (
    <div style={{ textAlign: 'center', display: 'inherit', marginTop: '10%' }}>
      <span
        className={changeover ? 'changeover active' : 'changeover'}
        onClick={() => {
          set_changeover(1);
        }}
      >
        Авторизация
      </span>
      <span
        className={!changeover ? 'changeover active' : 'changeover'}
        style={{ marginLeft: '1em' }}
        onClick={() => {
          set_changeover(0);
        }}
      >
        Регистрация
      </span>
    </div>
  );
  async function upd_current_role(bool) {
    // const res = bool && current_role<roles.length-1? 1 : !bool && current_role>0? -1 : 0
    role_label.current.setAttribute('style', 'cursor: default;');
    const res = bool
      ? Math.abs(current_role + 1) % roles.length
      : Math.abs(current_role - (1 - roles.length)) % roles.length;
    const answer = await set_current_role(res);
    const a = await set_form_data({ ...form_data, role: roles[answer] });
    return console.log(a);
  }
  useEffect(() => {
    document.title = 'Регистрация';
  });
  const sign_on = useRef();
  useKeypress('Enter', () => {
    console.log(sign_on.current.querySelector('.submit').click());
  });
  return !changeover ? (
    <>
      {/* <span >"*" помечены обязательные поля</span> */}
      {changeover_div}
      <br />
      <div ref={sign_on} style={{ textAlign: 'center' }}>
        {select_role2}
        {fields.map((elem, i) => (
          <div key={i}>
            {label(elem.label, elem.required)}
            {field(elem.name, elem.type, elem.required)}
          </div>
        ))}

        <br />
        <button
          className="submit"
          onClick={() => {
            sendInformation(fields, form_data, navigate, sign_on, role_label);
          }}
        >
          Создать аккаунт
        </button>
      </div>
    </>
  ) : (
    <>
      {changeover_div}
      <br />
      <div ref={sign_on} style={{ textAlign: 'center' }}>
        {[fields[0], fields[4]].map((elem, i) => (
          <div key={i}>
            {label(elem.label, elem.required)}
            {field(elem.name, elem.type, elem.required)}
          </div>
        ))}
        <div>
          <button
            className="submit"
            onClick={() =>
              auth([fields[0], fields[4]], form_data, navigate, sign_on)
            }
          >
            Войти
          </button>
        </div>
        <div style={{ fontSize: '0.8em', marginTop: '1em' }}>
          <span
            className="changeover active"
            onClick={() => {
              set_changeover(0);
            }}
          >
            Нет аккаунта?
          </span>
          <span
            className="changeover active"
            onClick={() => {
              navigate('/competitions');
            }}
            style={{ marginLeft: '1em' }}
          >
            Войти как гость
          </span>
        </div>
      </div>
    </>
  );
};

export default SignPage;

async function sendInformation(fields, form_data, nav, sign_on, role_label) {
  const translate_role = (role) => {
    switch (role) {
      // case 'Атлет': return 1
      // case 'Тренер': return 2
      // case 'Родитель': return 3
      // case 'Организатор': return 4
      case 'Судья':
        return 5;
      case 'Админ':
        return 6;
      default:
        return 0;
    }
  };
  const login_list = await async_get(`/api/logins`);
  console.log(login_list);
  if (login_list.length !== 0)
    for (let i in login_list)
      if (login_list[i].login === form_data.login)
        return [...sign_on.current.querySelectorAll('.field')][0].setAttribute(
          'class',
          'field invalid'
        );
  form_data.role_id = translate_role(form_data.role);
  if (form_data.role_id === 0)
    return role_label.current.setAttribute(
      'style',
      'cursor: default; border-bottom: 1px solid red;'
    );
  if (!validateFields(fields, form_data, sign_on))
    return console.log('failed validate');
  await async_post(`/api/account`, form_data);
  // setTimeout()
  localStorage.login = form_data.login;
  localStorage.password = form_data.password;

  nav('/');
}

function auth(fields, form_data, nav, sign_on) {
  if (!validateFields(fields, form_data, sign_on))
    return console.log('failed validate');
  const acc_data = account_req(form_data.login, form_data.password);
  // const match = get_req(`/api/account/${user_login}/${user_password}`)
  if (!acc_data.empty) {
    function random_rgba() {
      const o = Math.round,
        r = Math.random,
        s = 210; //s = 255
      return `rgb(${o(r() * s)},${o(r() * s)},${o(r() * s)})`;
    }
    localStorage.avatar_color = random_rgba();
    nav('/personal');
  } else {
    console.log('invalid login or password.');
  }
}

function validateFields(fields, form_data, sign_on) {
  const validated = fields.map((elem) => {
    return !elem.required || new RegExp(elem.regex).test(form_data[elem.name]);
  });

  console.log(validated);
  if (!validated.includes(false)) {
    return true;
  } else {
    [...sign_on.current.querySelectorAll('.field')].map((elem, i) =>
      validated[i]
        ? elem.setAttribute('class', 'field valid')
        : elem.setAttribute('class', 'field invalid')
    );
  }
}
