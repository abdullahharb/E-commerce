
import mongoose from 'mongoose'

export const dbconnection = () => {
    mongoose.connect(process.env.DB_ONLINE)

    const dbUrl = process.env.DB_ONLINE || process.env.DB_CONNECTION;
    mongoose.connect(dbUrl)
        .then(() => {
            console.log('database is running....')
        }).catch((err) => {
            console.log('ERRORRRR Database', err)
        })
}

