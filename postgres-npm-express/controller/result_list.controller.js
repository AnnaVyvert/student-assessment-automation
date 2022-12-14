const db = require('../database.js');

class result_list_controller {
  async create(req, res){
    const {student_id, subject_id, mark, mark_date} = req.body
    console.log(student_id, subject_id, mark, mark_date)
    try{
        const call = await db.query(`INSERT INTO public.result_list (student_id, subject_id, mark, date, deleted) values ($1, $2, $3, $4, $5) RETURNING *`,
        [student_id, subject_id, mark, mark_date, false])
        res.json(call.rows[0])
    }catch(e){res.status(400).send(e)}
  }
  async get_one(req, res) {
    const id = req.params.id
    try{
      const call = await db.query(`SELECT * FROM public.result_list where id = $1`, [id])
      res.json(call.rows[0])      
    }catch(e){res.status(400).send(e)}
  }
  async get_all(req, res) {
    const call = await db.query(`SELECT id, student_id, subject_id, mark, date FROM public.result_list where deleted = false`)
    res.json(call.rows)
  }
  async get_final_list(req, res){
    // const call = await db.query(`select *, AVG(mark::int) from public.result_list;`)
    const call = await db.query(`select student_id, subject_id, su_name, st_id, st_surname, st_name, st_patronym, avg(mark::int) from 
    (select a.*, b.id as su_id, b.name as su_name from 
    (SELECT a.*, b.id as st_id, b.name as st_name, b.surname as st_surname, b.patronym as st_patronym 
    from 
    result_list a
    INNER JOIN student b ON b.id = a.student_id where b.deleted = false and a.deleted = false) 
    a INNER JOIN subject b ON b.id = a.subject_id) as two 
    group by student_id, subject_id, su_name, st_id, st_surname, st_name, st_patronym order by st_surname;
    `)
    res.json(call.rows)
  }
  async get_marks(req, res){
    const subject_id = req.params.subject_id
    const group_id = req.params.group_id
    const call = await db.query(`select max(count) from (select count(*) from public.result_list where deleted = false group by student_id, subject_id) as mark_n;`)
    // const call = await db.query(`select *, to_char("date", 'DD/MM/YYYY') as mark_date from public.result_list rl, public.student st 
    // where rl.student_id = st.id and rl.deleted = false and rl.subject_id = $1 and st.group_id = $2 
    // order by rl.date NULLS LAST`,
    // [subject_id, group_id])
    res.json(call.rows[0].max)
  }
  async get_marks_by_group_subject(req, res){
    const subject_id = req.params.subject_id
    const group_id = req.params.group_id
    const call = await db.query(`select *, to_char("date", 'DD/MM/YYYY') as mark_date, rl.id as rl_id from public.result_list rl, public.student st 
    where rl.student_id = st.id and rl.deleted = false and rl.subject_id = $1 and st.group_id = $2 
    order by rl.date NULLS LAST`,
    [subject_id, group_id])
    res.json(call.rows)
  }
  async update_parameter(req, res){
    const id = req.params.id
    const column = req.params.column
    const parameter = req.params.parameter
    
    console.log(column, parameter, id)
    try{
        const call = await db.query(`UPDATE public.result_list set ${column} = '${parameter}' where id = $1 RETURNING *`, [id])
        res.json(call.rows[0])
    }catch(e){res.status(400).send(e)}
  }

  async del_one(req, res){
    const id = req.params.id
    const call = await db.query(`UPDATE public.result_list set deleted = true where id = ${id} RETURNING *`)
    res.json(call.rows[0])
}
}

module.exports = new result_list_controller();
