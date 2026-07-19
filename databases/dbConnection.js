
import mongoose from 'mongoose'

export const dbconnection = () => {
    mongoose.connect(process.env.DB_CONNECTION)
        .then(() => {
            console.log('database is running....')
        }).catch((err) => {
            console.log('ERRORRRR Database',err)
        })
}


