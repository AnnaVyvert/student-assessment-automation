const db = require('../database.js');

class result_list_controller {
  async create(req, res){
    const {} = req.body
    try{
        const call = await db.query(`INSERT INTO public.group (, deleted) values ($1, $2, $3, $4) RETURNING *`,
        [, false])
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
