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
    const competition_id = req.params.id;
    const order = req.params.sort == 'surname' ? 'surname' : 'rand_id desc';
    // console.log(req.params.sort+' | '+order)
    // const ath_ids = await db.query(`SELECT * FROM public.result_list where registered = 1 and COMPETITION_ID IN (${competition_id}) order by ${order}`)
    const ath_ids = await db.query(
      `SELECT * FROM public.result_list ca, athlet ath where ca.athlet_id = ath.id and ca.registered = true and ca.COMPETITION_ID IN (${competition_id}) order by ${order}`
    );
    if (ath_ids.rowCount === 0) return res.json([]);
    let ids = [];
    for (let i = 0; i < ath_ids.rows.length; i++)
      ids[i] = ath_ids.rows[i].athlet_id;
    ids = ids.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    //select athlet_id, surname, competition_id from public.result_list ca, athlet at where ca.athlet_id = at.id and ca.COMPETITION_ID IN (${JSON.stringify(ids).substring(1,JSON.stringify(ids).length-1)}) order by at.surname;
    const call = await db.query(
      `SELECT * FROM athlet where id IN (${JSON.stringify(ids).substring(
        1,
        JSON.stringify(ids).length - 1
      )}) order by surname asc`
    );
    for (let i = 0; i < ids.length; i++)
      for (let j = 0; j < ids.length; j++)
        if (call.rows[j].id === ids[i])
          [call.rows[i], call.rows[j]] = [call.rows[j], call.rows[i]];
    // try catch null
    for (let i = 0; i < call.rowCount; i++) {
      call.rows[i].res = ath_ids.rows[i].result;
      call.rows[i].n = i;
      //call.rows[i].years = new Date(new Date().getTime() - new Date(call.rows[i].birth).getTime()).getFullYear() - 1970
    }

    res.json(call.rows);
  }
  async get_all(req, res) {
    // const call = await db.query(`SELECT * FROM public.result_list`)
    // res.json(call.rows)
  }
  async update_parameter(req, res) {
    const athlet_id = req.params.athlet_id;
    const race_id = req.params.race_id;
    const column = req.params.column;
    const parameter = req.params.parameter;

    console.log(athlet_id, column, parameter);
    if (column === 'result' && parameter === 'to_null'){
        console.log('sdfsdf')
        const alt_call = await db.query(
            `UPDATE public.result_list set ${column} = '' where athlet_id = ${athlet_id} and race_id=${race_id} RETURNING *`
          );
        return res.json(alt_call.rows[0]);
    }
      
    const call_text = `UPDATE public.result_list set ${column} = '${parameter}' where athlet_id = ${athlet_id} and race_id=${race_id} RETURNING *`;
    console.log(call_text);
    const call = await db.query(call_text);
    res.json(call.rows[0]);
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
