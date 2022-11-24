import { getCookie, setCookie } from "../../utills/cookies_api";

export const inputField = (elem, i, state) => {
  console.log(elem);
  switch (elem.type) {
    case 'select_state':
      return select_state(i, elem.options, elem.name, state);
    case 'group':
      return select(i, elem.options, elem.name);
    case 'sex':
      return select(i, elem.options, elem.name);
    case 'exam':
      return select(i, elem.options, elem.name);
    case 'date':
      return input_date(i, elem.default_value);
    case 'datetime':
      return datetime(i, elem.name, elem.placeholder);
    default:
      return input(i, elem.type, elem.name, elem.label);
  }
};
const select = (i, options, name) => (
  <select
    key={i}
    name={name}
    className="field"
  >
    {options.map((elem, i) => (
      <option
        key={i}
        id={elem.id}
      >
        {elem.label}
      </option>
    ))}
  </select>
);
const select_state = (i, options, name, state) => {
  console.log(options.filter((el)=>{return el.id === parseInt(getCookie(name))})[0])
  return(
  <select
    key={i}
    name={name}
    className="field"
    onChange={(e)=>{
      state(e.target.options[e.target.selectedIndex].id)
      setCookie(name, e.target.options[e.target.selectedIndex].id, 7)
    }}
    // defaultValue={options.filter((el)=>{return el.id === 1})[0].label}
    defaultValue={options.filter((el)=>{return el.id === parseInt(getCookie(name))})[0].label}
  >
    {options.map((elem, i) => (
      <option
        key={i}
        id={elem.id}
      >
        {elem.label}
      </option>
    ))}
  </select>)};
const datetime = (i, name, placeholder) => (
  <input
    key={i}
    type={'datetime-local'}
    name={name}
    className="field"
    placeholder={placeholder}
    autoComplete="off"
  />
);
const input = (i, type, name, placeholder) => (
  <input
    key={i}
    type={type}
    name={name}
    className="field"
    placeholder={placeholder}
    autoComplete="off"
  />
);
const input_date = (i, default_value) => (
  <input
    key={i}
    autoFocus
    className="field"
    type={'date'}
    defaultValue={default_value}
  />
);