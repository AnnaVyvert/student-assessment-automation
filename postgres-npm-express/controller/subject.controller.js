const db = require('../database.js')

class subject_controller {
    async create_trainer(req, res){
        const {name, surname, patronym, phone} = req.body
        try{
            const call = await db.query(`INSERT INTO trainer (name, surname, patronym, phone, deleted) values ($1, $2, $3, $4, false) RETURNING *`,
            [name, surname, patronym, phone])
            res.json(call.rows[0])
        }catch(e){res.status(400).send(e)}//res.json('400 Bad Request')
    }
    async get_trainers(req, res){
        const call = await db.query(`SELECT * FROM trainer where deleted = false`)
        res.json(call.rows)
    }
    async get_trainer(req, res){
        const id = req.params.id
        const call = await db.query(`SELECT * FROM trainer where id = ${id}`)
        res.json(call.rows[0])
    }
    async upd_trainer_parameter(req, res){
        const id = req.params.id
        const column = req.params.column
        const parameter = req.params.parameter
        
        console.log(id, column, parameter)
        const call_text = `UPDATE trainer set ${column} = '${parameter}' where id = ${id} RETURNING *`
        console.log(call_text)
        const call = await db.query(call_text)
        res.json(call.rows[0])
    }    
    async del_trainer(req, res){
        const id = req.params.id
        const dependences = await db.query(`UPDATE athlet set trainer_id = null where trainer_id = ${id}`)
        
        const call = await db.query(`UPDATE trainer set deleted = true where id = ${id} RETURNING *`)
        res.json(call.rows[0])
    }
}

module.exports = new subject_controller()