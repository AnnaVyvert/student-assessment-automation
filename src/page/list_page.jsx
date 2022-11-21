import React, { useEffect, useRef, useState } from 'react';
import {
  async_get,
  async_post,
  del_req,
  get_req,
} from '../server-api/requests_api';
import Popup from '../popup/popup_base';
import MenuBar from '../components/side_menu/side_menu';
import SearchBar from '../components/search_bar/search_bar';
import { listApi } from '../utills/list_api';
import { registrationEntityFields } from '../utills/registration_entity_fields';
import { inputField } from '../components/input_field/input_field';

const ListPage = ({ role_id }) => {
  document.title = 'Список';
  const [id, set_id] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentPopup, setCurrentPopup] = useState('');
  const requests = listApi(role_id);
  const registration_fields = registrationEntityFields(role_id);
  // const elem = await async_get(requests.get);
  const elem = get_req(requests.get);
  const [searchResults, setSearchResults] = useState(elem);
  const [field_data, set_field_data] = useState({});

  const post_api = requests.field_put;
  const fields_storage = useRef();
  const registration_fields_ref = useRef({});
  resetFields(fields_storage);
  let form_data = {};
  const onChange = (e) => {
    form_data = { ...form_data, [e.target.name]: e.target.value };
  };

  const active_popup = (a) => {
    setCurrentPopup(a);
    setIsPopupVisible(true);
  };

  const Cell = ({ elem, requests, i }) => {
    return (
      <td
        className="td-clickable"
        key={i + 'td'}
        onClick={(e) => {
          set_field_data({
            ...elem,
            label: requests.field_titles[i],
            value: e.target.textContent,
            regex: requests.field_regexs[i],
            put_req: `${requests.field_put}/${elem.id}/${requests.fields[i]}/`,
            type: requests.field_types[i],
          });
          setIsPopupVisible(true);
        }}
      >
        {elem[requests.field_labels[i]]}
      </td>
    );
  };
  return (
    <>
      {isPopupVisible && (
        <Popup
          active={isPopupVisible}
          setActive={setIsPopupVisible}
          nameWindow={'edit_value_modal'}
          param={{ entity: requests.list, post_api: '/api/' + requests.list }}
          bool={true}
          obj={field_data}
        />
      )}
      <span onClick={() => setSearchResults(elem)}>
        {/* на эту строчку потрачено 4 часа, она нужна для обновления списка после поиска и перехода в другой раздел меню */}
        <MenuBar />
      </span>
      <div
        style={{
          backgroundColor: '#202020',
          textAlign: 'center',
          // borderRadius: '0.5em',
          fontVariantCaps: 'all-petite-caps',
          fontSize: '1.4em',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: '2em',
            paddingTop: '1.4em',
            fontWeight: 'bold',
          }}
        >
          {requests.title}
        </div>
        <div>
          <SearchBar
            elem={elem}
            setSearchResults={setSearchResults}
            type={requests.list}
          />
        </div>
      </div>
      <div style={{}}>
        <div className="wrap">
          <table className="table-editable">
            <thead>
              <tr>
                {requests.field_titles.map((key, i) => (
                  <td className="td-non-select">{key}</td>
                ))}
                <td />
              </tr>
            </thead>
            <tbody>
              {searchResults.map((elem, i) => (
                <tr
                  className="competition_list_row"
                  key={i + 'tr'}
                  onClick={() => {
                    console.log(elem);
                    // console.log(requests.fields)
                    // navigate('/competition?id=' + elem.id);
                  }}
                >
                  {requests.fields.map((key, i2) => (
                    <Cell
                      elem={elem}
                      requests={requests}
                      i={i2}
                      key={'td' + i2}
                    />
                  ))}
                  <td
                    className="td-clickable"
                    onClick={(e) => {
                      e.target.parentElement.style = 'display: none';
                      // console.log(requests.delete+elem.id)
                      del_req(requests.delete + elem.id);
                    }}
                  >
                    {'[Удалить]'}
                  </td>
                </tr>
              ))}
              <tr ref={fields_storage}>
                {registration_fields.map((elem, i) => (
                  <td
                    ref={(el) => {
                      registration_fields_ref.current[elem.name] = el;
                    }}
                    onClick={() => {
                      // console.log(registration_fields_ref.current)
                      // console.log(Object.keys(registration_fields_ref.current))
                    }}
                  >
                    {inputField(elem, i)}
                  </td>
                ))}
                <td
                  className="td-clickable"
                  onClick={() => {
                    register(
                      registration_fields,
                      registration_fields_ref.current,
                      fields_storage,
                      post_api
                    );
                  }}
                >
                  {'[Создать]'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ListPage;

async function register(fields, registration_fields_ref, ref, post_api) {
  const registration_fields_keys = Object.keys(registration_fields_ref);

  console.log(registration_fields_ref);
  const form_data = {};
  for (let elem of registration_fields_keys) {
    const target = registration_fields_ref[elem].firstChild;
    console.log(target);
    form_data[elem] =
      target.type === 'select-one'
        ? target.options[target.options.selectedIndex].id
        : registration_fields_ref[elem].firstChild.value;
  }

  console.log(form_data);
  if (form_data.trainer_id !== undefined)
    form_data = { ...form_data, trainer_id: form_data.trainer_id.id };
  console.log(post_api);
  if (!validateFields(fields, form_data, ref))
    return console.log('failed validate');
  await async_post(post_api, form_data);
  if (ref.current !== undefined)
    [...ref.current.querySelectorAll('.field')].map((elem) => {
      elem.classList.remove('valid');
      return elem.classList.remove('invalid');
    });
  window.location.reload();
}

function validateFields(fields, form_data, ref) {
  console.log(fields);
  console.log(form_data);
  const validated = fields.map((elem) => {
    if (
      !elem.required &&
      (form_data[elem.name] === undefined || form_data[elem.name] === '')
    )
      return true;
    if (form_data[elem.name] === undefined) return false;
    return !elem.required || new RegExp(elem.regex).test(form_data[elem.name]);
  });

  const dates = [...ref.current.querySelectorAll('.field')].filter((elem) => {
    return elem.type === 'date';
  });
  if (dates.length === 2) {
    const date1 = new Date(dates[0].value).getTime();
    const date2 = new Date(dates[1].value).getTime();
    console.log(!date1 || !date2 || date1 > date2);
    if (date1 > date2) {
      validated[1] = false;
      validated[2] = false;
    }
  }

  console.log(validated);
  if (!validated.includes(false)) {
    return true;
  } else {
    [...ref.current.querySelectorAll('.field')].map((elem, i) =>
      validated[i]
        ? elem.setAttribute('class', 'field valid')
        : elem.setAttribute('class', 'field invalid')
    );
  }
}

function resetFields(ref) {
  if (ref.current !== undefined)
    [...ref.current.querySelectorAll('.field')].map((elem) => {
      elem.classList.remove('valid');
      elem.value = '';
      return elem.classList.remove('invalid');
    });
}


