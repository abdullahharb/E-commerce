
import mongoose from 'mongoose'

export const dbconnection = () => {
    mongoose.connect(process.env.BASE_URL)
        .then(() => {
            console.log('database is running....')
        }).catch((err) => {
            console.log('ERRORRRR Database',err)
        })
}


