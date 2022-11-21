import { async_post } from "../server-api/requests_api";

export async function registerEntity(fields, registration_fields_ref, ref, post_api) {
  const registration_fields_keys = Object.keys(registration_fields_ref);

  const form_data = {};
  for (let elem of registration_fields_keys) {
    const target = registration_fields_ref[elem].firstChild;
    form_data[elem] =
      target.type === 'select-one'
        ? target.options[target.options.selectedIndex].id
        : registration_fields_ref[elem].firstChild.value;
  }

  if (!validateFields(fields, form_data, ref))
    return console.log('failed validate');
  await async_post(post_api, form_data);
  if (ref.current !== undefined)
    [...ref.current.querySelectorAll('.field')].map((elem) => {
      elem.classList.remove('valid');
      return elem.classList.remove('invalid');
    });
  window.location.reload();
}

function validateFields(fields, form_data, ref) {
  const validated = fields.map((elem) => {
    if (
      !elem.required &&
      (form_data[elem.name] === undefined || form_data[elem.name] === '')
    )
      return true;
    if (form_data[elem.name] === undefined) return false;
    return !elem.required || new RegExp(elem.regex).test(form_data[elem.name]);
  });

  const dates = [...ref.current.querySelectorAll('.field')].filter((elem) => {
    return elem.type === 'date';
  });
  if (dates.length === 2) {
    const date1 = new Date(dates[0].value).getTime();
    const date2 = new Date(dates[1].value).getTime();
    console.log(!date1 || !date2 || date1 > date2);
    if (date1 > date2) {
      validated[1] = false;
      validated[2] = false;
    }
  }

  if (!validated.includes(false)) {
    return true;
  } else {
    [...ref.current.querySelectorAll('.field')].map((elem, i) =>
      validated[i]
        ? elem.setAttribute('class', 'field valid')
        : elem.setAttribute('class', 'field invalid')
    );
  }
}
