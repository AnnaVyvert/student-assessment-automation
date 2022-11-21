import { useState } from "react";
import Popup from "../popup/popup_base";
import { get_req } from "../server-api/requests_api";
import { get_fields } from "../utills/info_modal_fields";
const ViewInfo = ({ ability_edit, acc_json }) => {
  console.log(acc_json);
  // const acc_data = get_req(`/api/account/id/${id}`)
  const acc_data = get_req(acc_json.get_info + acc_json.id);
  // console.log(acc_json.get_info+acc_json.id)

  console.log(acc_data);

  const fields_data = get_fields(acc_data, acc_json.role_id);
  // console.log(fields_data)
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [field_data, set_field_data] = useState({});
  const currentPopup = "edit_value_modal";
  const edit_btn = (elem) => (
    <img
      alt=''
      style={{padding: '0', cursor: 'pointer'}}
      src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png"
      onClick={() => {
        set_field_data({ ...elem });
        setIsPopupVisible(true);
      }}
    />
  );
  const lock_btn = () => (
    <img
      alt=''
      style={{padding: '0'}}
      src="https://cdn-icons-png.flaticon.com/512/2549/2549910.png"
    />
  );
  const empty_field = () => {
    return <span style={{ color: "red" }}>не указано</span>;
  };
  return (
    <>
      {isPopupVisible && (
        <Popup
          active={isPopupVisible}
          setActive={setIsPopupVisible}
          nameWindow={currentPopup}
          obj={field_data}
        />
      )}
      <table style={{ textAlign: "center" }} className="personal_table">
        <caption className="caption">
          Информация:
        </caption>
        <tbody style={{ display: "inline-block", textAlign: "left" }}>
          {fields_data.map((elem, i) => (
            <tr key={i}>
              <td>{elem.label}</td>
              <td>{elem.value ? elem.value : empty_field()}</td>
              {ability_edit && (elem.put_req? <td>{edit_btn(elem)}</td> : <td>{lock_btn()}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ViewInfo;
