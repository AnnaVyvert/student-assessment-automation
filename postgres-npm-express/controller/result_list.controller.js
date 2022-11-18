const db = require('../database.js');

class result_list_controller {
  async create(req, res) {
    const race_id = req.params.id_race;
    const athlet_id = req.params.id_ath;
    const rand_id = Math.ceil(Math.random() * (2147483646 * 2) - 2147483646);
    const check = await db.query(
      `SELECT * FROM public.result_list where ATHLET_ID = ${athlet_id} and RACE_ID = ${race_id}`
    );
    // console.log(check.rows)
    if (check.rowCount === 0) {
      const call = await db.query(
        `INSERT INTO public.result_list (ATHLET_ID, RACE_ID, REGISTERED, NUMBER, RESULT, BAN) values ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [athlet_id, race_id, true, rand_id, '', false]
      );
      res.json(call.rows[0]);
    } else {
      const call = await db.query(
        `UPDATE public.result_list set registered = true where ATHLET_ID = ${athlet_id} and RACE_ID = ${race_id} RETURNING *`
      );
      res.json(call.rows[0]);
    }
  }
  async get_one(req, res) {
    const id = req.params.id
    try{
      const call = await db.query(`SELECT * FROM public.result_list where id = $1`, [id])
      res.json(call.rows[0])      
    }catch(e){res.status(400).send(e)}
  }
  async get_all(req, res) {
    // const call = await db.query(`SELECT * FROM public.result_list`)
    // res.json(call.rows)
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

  async del_one(req, res) {
    const ath_id = req.params.id_ath;
    const race_id = req.params.id_race;

    const call = await db.query(
      `UPDATE public.result_list SET registered = false where ATHLET_ID = ${ath_id} and race_id = ${race_id}`
    );
    res.json(call.rows[0]);
  }
}

module.exports = new result_list_controller();
