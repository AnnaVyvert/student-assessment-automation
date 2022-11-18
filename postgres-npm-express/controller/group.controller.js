const db = require('../database.js')

class group_controller {
    async create_account(req, res){
        const {login, password, name, surname, patronym, email, role_id, phone} = req.body
        try{
            const call = await db.query(`INSERT INTO account (login, password, name, surname, patronym, email, role_id, phone, deleted) values ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [login, password, name, surname, patronym, email, role_id, phone, false])
            res.json(call.rows[0])
        }catch(e){res.status(400).send(e)}//res.json('400 Bad Request')
    }
    async get_accounts(req, res){
        const call = await db.query(`SELECT * FROM account`)
        res.json(call.rows)
    }
    async get_account_by_id(req, res){
        const id = req.params.id
        const call = await db.query(`SELECT * FROM account where id = ${id}`)
        res.json(call.rows[0])
    }
    async get_accounts_by_role(req, res){
        const role = req.params.role
        const call = await db.query(`SELECT id, name, surname, patronym, login from account where role_id = ${role}`)
        res.json(call.rows)
    }
    async get_logins(req, res){
        const call = await db.query(`SELECT login from account`)
        res.json(call.rows)
    }
    async get_guest_rights(req, res){
        res.send([{role:{default:{athlet: [1,0,0,0], trainer: [1,0,0,0], competition: [1,0,0,0], judge: [0,0,0,0], admin: [0,0,0,0]}, special:[0,0]}}])
    }
    async get_account_by_login(req, res){
        const login = req.params.login
        const pass = req.params.password
        const call = await db.query(`SELECT * from account where login = $1 and password = $2`,
        [login, pass])
        // console.log(call.rows)
        if (!call.rowCount) return res.send([{role:{default:{athlet: [1,0,0,0], trainer: [1,0,0,0], competition: [1,0,0,0], judge: [0,0,0,0], admin: [0,0,0,0]}, special:[0,0]}}])

        const translate_role = (role) =>{
            switch(role){
                // case 1: return {default:{athlet: [1,0,0,0], trainer: [1,0,0,0], competition: [1,0,0,0], judge: [0,0,0,0], admin: [0,0,0,0]}, special:[0,0]}
                // case 2: return {default:{athlet: [1,0,0,0], trainer: [1,0,0,0], competition: [1,0,0,0], judge: [0,0,0,0], admin: [0,0,0,0]}, special:[0,0]}
                // case 3: return {default:{athlet: [1,0,0,0], trainer: [1,0,0,0], competition: [1,0,0,0], judge: [0,0,0,0], admin: [0,0,0,0]}, special:[0,0]}
                // case 4: return {default:{athlet: [1,0,0,0], trainer: [1,0,0,0], competition: [1,0,0,0], judge: [0,0,0,0], admin: [0,0,0,0]}, special:[0,0]}
                case 5: return {default:{athlet: [1,0,0,0], trainer: [1,0,0,0], competition: [1,0,0,0], judge: [1,0,0,0], admin: [0,0,0,0]}, special:[1,0]}
                case 6: return {default:{athlet: [1,1,1,1], trainer: [1,1,1,1], competition: [1,1,1,1], judge: [1,1,1,1], admin: [1,0,0,0]}, special:[0,1]}
                default: return 'wrong role'
            }
        }

        // console.log(call.rows)
        // console.log(translate_role(call.rows[0].role))
        // console.log(call.rows)
        call.rows[0].role = translate_role(call.rows[0].role_id)
        // return !!call.rowCount? res.json(call.rows) : res.send()
        res.json(call.rows)
    }
    async upd_account_parameter(req, res){
        const id = req.params.id
        const column = req.params.column
        const parameter = req.params.parameter
        
        console.log(id, column, parameter)
        const call_text = `UPDATE account set ${column} = '${parameter}' where id = ${id} RETURNING *`
        console.log(call_text)
        const call = await db.query(call_text)
        res.json(call.rows[0])
    }
    async del_account(req, res){
        const id = req.params.id
        // const dependences = await db.query(`DELETE FROM competition2athlet where athlet_id = ${id}`)
        // const call = await db.query(`DELETE FROM athlet where id = ${id}`)
        const call = await db.query(`UPDATE account set deleted = true where id = ${id} RETURNING *`)
        res.json(call.rows[0])
    }
}

module.exports = new group_controller()