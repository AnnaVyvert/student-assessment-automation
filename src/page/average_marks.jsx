import React, { useEffect, useState } from 'react';
import { async_get, del_req, get_req } from '../server-api/requests_api';
import Popup from '../popup/popup_base';
import MenuBar from '../components/side_menu/side_menu';
import SearchBar from '../components/search_bar/search_bar';
import { listApi } from '../utills/list_api';
import { printDiv } from '../utills/print_div';

const AverageMarks = ({}) => {
  document.title = 'Средняя успеваемость';
  const [id, set_id] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentPopup, setCurrentPopup] = useState('');
  const subjects = get_req('subjects')
  const students = get_req('students');
  const avg_marks = get_req('result_list/final')
  // const max_marks = get_req('result_list/max_marks')
  // console.log(students)
  // console.log(avg_marks)
  // console.log(subjects)
  // console.log(max_marks)
  const requests = listApi(4);
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
          // window.print()
          printDiv('.wrap', 'style.css')
        }}
      >
        {'Печать'}
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
        <div className="wrap" style={{overflowX: 'scroll'}}>
          <table className='table-result' style={{textAlign: 'center'}}>
            <thead>
              <tr>
                <td/>
                {subjects.map((key, i) => (
                  <td>
                    {key.name}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {searchResults.map((el, i)=>{
                // console.log('sub:', i)
                return(
                  <tr>
                    <td>
                      {el.surname} {el.name} {el.patronym}
                    </td>
                  {subjects.map((el2, i2)=>{
                    let findObject = avg_marks.find(elem => {return elem.subject_id === el2.id && elem.student_id === el.id})
                    console.log(el.id, el2.id, avg_marks.filter(elem => {return elem.subject_id === el.id && elem.st_id === el2.id})[0])
                    findObject = !!findObject? findObject.avg.substring(0,4) : '-' 
                    return(
                      <td>
                        {findObject}
                      </td>
                    );
                  })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AverageMarks;