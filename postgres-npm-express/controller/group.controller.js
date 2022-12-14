const db = require('../database.js')

class group_controller {
    async create(req, res){
        const {number, start_year, cipher} = req.body
        try{
            const call = await db.query(`INSERT INTO public.group (number, start_year, cipher, deleted) values ($1, $2, $3, $4) RETURNING *`,
            [number, start_year, cipher, false])
            res.json(call.rows[0])
        }catch(e){res.status(400).send(e)}
    }
    async get_all(req, res){
        const call = await db.query(`SELECT id, number, start_year, cipher FROM public.group where deleted = false order by cipher`)
        res.json(call.rows)
    }
    async get_one(req, res){
        const id = req.params.id
        try{
            const call = await db.query(`SELECT * FROM public.group where id = $1`, [id])
            res.json(call.rows[0])      
        }catch(e){res.status(400).send(e)}
    }
    async update_parameter(req, res){
        const id = req.params.id
        const column = req.params.column
        const parameter = req.params.parameter
        
        console.log(column, parameter, id)
        try{
            const call = await db.query(`UPDATE public.group set ${column} = '${parameter}' where id = $1 RETURNING *`, [id])
            res.json(call.rows[0])
        }catch(e){res.status(400).send(e)}
    }
    async del_one(req, res){
        const id = req.params.id
        const call = await db.query(`UPDATE public.group set deleted = true where id = ${id} RETURNING *`)
        res.json(call.rows[0])
    }
}

module.exports = new group_controller()