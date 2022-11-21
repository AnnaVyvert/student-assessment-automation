import { useRef } from 'react';
import { useState } from 'react';
import useKeypress from 'react-use-keypress';
import { async_get, async_put, get_req } from '../server-api/requests_api';

const EditValueModal = ({ setIsPopupVisible, field }) => {
  // const elem = get_req(`/api/account/id/${id}`)[0]
  console.log(field)
  const [attribute, set_attribute] = useState(field.value);
  const input_field = (type) => {
    return (
      <>
        <input
          autoFocus
          className="field"
          type={type}
          defaultValue={field.value}
          onChange={(e) => set_attribute(e.target.value)}
        />
        <div style={{ textAlign: 'center' }}>
          <button
            className="add-btn"
            style={{ padding: '0.5em', marginTop: '0.5em' }}
            onClick={() => auth(field, setIsPopupVisible, attribute)}
            ref={submit_btn}
          >
            Применить
          </button>
          {/* {close_btn()} */}
        </div>
      </>
    );
  };
  
  const submit_btn = useRef();
  useKeypress('Enter', () => {
    submit_btn.current.click();
  });
  useKeypress('Escape', () => {
    setIsPopupVisible(false);
  });
  const input_router = () => {
    switch (field.type) {
      case undefined:
        return input_field(field.type);
      case 'exam':
        return choose_boolean(field, setIsPopupVisible, 'Экзамен', 'Зачёт');
      case 'sex':
        return choose_boolean(field, setIsPopupVisible, 'Мужской', 'Женский');
      case 'date':
        return choose_date(field, setIsPopupVisible, attribute, set_attribute, submit_btn);
      case 'group':
        return choose_list(field, set_attribute, get_req('groups'), submit_btn, setIsPopupVisible, attribute);
        // const initial_group = [...select_ref.options].filter((elem)=>elem.value === field.group_label)[0]
        // initial_group.selected = true

    }
  };
  
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        {/* <span>{field.label}</span> */}
      </div>
      <div>{input_router()}</div>
    </div>
  );
};

export default EditValueModal;

export const choose_list = (field, set_attribute, options, submit_btn, setIsPopupVisible, attribute, selected_option, selected_trainer) => {
  return (
    <>
      <select
        className="field"
        style={{width: '8em', textAlign: 'left'}}
        defaultValue={field.group_label}
        onChange={(e) => {
          set_attribute(
            e.target.options[e.target.options.selectedIndex].id
          );
        }}
      >
      {options.map((option, i) => (
        <option key={i} id={option.id}>
          {option.cipher}-{option.start_year}-{option.number}
        </option>
      ))}
    </select>
      <div style={{ textAlign: 'center' }}>
        <button
          className="add-btn"
          style={{ padding: '0.5em', marginTop: '0.5em' }}
          onClick={() => auth(field, setIsPopupVisible, attribute, selected_option, selected_trainer)}
          ref={submit_btn}
        >
          Применить
        </button>
        {/* {close_btn()} */}
      </div>
    </>
  );
};

async function auth(field, setIsPopupVisible, attribute, selected_option, selected_trainer) {
  if (field.type === 'select') {
    console.log(selected_option, selected_trainer);
    if (typeof field.options[0] === 'object')
      await async_put(`${field.put_req}${selected_trainer}`);
    else await async_put(`${field.put_req}${selected_option}`);
    await setIsPopupVisible(false);
  }
  // console.log(`${field.put_req}${attribute}`,(new RegExp(field.regex).test(attribute)))
  else if (new RegExp(field.regex).test(attribute)) {
    console.log(`${field.put_req}${attribute}`)
    await async_put(`${field.put_req}${attribute}`);
    // console.log(await async_get('groups'))
    console.log(`${field.put_req}${attribute}`);
    // console.log(!!field.upd_st, localStorage[field.upd_st])
    if (field.upd_st) localStorage[field.upd_st] = attribute;
    await setIsPopupVisible(false);
    window.location.reload();
  } else {
    document.querySelector('.field').classList.add('invalid');
  }
}

export const choose_date = (field, setIsPopupVisible, attribute, set_attribute, submit_btn ,selected_option, selected_trainer) => {
  return (
    <>
      <input
        autoFocus
        className="field"
        type={'date'}
        defaultValue={'2002-01-01'}
        onChange={(e) => {set_attribute(e.target.value)}}
      />
      <div style={{ textAlign: 'center' }}>
        <button
          className="add-btn"
          style={{ padding: '0.5em', marginTop: '0.5em' }}
          onClick={() => auth(field, setIsPopupVisible, attribute, selected_option, selected_trainer)}
          ref={submit_btn}
        >
          Применить
        </button>
        {/* {close_btn()} */}
      </div>
    </>
  );
};

export const choose_boolean = (field, setIsPopupVisible, option1, option2) => {
  return (
    <>
      <button
        className="add-btn"
        style={{ padding: '0.5em' }}
        onClick={async () => {
          await async_put(`${field.put_req}${true}`);
          await setIsPopupVisible(false);
          window.location.reload();
        }}
      >
        {option1}
      </button>
      <button
        className="add-btn"
        style={{ padding: '0.5em', marginLeft: '0.5em' }}
        onClick={async () => {
          await async_put(`${field.put_req}${false}`);
          await setIsPopupVisible(false);
          window.location.reload();
        }}
      >
        {option2}
      </button>
    </>
  );
};