import multer from 'multer'

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits : {fileSize : 5 * 1024 * 1024},
    fileFilter : (req , file , cb) => {
        if(file.mimetype === "image/jpeg" || file.mimetype === "image/jpg"  || file.mimetype === "image/png" || file.mimetype === "image/webp"){
            cb(null , true)
        }else{
            cb(new Error("Only JPEG or PNG or WEBP images are allowed"), false)
        }
    }
})

export default upload;