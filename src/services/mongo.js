import mongoose from 'mongoose'
import { MDB } from '../config'
let mongo = () => {
  mongoose.connect(MDB.host + MDB.db_name, { useNewUrlParser: true, useCreateIndex: true })
  mongoose.connection.once('open', () => { console.log('mongodb connected!') })
}

export default mongo
