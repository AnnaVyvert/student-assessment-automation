import React, { useEffect, useState } from 'react';
import { async_get, del_req, get_req } from '../server-api/requests_api';
import Popup from '../popup/popup_base';
import MenuBar from '../components/side_menu/side_menu';
import SearchBar from '../components/search_bar/search_bar';
import { listApi } from '../utills/list_api';

const ListPage = ({ role_id }) => {
  const [id, set_id] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentPopup, setCurrentPopup] = useState('');
  const requests = listApi(role_id);
  // const elem = await async_get(requests.get);
  const elem = get_req(requests.get);
  const [searchResults, setSearchResults] = useState(elem);
  document.title = 'Список';
  const [field_data, set_field_data] = useState({});
  // const search = document.querySelector('.search-bar') || {}

  const active_popup = (a) => {
    setCurrentPopup(a);
    setIsPopupVisible(true);
  };

  const Cell = ({elem, requests, i}) => {
    return (
      <td
        className='td-clickable'
        key={i+'td'}
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
                  <td className='td-non-select'>{key}</td>
                ))}
                <td />
              </tr>
            </thead>
            <tbody>
              {searchResults.map((elem, i) => (
                <tr
                  className="competition_list_row"
                  key={i+'tr'}
                  onClick={() => {
                    console.log(elem)
                    // console.log(requests.fields)
                    // navigate('/competition?id=' + elem.id);
                  }}
                >
                {requests.fields.map((key, i2) => (
                  <Cell elem={elem} requests={requests} i={i2} key={'td'+i2}/>
                ))}
                  <td
                    className='td-clickable'
                    onClick={(e)=>{
                      e.target.parentElement.style = 'display: none'
                      // console.log(requests.delete+elem.id)
                      // del_req(requests.delete+elem.id)
                    }}
                  >
                    {'[Удалить]'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {
        <button
          className="absolute-bottom-btn"
          onClick={() => {
            active_popup('reg_com');
          }}
        >
          Добавить
        </button>
      }
    </>
  );
};

export default ListPage;
