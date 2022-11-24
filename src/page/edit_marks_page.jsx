import { React } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { inputField } from '../components/input_field/input_field';
import MenuBar from '../components/side_menu/side_menu';
import Popup from '../popup/popup_base';
import { get_req } from '../server-api/requests_api';
import { listApi } from '../utills/list_api';
import { registerEntity } from '../utills/register_entity';
import { registrationEntityFields } from '../utills/registration_entity_fields';
import { printDiv } from '../utills/print_div'
import { getCookie } from '../utills/cookies_api';

const EditMarksPage = () => {
  document.title = 'Преподавательская ведомость';
  const [id, set_id] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [currentPopup, setCurrentPopup] = useState('');
  const [subjectId, setSubjectId] = useState(getCookie('subject_id'));
  const [groupId, setGroupId] = useState(getCookie('group_id'));

  const marks = get_req(`result_list/marks/${subjectId}/${groupId}`);
  const students_data = get_req('student/group_id/' + groupId);
  const student_labels = students_data.map((elem) => {
    return {
      id: elem.id,
      label: `${elem.surname} ${elem.name} ${elem.patronym}`,
    };
  });
const groups_data = get_req('groups')
const group_labels = groups_data.map(elem=>{
  return {id: elem.id, label: `${elem.cipher}-${elem.start_year}-${elem.number}`}
})
  // const subjects_data = get_req('subjectsid')
  // const subject_labels = subjects_data.map(elem=>{
  //   return {id: elem.id, label: `${elem.name} (${elem.exam_label})`}
  // })
  // console.log(subject_labels)
  const requests = listApi(6);
  // const elem = await async_get(requests.get);
  const [searchResults, ] = useState(marks);
  const [field_data, set_field_data] = useState({});
  // const search = document.querySelector('.search-bar') || {}
  const registration_fields = registrationEntityFields(6);
  // console.log(registration_fields)
  const fields_storage = useRef();
  const registration_fields_ref = useRef({});
  const post_api = requests.field_put;

  const active_popup = (a) => {
    setCurrentPopup(a);
    setIsPopupVisible(true);
  };

  const Cell = ({ elem, requests, i }) => {
    return (
      <td
        className="td-clickable"
        style={{ textAlign: 'center' }}
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
      <span>
        {/* на эту строчку потрачено 4 часа, она нужна для обновления списка после поиска и перехода в другой раздел меню */}
        <MenuBar />
      </span>
      <button
        className="add-btn"
        style={{
          position: 'absolute',
          right: 0,
          fontSize: '1.5em',
          top: '0.5em',
        }}
        onClick={() => {
          // window.print();
          printDiv('.wrap', 'style.css')
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
          <span
            ref={(el) => {
              registration_fields_ref.current[registration_fields[3].name] = el;
            }}
            style={{ display: 'inline-block' }}
          >
            {inputField(registration_fields[3], 3, setSubjectId)}
          </span>
          <span
            ref={(el) => {
              registration_fields_ref.current[registration_fields[4].name] = el;
            }}
            style={{ display: 'inline-block' }}
          >
            {inputField({...registration_fields[4], options: group_labels}, 4, setGroupId)}
          </span>
        </div>
      </div>
      <div style={{}}>
        <div className="wrap">
          <table className="table-editable">
            <thead>
              <tr>
                {requests.field_titles.map((key) => (
                  <td className="td-non-select">{key}</td>
                ))}
                <td />
              </tr>
            </thead>
            <tbody>
              {marks.map((elem, i) => (
                <tr
                  className="competition_list_row"
                  key={i + 'tr'}
                  onClick={() => {
                    console.log(elem);
                    // console.log(requests.fields)
                    // navigate('/competition?id=' + elem.id);
                  }}
                >
                  <Cell
                    elem={elem}
                    requests={requests}
                    i={0}
                  />
                  <Cell
                    elem={elem}
                    requests={requests}
                    i={1}
                  />
                  <Cell
                    elem={elem}
                    requests={requests}
                    i={2}
                  />
                  <Cell
                    elem={elem}
                    requests={requests}
                    i={3}
                  />
                  <Cell
                    elem={elem}
                    requests={requests}
                    i={4}
                  />
                  <td
                    className="td-clickable"
                    onClick={(e) => {
                      e.target.parentElement.style = 'display: none';
                      // console.log(requests.delete+elem.id)
                      // del_req(requests.delete + elem.id);
                    }}
                  >
                    {'[Удалить]'}
                  </td>
                </tr>
              ))}
              {student_labels.length !== 0 && (
                <tr ref={fields_storage}>
                  <td
                    colSpan={3}
                    ref={(el) => {
                      registration_fields_ref.current[
                        registration_fields[0].name
                      ] = el;
                    }}
                  >
                    {inputField(
                      { ...registration_fields[0], options: student_labels },
                      0
                    )}
                  </td>
                  <td
                    ref={(el) => {
                      registration_fields_ref.current[
                        registration_fields[1].name
                      ] = el;
                    }}
                  >
                    {inputField(registration_fields[1], 1)}
                  </td>
                  <td
                    ref={(el) => {
                      registration_fields_ref.current[
                        registration_fields[2].name
                      ] = el;
                    }}
                  >
                    {inputField(registration_fields[2], 2)}
                  </td>
                  <td
                    className="td-clickable"
                    onClick={() => {
                      registerEntity(
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
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EditMarksPage;
