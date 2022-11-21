import { get_req } from '../server-api/requests_api';

export function listApi(role_id) {
  switch (role_id) {
    case 1:
      return {
        list: 'group',
        get: 'groups',
        info: 'account_info',
        create: 'reg_ath',
        delete: 'group/',
        title: 'Список групп',
        get_info: 'group/',
        fields: ['cipher', 'start_year', 'number'],
        field_labels: ['cipher', 'start_year', 'number'],
        field_titles: ['Шифр', 'Год начала обучения', 'Номер группы'],
        field_regexs: ['^[a-zA-Zа-яА-Яё]+$', '^[0-9]{2}$', '^[0-9]{1,2}$'],
        field_put: 'group',
        field_types: [],
      };
    case 2:
      return {
        list: 'student',
        get: 'students',
        info: 'account_info',
        create: 'reg_trainer',
        delete: 'student/',
        title: 'Список  студентов',
        get_info: 'student/',
        fields: ['surname', 'name', 'patronym', 'sex', 'birth', 'group_id'],
        field_labels: ['surname', 'name', 'patronym', 'sex_label', 'birth', 'group_label'],
        field_titles: ['Фамилия', 'Имя', 'Отчество', 'Пол', 'Дата рождения', 'Группа'],
        field_regexs: [
          '^[a-zA-Zа-яА-Яё]+$',
          '^[a-zA-Zа-яА-Яё]+$',
          '^[a-zA-Zа-яА-Яё]+$',
        ],
        field_put: 'student',
        field_types: [,,,'sex','date','group'],
      };
    case 3:
      return {
        list: 'subject',
        get: 'subjects',
        info: 'account_info',
        create: 'null',
        delete: 'subject/',
        title: 'Список предметов',
        get_info: 'subject/',
        fields: ['name', 'hours', 'exam'],
        field_labels: ['name', 'hours', 'exam_label'],
        field_titles: ['Название', 'Количество часов', 'Форма аттестации'],
        field_regexs: ['^[a-zA-Zа-яА-Яё]+$', '^[0-9]{2,3}$', ''],
        type: 'select',
        field_put: 'subject',
        field_types: [, , 'exam'],
      };
    case 5:
      return {
        list: 'group',
        get: 'groups',
        info: 'account_info',
        create: 'reg_ath',
        delete: 'group/',
        title: 'Итоговая ведомость',
        get_info: 'group/',
        fields: ['cipher', 'start_year', 'number'],
        field_labels: ['cipher', 'start_year', 'number'],
        field_titles: ['Шифр', 'Год начала обучения', 'Номер группы'],
        field_regexs: ['^[a-zA-Zа-яА-Яё]+$', '^[0-9]{2}$', '^[0-9]{1,2}$'],
        field_put: 'group',
        field_types: [],
      };
    default:
      return [];
  }
}
