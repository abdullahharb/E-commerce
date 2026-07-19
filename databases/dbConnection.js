
import mongoose from 'mongoose'

export const dbconnection = () => {
    mongoose.connect(process.env.DB_ONLINE)
        .then(() => {
            console.log('database is running....')
        }).catch((err) => {
            console.log('ERRORRRR Database',err)
        })
}


