import React, { useState } from 'react';
import POPUP_MODAL from './popup_modal';

// import AllTrainers from '../page/list_page';

// import Judging from '../competition/judge-comp';
// import ResComp from '../competition/res-comp';
// import Illustration from '../competition/illusttation';

// import RegisteredAthlet from '../athlets/reged-ath';
// import ViewInfo from '../components/view_info_modal';
// import UnregAthList from '../athlets/unreg-athlet';
import EditValueModal from '../components/edit_value_modal';

const Popup = ({ active, setActive, nameWindow, param, obj, bool }) => {
  const [isPopupVisible, setIsPopupVisible] = useState(active);
  const currentPopup = nameWindow;
  const PopupBody = {
    // all_trainers: AllTrainers,

    // judging: Judging.bind(null, { id_comp: param }),
    // result_comp: ResComp.bind(null, { id_comp: param }),
    // comp_illustration: Illustration,

    // account_info: ViewInfo.bind(null, { ability_edit: bool, acc_json: obj }),
    // reged_ath: RegisteredAthlet.bind(null, {
    //   id_comp: param,
    //   button_ability: bool,
    // }),
    // unreg_ath: UnregAthList.bind(null, { id_comp: param }),

    edit_value_modal: EditValueModal.bind(null, {
      setIsPopupVisible: setActive,
      field: obj,
    }),
  }[currentPopup];
  return (
    <div onClick={() => setActive(false)}>
      {isPopupVisible && (
        <POPUP_MODAL active={isPopupVisible} setActive={setIsPopupVisible}>
          <PopupBody />
        </POPUP_MODAL>
      )}
    </div>
  );
};

// function Popup({setActive, param, obj, bool}){
//   const [isPopupVisible, setIsPopupVisible] = useState(false)
//   const [currentPopup, setCurrentPopup] = useState('')
//   this.Active = function(a){
//       console.log(a)
//       setCurrentPopup(a)
//       setIsPopupVisible(true)
//   }
//   const PopupBody = {
//       comp_info: InfoComp.bind(null, {elem: obj}),
//       reg_com: RegCom,
//       filter: Filter,
//       reged_ath: RegisteredAthlet.bind(null, {id_comp: param, button_ability: bool}),
//       judging: Judging.bind(null, {id_comp: param}),
//       result_comp: ResComp.bind(null, {id_comp: param}),
//       run_list: RunList.bind(null, {id_comp: param}),
//       all_aths: AllAths,
//       all_trainers: AllTrainers,
//       reg_ath: regAthlet,
//       ath_info: AthInfo.bind(null, {id_ath: param}),

//   }[currentPopup]
//   this.return = (
//       <div onClick={() => setActive(false)}>
//           {isPopupVisible&&<POPUP_MODAL active={isPopupVisible} setActive={setIsPopupVisible}><PopupBody/></POPUP_MODAL>}
//       </div>
//   )
// }

export default Popup;
