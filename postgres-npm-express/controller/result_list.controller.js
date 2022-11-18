const db = require('../database.js');

class result_list_controller {
  async create_ath2race(req, res) {
    const race_id = req.params.id_race;
    const athlet_id = req.params.id_ath;
    const rand_id = Math.ceil(Math.random() * (2147483646 * 2) - 2147483646);
    const check = await db.query(
      `SELECT * FROM athlet2race where ATHLET_ID = ${athlet_id} and RACE_ID = ${race_id}`
    );
    // console.log(check.rows)
    if (check.rowCount === 0) {
      const call = await db.query(
        `INSERT INTO athlet2race (ATHLET_ID, RACE_ID, REGISTERED, NUMBER, RESULT, BAN) values ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [athlet_id, race_id, true, rand_id, '', false]
      );
      res.json(call.rows[0]);
    } else {
      const call = await db.query(
        `UPDATE athlet2race set registered = true where ATHLET_ID = ${athlet_id} and RACE_ID = ${race_id} RETURNING *`
      );
      res.json(call.rows[0]);
    }
  }
  async get_ath2race(req, res) {
    const competition_id = req.params.id;
    const order = req.params.sort == 'surname' ? 'surname' : 'rand_id desc';
    // console.log(req.params.sort+' | '+order)
    // const ath_ids = await db.query(`SELECT * FROM athlet2race where registered = 1 and COMPETITION_ID IN (${competition_id}) order by ${order}`)
    const ath_ids = await db.query(
      `SELECT * FROM athlet2race ca, athlet ath where ca.athlet_id = ath.id and ca.registered = true and ca.COMPETITION_ID IN (${competition_id}) order by ${order}`
    );
    if (ath_ids.rowCount === 0) return res.json([]);
    let ids = [];
    for (let i = 0; i < ath_ids.rows.length; i++)
      ids[i] = ath_ids.rows[i].athlet_id;
    ids = ids.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    //select athlet_id, surname, competition_id from athlet2race ca, athlet at where ca.athlet_id = at.id and ca.COMPETITION_ID IN (${JSON.stringify(ids).substring(1,JSON.stringify(ids).length-1)}) order by at.surname;
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
  async get_judge_list(req, res) {
    const competition_id = req.params.id;
    const ath_ids = await db.query(
      `SELECT * FROM athlet2race where REGISTERED = 1 and COMPETITION_ID = ${competition_id}`
    );
    if (ath_ids.rowCount === 0) return res.json([]);
    let ids = [];
    for (let i = 0; i < ath_ids.rows.length; i++)
      ids[i] = ath_ids.rows[i].athlet_id;
    ids = ids.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    const call = await db.query(
      `select athlet_id, name, category, surname, competition_id, rand_id from athlet2race ca, athlet at where ca.registered = 1 and ca.athlet_id = at.id and ca.COMPETITION_ID IN (${competition_id}) order by ca.rand_id desc`
    );
    for (let i = 0; i < ath_ids.rowCount; i++) {
      for (let j = 0; j < ath_ids.rowCount; j++)
        if (call.rows[i].athlet_id === ath_ids.rows[j].athlet_id)
          call.rows[i].res = ath_ids.rows[j].result;
      call.rows[i].n = i;
    }
    res.json(call.rows);
  }
  async get_res_ath2race(req, res) {
    const competition_id = req.params.id;
    const ath_ids = await db.query(
      `select * from athlet2race where RESULT is not NULL and COMPETITION_ID IN (${competition_id}) order by RESULT asc`
    );
    if (ath_ids.rowCount === 0) return res.json([]);
    let ids = [];
    for (let i = 0; i < ath_ids.rows.length; i++)
      ids[i] = ath_ids.rows[i].athlet_id;
    ids = ids.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    const call = await db.query(
      `SELECT * FROM athlet where id IN (${JSON.stringify(ids).substring(
        1,
        JSON.stringify(ids).length - 1
      )})`
    );
    // try catch null
    for (let i = 0; i < call.rowCount; i++) {
      call.rows[i].res = ath_ids.rows[i].result;
      call.rows[i].years =
        new Date(
          new Date().getTime() - new Date(call.rows[i].birth).getTime()
        ).getFullYear() - 1970;
      call.rows[i].n = i + 1;
    }

    res.json(call.rows);
  }
  async get_unreg(req, res) {
    const competition_id = req.params.competition_id;
    const race_id = req.params.race_id;
    const order = req.params.order;
    const comp_athlets = await db.query(
      `SELECT * FROM competition2athlet where registered = true and competition_id = ${competition_id}`
    );
    // console.log(comp_athlets.rows)
    const race_athlets = await db.query(
      `SELECT * FROM athlet2race where registered = true and race_id = ${race_id}`
    );
    // console.log(race_athlets.rows)
    // const race_athlets_ids = await db.query(`SELECT id FROM athlet2race where registered = true and race_id = ${race_id}`)
    // console.log(race_athlets_ids.rows)
    const race_athlets_id = race_athlets.rows.map((elem) => {
      return elem.athlet_id;
    });
    const unreg = comp_athlets.rows.filter((elem) => {
      return !race_athlets_id.includes(elem.athlet_id);
    });
    // console.log(unreg)
    // if (unreg.length === 0) return res.json()
    const unreg_athlets_id =
      unreg.length === 0
        ? 0
        : unreg.map((elem) => {
            return elem.athlet_id;
          });
    // console.log
    // const call = await db.query(`SELECT * FROM athlet a, athlet2race a2r where a.id = a2r.athlet_id and a.id IN (${unreg_athlets_id.toString()}) and a2r.race_id=${race_id} and a2r.registered <> false order by ${order} asc`)
    const call = await db.query(
      `SELECT * FROM athlet where id IN (${unreg_athlets_id.toString()}) and deleted <> true order by ${order} asc`
    );
    // const races = await db.query(`SELECT * FROM race where competition_id = ${competition_id} and deleted <> true`)
    res.json(call.rows);
  }
  async get_reged(req, res) {
    const race_id = req.params.race_id;
    const order = req.params.order;
    const race_athlets = await db.query(
      `SELECT * FROM athlet2race where registered = true and race_id = ${race_id}`
    );
    if (race_athlets.rowCount === 0) return res.json([]);
    const reged_athlets_id = race_athlets.rows.map((elem) => {
      return elem.athlet_id;
    });
    // const call = await db.query(`SELECT * FROM athlet where id IN (${reged_athlets_id.toString()}) and deleted <> true order by ${order} asc`)
    const call = await db.query(
      `SELECT * FROM athlet a, athlet2race a2r where a.id = a2r.athlet_id and a.id IN (${reged_athlets_id.toString()}) and a2r.race_id=${race_id} and a2r.registered <> false order by ${order} asc`
    );

    if (call.rowCount === 0) res.json([]);
    // const races = await db.query(`SELECT * FROM race where competition_id = ${competition_id} and deleted <> true`)

    for (let i = 0; i < call.rowCount; i++) call.rows[i].n = i + 1;
    res.json(call.rows);
  }
  async get_rest_aths(req, res) {
    const competition_id = req.params.id;
    // const competition_data = await db.query(`select * from competition where id = ${competition_id}`)
    // console.log(competition_data.rows)
    // if(competition_data.rows.length===0) return res.json([])
    const athlets = await db.query(
      `SELECT * FROM athlet2race where registered = true and COMPETITION_ID IN (${competition_id})`
    );
    let ids = [];
    if (athlets.rowCount === 0) ids = 0;
    else {
      for (let i = 0; i < athlets.rows.length; i++)
        ids[i] = athlets.rows[i].athlet_id;
      ids = ids.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    }
    const call = await db.query(
      `SELECT * FROM athlet where not id IN (${JSON.stringify(ids).substring(
        1,
        JSON.stringify(ids).length - 1
      )}) and deleted <> true order by surname asc`
    );
    let right_rows = [];
    // console.log(call.rows)
    // console.log(competition_data.rows)
    for (let i = 0; i < call.rows.length; i++) {
      call.rows[i].years =
        new Date(
          new Date().getTime() - new Date(call.rows[i].birth).getTime()
        ).getFullYear() - 1970;
      // if (call.rows[i].sex === competition_data.rows[0].sex && call.rows[i].years >= competition_data.rows[0].since_age && call.rows[i].years <= competition_data.rows[0].to_age)
      right_rows.push(call.rows[i]);
    }
    // try catch null
    res.json(right_rows);
  }
  async upd_ath2race_res(req, res) {
    // const {competition_id, athlet_id, result} = req.params
    const competition_id = req.params.id_comp;
    const athlet_id = req.params.id_ath;
    const result =
      req.params.res === 'null'
        ? null
        : req.params.res === 'dis'
        ? 'ДФЦ'
        : req.params.res;
    let id_comp2ath = await db.query(
      `SELECT * FROM athlet2race where athlet_id = ${athlet_id} and competition_id = ${competition_id}`
    );
    const call = await db.query(
      `UPDATE athlet2race set ATHLET_ID = $1, COMPETITION_ID = $2, RESULT = $3 where id = $4 RETURNING *`,
      [athlet_id, competition_id, result, id_comp2ath.rows[0].id]
    );
    res.json(call.rows[0]);
  }
  async upd_ath2race_unreg(req, res) {
    // console.log('star')
    const ath = req.params.id_ath;
    const comp = req.params.id_comp;

    const call = await db.query(
      `UPDATE athlet2race set registered = false where ATHLET_ID = ${ath} and COMPETITION_ID = ${comp} RETURNING *`
    );
    res.json(call.rows[0]);
  }
  async upd_ath2race_parameter(req, res) {
    const athlet_id = req.params.athlet_id;
    const race_id = req.params.race_id;
    const column = req.params.column;
    const parameter = req.params.parameter;

    console.log(athlet_id, column, parameter);
    if (column === 'result' && parameter === 'to_null'){
        console.log('sdfsdf')
        const alt_call = await db.query(
            `UPDATE athlet2race set ${column} = '' where athlet_id = ${athlet_id} and race_id=${race_id} RETURNING *`
          );
        return res.json(alt_call.rows[0]);
    }
      
    const call_text = `UPDATE athlet2race set ${column} = '${parameter}' where athlet_id = ${athlet_id} and race_id=${race_id} RETURNING *`;
    console.log(call_text);
    const call = await db.query(call_text);
    res.json(call.rows[0]);
  }
  async del_ath2race(req, res) {
    const ath_id = req.params.id_ath;
    const race_id = req.params.id_race;

    const call = await db.query(
      `UPDATE athlet2race SET registered = false where ATHLET_ID = ${ath_id} and race_id = ${race_id}`
    );
    res.json(call.rows[0]);
  }
}

module.exports = new result_list_controller();
