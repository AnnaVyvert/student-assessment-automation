const db = require('../database.js')

class student_controller {
    async create(req, res){
        const {name, distance, start} = req.body
        const creator_id = req.params.creator_id
        const competition_id = req.params.competition_id
        try{

            const age_translate = (age) =>{
                switch(age){
                    case 'С 12 до 16 лет': return 0
                    case 'С 16 до 18 лет': return 1
                }
            }
            const age_id = age_translate(req.body.age_id)
            const sex = req.body.sex === 'Ж'
            console.log(name, sex, distance, age_id, start, false, creator_id, competition_id)
            const call = await db.query(`INSERT INTO public.student (name, sex, distance, age_id, start, deleted, creator_id, competition_id) values ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [name, sex, distance, age_id, start, false, creator_id, competition_id])
            res.json(call.rows[0])
        }catch(e){res.status(400).send(e)}//res.json('400 Bad Request')
    }
    async get_one(req, res){
        const id = req.params.id
        const call = await db.query(`SELECT * FROM public.student where id = ${id}`)
        if (call.rowCount === 0) res.json(call.rows) 
        
        const age_translate = (id) =>{
            switch(id){
                case 0: return 'С 12 до 16 лет'
                case 1: return 'С 16 до 18 лет'
                default: return 'age_id: out of bound'
            }
        }

        call.rows[0].age = age_translate(call.rows[0].age_id)
        res.json(call.rows[0])
    }
    async get_all(req, res){
        const id = req.params.id
        const call = await db.query(`SELECT * FROM public.student where competition_id = ${id} and deleted <> true`)
        if (call.rowCount === 0) return res.json([]) 
        const age_translate = (id) =>{
            switch(id){
                case 0: return 'С 12 до 16 лет'
                case 1: return 'С 16 до 18 лет'
                default: return 'age_id: out of bound'
            }
        }

        for(let i=0; i<call.rowCount; i++)
            call.rows[i].age = age_translate(call.rows[i].age_id)

        await res.json(call.rows)
    }
    async update_parameter(req, res){
        const id = req.params.id
        const column = req.params.column
        const parameter = req.params.parameter
        
        const call_text = `UPDATE public.student set ${column} = '${parameter}' where id = ${id} RETURNING *`
        console.log(call_text)
        const call = await db.query(call_text)
        res.json(call.rows[0])
    }    
    async del_one(req, res){
        const id = req.params.id
        const dependences = await db.query(`UPDATE athlet set trainer_id = null where trainer_id = ${id}`)
        
        const call = await db.query(`UPDATE public.student set deleted = true where id = ${id} RETURNING *`)
        res.json(call.rows[0])
    }
}

module.exports = new student_controller()