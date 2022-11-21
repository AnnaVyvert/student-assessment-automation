export const inputField = (elem, i) => {
  // console.log(elem);
  switch (elem.type) {
    case 'group':
      return select(i, elem.options, elem.name);
    case 'sex':
      return select(i, elem.options, elem.name);
    case 'exam':
      return select(i, elem.options, elem.name);
    case 'date':
      return input_date(i);
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
const input_date = (i) => (
  <input
    key={i}
    autoFocus
    className="field"
    type={'date'}
    defaultValue={'2002-01-01'}
  />
);