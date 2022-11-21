import React, { useEffect, useState } from 'react';
import { async_get, del_req, get_req } from '../server-api/requests_api';
import Popup from '../popup/popup_base';
import MenuBar from '../components/side_menu/side_menu';
import SearchBar from '../components/search_bar/search_bar';
import { listApi } from '../utills/list_api';

const FinalList = ({}) => {
  document.title = 'Итоговая ведомость';
  const [id, set_id] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentPopup, setCurrentPopup] = useState('');
  const subjects = get_req('subjects')
  const students = get_req('students');
  console.log(subjects)
  const requests = listApi(5);
  // const elem = await async_get(requests.get);
  const [searchResults, setSearchResults] = useState(students);
  const [field_data, set_field_data] = useState({});
  // const search = document.querySelector('.search-bar') || {}

  const active_popup = (a) => {
    setCurrentPopup(a);
    setIsPopupVisible(true);
  };

  const Cell = ({elem, requests, i}) => {
    return (
      <td
        className='td-non-select'
        style={{textAlign: 'center'}}
        key={i+'td'}
        onClick={(e) => {
          
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
      <span onClick={() => setSearchResults(students)}>
        {/* на эту строчку потрачено 4 часа, она нужна для обновления списка после поиска и перехода в другой раздел меню */}
        <MenuBar />
      </span>
      <button
        className='add-btn'
        style={{position: 'absolute', right: 0, fontSize: '1.5em', top: '0.5em'}}
        onClick={()=>{
          window.print()
        }}
      >
        Печать
      </button>
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
            elem={students}
            setSearchResults={setSearchResults}
            type={'final_list'}
          />
        </div>
      </div>
      <div style={{}}>
        <div className="wrap">
          <table className="table-editable">
            <thead>
              <tr>
                <td />
                {subjects.map((key, i) => (
                  <td className='td-non-select'>
                    {key.name}
                  </td>
                ))}
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
                <td className='td-non-select'>
                  {elem.surname} {elem.name} {elem.patronym}
                </td>
                {subjects.map((key, i2) => (
                  <Cell elem={elem} requests={requests} i={i2} key={'td'+i2}/>
                ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default FinalList;