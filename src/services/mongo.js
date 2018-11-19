import mongoose from 'mongoose'
import { MDB } from '../config'
let mongo = () => {
  mongoose.connect(`mongodb://${MDB.host}/${MDB.db_name}`, { useNewUrlParser: true, useCreateIndex: true })
  mongoose.connection.once('open', () => { console.log('Mongodb Connected!') })
}

export default mongo
