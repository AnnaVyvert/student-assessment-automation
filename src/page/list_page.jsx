import React, { useState } from 'react';
import { del_req, get_req } from '../server-api/requests_api';
import Popup from '../popup/popup_base';
import MenuBar from '../components/side_menu/side_menu';
import { accountValidate } from '../utills/account_validate';
import NotFoundPage from './404page';
import SearchBar from '../components/search_bar/search_bar';
  
const ListPage = ({ role_id }) => {
  const [id, set_id] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentPopup, setCurrentPopup] = useState('');
  const requests = get_req_router(role_id);
  const elem = get_req(requests.get);
  const [searchResults, setSearchResults] = useState(elem);
  // console.log(searchResults);
  document.title = 'Список';
  const acc_json = { id: id, role_id: role_id, get_info: requests.get_info };
  // const search = document.querySelector('.search-bar') || {}
  // search.value=''

  const active_popup = (a) => {
    setCurrentPopup(a);
    setIsPopupVisible(true);
  };
  // const elem = get_req(`/api/account/${role_id}`)

  return (
    <>
      {isPopupVisible && (
        <Popup
          active={isPopupVisible}
          setActive={setIsPopupVisible}
          nameWindow={currentPopup}
          param={{ entity: requests.list, post_api: '/api/' + requests.list }}
          bool={true}
          obj={acc_json}
        />
      )}
      <span onClick={()=>setSearchResults(elem)}>
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
      <div
        style={{  }}
      >
        <div className="wrap">
          <table className='table-editable'>
            <thead>
              <tr>
                <td>{requests.field_titles[0]}</td>
                <td>{requests.field_titles[1]}</td>
                <td>{requests.field_titles[2]}</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
            {searchResults.map((elem, i) => (
                <tr
                  className="competition_list_row"
                  key={i}
                  onClick={() => {
                    // navigate('/competition?id=' + elem.id);
                  }}
                >
                  <td>
                    {elem[requests.fields[0]]}
                  </td>
                  <td>{elem[requests.fields[1]]}</td>
                  <td>{elem[requests.fields[2]]}</td>
                  <td>
                    [Удалить]
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
      {(
        <button
          className="absolute-bottom-btn"
          onClick={() => {
            active_popup('reg_com');
          }}
        >
          Добавить
        </button>
      )}
    </>
  );
};

export default ListPage;

function get_req_router(role_id) {
  switch (role_id) {
    case 1:
      return {
        list: 'group',
        get: 'groups',
        info: 'account_info',
        create: 'reg_ath',
        delete: 'group/',
        title: 'Список групп',
        get_info: 'group/',
        fields: ['cipher', 'start_year', 'number'],
        field_titles: ['Шифр', 'Год начала обучения', 'Номер группы'],
      };
    case 2:
      return {
        list: 'student',
        get: 'students',
        info: 'account_info',
        create: 'reg_trainer',
        delete: 'student/',
        title: 'Список  студентов',
        get_info: 'student/',
        fields: ['surname', 'name', 'patronym'],
        field_titles: ['Фамилия', 'Имя', 'Отчество'],
      };
    case 3:
      return {
        list: 'subject',
        get: 'subjects',
        info: 'account_info',
        create: 'null',
        delete: 'subject/',
        title: 'Список предметов',
        get_info: 'subject/',
        fields: ['name', 'hours', 'exam_field'],
        field_titles: ['Название', 'Количество часов', 'Экзамен?'],
      };
    default:
      return [];
  }
}
