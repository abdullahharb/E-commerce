import multer from "multer"
import fs from "fs"
import { AppError } from "../utils/AppError.js"

let options = (folderName) => {

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const dir = `uploads/${folderName}`
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true })
            }
            cb(null, dir)
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + '-' + file.originalname)
        }
    })

    function fileFilter(req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true)
        } else {
            cb(new AppError('image only', 400), false)
        }
    }
    return multer({ storage, fileFilter })
}

export const uploadSingleFile = (fieldName, folderName) => options(folderName).single(fieldName)

export const uploadMixOffFiles = (arrayOffFields, folderName) => options(folderName).fields(arrayOffFields)

