import { get_req } from '../server-api/requests_api';
import { listApi } from './list_api';
const groups_data = get_req('groups')
const group_labels = groups_data.map(elem=>{
  return {id: elem.id, label: `${elem.cipher}-${elem.start_year}-${elem.number}`}
})
const students_data = get_req('students')
const student_labels = students_data.map(elem=>{
  return {id: elem.id, label: `${elem.surname} ${elem.name} ${elem.patronym}`}
})
const subjects_data = get_req('subjects')
const subject_labels = subjects_data.map(elem=>{
  return {id: elem.id, label: `${elem.name} (${elem.exam_label})`}
})

const nowDate = new Date()
const defaultDateValue = `${nowDate.getFullYear()}-${nowDate.getMonth()+1}-${nowDate.getDate()}`

export function registrationEntityFields(entity) {
  const api = listApi(entity)
  switch (entity) {
    case 1:
      return [
        {
          label: api.field_titles[0],
          name: api.fields[0],
          required: true,
          regex: api.field_regexs[0],
        },
        {
          label: api.field_titles[1],
          name: api.fields[1],
          required: true,
          regex: api.field_regexs[1],
        },
        {
          label: api.field_titles[2],
          name: api.fields[2],
          required: true,
          regex: api.field_regexs[2],
        },
      ];
    case 2:
      return [
        {
          label: api.field_titles[0],
          name: api.fields[0],
          required: true,
          regex: api.field_regexs[0],
        },
        {
          label: api.field_titles[1],
          name: api.fields[1],
          required: true,
          regex: api.field_regexs[1],
        },
        {
          label: api.field_titles[2],
          name: api.fields[2],
          required: true,
          regex: api.field_regexs[2],
        },
        {
          label: api.field_titles[3],
          name: api.fields[3],
          required: true,
          regex: api.field_regexs[3],
          type: api.field_types[3],
          options: [{id: 'true', label: 'М'}, {id: 'false', label: 'Ж'}],
        },
        {
          label: api.field_titles[4],
          name: api.fields[4],
          required: true,
          regex: api.field_regexs[4],
          type: api.field_types[4],
          default_value: '2002-01-01',
        },
        {
          label: api.field_titles[5],
          name: api.fields[5],
          required: true,
          regex: api.field_regexs[5],
          type: api.field_types[5],
          options: group_labels,
        },
      ];
    case 3:
      return [
        {
          label: api.field_titles[0],
          name: api.fields[0],
          required: true,
          regex: api.field_regexs[0],
        },
        {
          label: api.field_titles[1],
          name: api.fields[1],
          required: true,
          regex: api.field_regexs[1],
        },
        {
          label: api.field_titles[2],
          name: api.fields[2],
          required: true,
          regex: api.field_regexs[2],
          type: api.field_types[2],
          options: [{id: 'true', label: 'Экзамен'}, {id: 'false', label: 'Зачёт'}],
        },
      ];
    case 5:
      return [
        {
          label: 'Логин',
          name: 'login',
          regex: '^[a-zA-Zа-яА-Яё0-9]+$',
          required: true,
        },
        {
          label: 'Имя',
          name: 'name',
          regex: '^[a-zA-Zа-яА-Яё]+$',
          required: true,
        },
        {
          label: 'Фамилия',
          name: 'surname',
          regex: '^[a-zA-Zа-яА-Яё]+$',
          required: true,
        },
        {
          label: 'Отчество',
          name: 'patronym',
          regex: '^[a-zA-Zа-яА-Яё]+$',
          required: true,
        },
        {
          label: 'Пароль',
          type: 'password',
          name: 'password',
          // regex: `^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!&$%&? "]).*$`
          regex: `^[a-zA-Zа-яА-Яё0-9]+$`,
          required: true,
        },
        {
          label: 'E-mail',
          name: 'email',
          regex:
            "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
          required: false,
        },
        {
          label: 'Телефон',
          name: 'phone',
          regex: '^[+][7][9][0-9]{9}$',
          required: false,
        },
      ];
    case 6:
      return [
        {
          label: api.field_titles[0],
          name: 'student_id',
          required: true,
          regex: '',
          type: api.field_types[0],
          options:  student_labels,
        },
        {
          label: api.field_titles[3],
          name: api.fields[3],
          required: true,
          regex: api.field_regexs[3],
        },
        {
          label: api.field_titles[4],
          name: api.fields[4],
          required: true,
          regex: api.field_regexs[4],
          type: api.field_types[4],
          default_value: defaultDateValue,
        },
        {
          label: 'Предмет',
          name: 'subject_id',
          required: false,
          regex: '',
          options: subject_labels,
          type: 'select_state',
        },
        {
          label: 'Группа',
          name: 'group_id',
          required: false,
          regex: '',
          options: group_labels,
          type: 'select_state',
        },
      ];
    default:
      return [];
  }
}
