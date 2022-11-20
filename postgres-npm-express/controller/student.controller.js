const db = require('../database.js');

class student_controller {
  async create(req, res) {
    const { name, surname, patronym, sex, birth, group_id } = req.body;
    try {
      const call = await db.query(
        `INSERT INTO public.student (name, surname, patronym, sex, birth, group_id, deleted) 
            values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [name, surname, patronym, sex, birth, group_id, false]
      );
      res.json(call.rows[0]);
    } catch (e) {
      res.status(400).send(e);
    }
  }
  async get_one(req, res) {
    const id = req.params.id;
    try {
      const call = await db.query(
        `SELECT * FROM public.student where id = $1`,
        [id]
      );
      res.json(call.rows[0]);
    } catch (e) {
      res.status(400).send(e);
    }
  }
  async get_all(req, res) {
    // const call = await db.query(`SELECT id, name, surname, patronym, sex, birth, group_id FROM public.student where deleted = false order by surname`)
    const call = await db.query(
      `SELECT id, name, surname, patronym, sex, to_char("birth", 'DD/MM/YYYY') as birth, group_id, case sex when true then 'Мужской' else 'Женский' end as sex_label FROM public.student where deleted = false order by surname`
    );
    for (let i=0; i<call.rowCount; i++)
      call.rows[i].group_label = (await db.query(
        `SELECT CONCAT(cipher, '-', start_year, '-', number) as group_label FROM public.group where id = ${call.rows[i].group_id}`
      )).rows[0].group_label;
    // console.log(call.rows)
    res.json(call.rows);
  }
  async update_parameter(req, res) {
    const id = req.params.id;
    const column = req.params.column;
    const parameter = req.params.parameter;

    console.log(column, parameter, id);
    try {
      const call = await db.query(
        `UPDATE public.student set ${column} = '${parameter}' where id = $1 RETURNING *`,
        [id]
      );
      res.json(call.rows[0]);
    } catch (e) {
      res.status(400).send(e);
    }
  }
  async del_one(req, res) {
    const id = req.params.id;
    const call = await db.query(
      `UPDATE public.student set deleted = true where id = ${id} RETURNING *`
    );
    res.json(call.rows[0]);
  }
}

module.exports = new student_controller();
