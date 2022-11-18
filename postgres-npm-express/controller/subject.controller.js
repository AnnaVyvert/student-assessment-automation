const db = require('../database.js')

class subject_controller {
    async create(req, res){
        const {name, surname, patronym, phone} = req.body
        try{
            const call = await db.query(`INSERT INTO public.subject (name, surname, patronym, phone, deleted) values ($1, $2, $3, $4, false) RETURNING *`,
            [name, surname, patronym, phone])
            res.json(call.rows[0])
        }catch(e){res.status(400).send(e)}//res.json('400 Bad Request')
    }
    async get_all(req, res){
        const call = await db.query(`SELECT * FROM public.subject where deleted = false`)
        res.json(call.rows)
    }
    async get_one(req, res){
        const id = req.params.id
        const call = await db.query(`SELECT * FROM public.subject where id = ${id}`)
        res.json(call.rows[0])
    }
    async update_parameter(req, res){
        const id = req.params.id
        const column = req.params.column
        const parameter = req.params.parameter
        
        console.log(id, column, parameter)
        const call_text = `UPDATE public.subject set ${column} = '${parameter}' where id = ${id} RETURNING *`
        console.log(call_text)
        const call = await db.query(call_text)
        res.json(call.rows[0])
    }    
    async del_one(req, res){
        const id = req.params.id
        const dependences = await db.query(`UPDATE athlet set public.subject_id = null where public.subject_id = ${id}`)
        
        const call = await db.query(`UPDATE public.subject set deleted = true where id = ${id} RETURNING *`)
        res.json(call.rows[0])
    }
}

module.exports = new subject_controller()