import { useRef } from 'react';
import { useState } from 'react';
import useKeypress from 'react-use-keypress';
import { async_get, async_put, get_req } from '../server-api/requests_api';

const EditValueModal = ({ setIsPopupVisible, field }) => {
  // const elem = get_req(`/api/account/id/${id}`)[0]
  console.log(field)
  const [attribute, set_attribute] = useState(field.value);
  const [selected_option, set_selected_option] = useState(0);
  const [selected_trainer, set_selected_trainer] = useState(
    field.options === undefined
      ? 0
      : typeof field.options[0] === 'object'
      ? field.options[0].id
      : 0
  );
  const input_type = (type) => {
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
            onClick={() => auth()}
            ref={submit_btn}
          >
            Применить
          </button>
          {/* {close_btn()} */}
        </div>
      </>
    );
  };
  const choose_boolean = (option1, option2) => {
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
  const choose_date = () => {
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
            onClick={() => auth()}
            ref={submit_btn}
          >
            Применить
          </button>
          {/* {close_btn()} */}
        </div>
      </>
    );
  };
  const choose_list = (options) => {
    return (
      <>
        <select
          className="field"
          style={{width: '8em', textAlign: 'left'}}
          defaultValue={field.group_label}
          onChange={(e) => {
            set_selected_trainer(
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
            onClick={() => auth()}
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
  const bad_code = () => {
    switch (field.type) {
      case undefined:
        return input_type(field.type);
      case 'exam':
        return choose_boolean('Экзамен', 'Зачёт');
      case 'sex':
        return choose_boolean('Мужской', 'Женский');
      case 'date':
        return choose_date();
      case 'group':
        return choose_list(get_req('groups'));
        // const initial_group = [...select_ref.options].filter((elem)=>elem.value === field.group_label)[0]
        // initial_group.selected = true

    }
  };
  async function auth() {
    if (field.type === 'select') {
      console.log(selected_option, selected_trainer);
      if (typeof field.options[0] === 'object')
        await async_put(`${field.put_req}${selected_trainer}`);
      else await async_put(`${field.put_req}${selected_option}`);
      await setIsPopupVisible(false);
    }
    // console.log(`${field.put_req}${attribute}`,(new RegExp(field.regex).test(attribute)))
    else if (new RegExp(field.regex).test(attribute)) {
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
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        {/* <span>{field.label}</span> */}
      </div>
      <div>{bad_code()}</div>
    </div>
  );
};

export default EditValueModal;
