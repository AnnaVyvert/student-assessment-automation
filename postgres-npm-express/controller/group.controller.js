const db = require('../database.js')

class group_controller {
    async create(req, res){
        const {number, start_year, cipher} = req.body
        try{
            const call = await db.query(`INSERT INTO public.group (number, start_year, cipher) values ($1, $2, $3) RETURNING *`,
            [number, start_year, cipher])
            res.json(call.rows[0])
        }catch(e){res.status(400).send(e)}
    }
    async get_all(req, res){
        const call = await db.query(`SELECT * FROM public.group`)
        res.json(call.rows)
    }
    async get_one(req, res){
        const id = req.params.id
        const call = await db.query(`SELECT * FROM public.group where id = ${id}`)
        res.json(call.rows[0])
    }
    async update_parameter(req, res){
        const id = req.params.id
        const column = req.params.column
        const parameter = req.params.parameter
        
        console.log(id, column, parameter)
        const call_text = `UPDATE public.group set ${column} = '${parameter}' where id = ${id} RETURNING *`
        console.log(call_text)
        const call = await db.query(call_text)
        res.json(call.rows[0])
    }
    async del_one(req, res){
        const id = req.params.id
        // const dependences = await db.query(`DELETE FROM competition2athlet where athlet_id = ${id}`)
        // const call = await db.query(`DELETE FROM athlet where id = ${id}`)
        const call = await db.query(`UPDATE public.group set deleted = true where id = ${id} RETURNING *`)
        res.json(call.rows[0])
    }
}

module.exports = new group_controller()