import express,{Request,Response} from 'express'
import Note from '../models/note'
import User from '../models/user'
const testingRouter = express.Router()

testingRouter.post('/reset', async(req:Request,res:Response)=>{
    await Note.deleteMany({})
    await User.deleteMany({})

    res.status(204).end()
})


export default testingRouter
