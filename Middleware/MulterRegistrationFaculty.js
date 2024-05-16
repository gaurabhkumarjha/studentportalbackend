const multer = require("multer");


const imgconfig = multer.diskStorage({ // img storage path
    destination: (req, file, callback) => {
        callback(null, "./Upload")
    },
    filename: (req, file, callback) => {
        callback(null, `image.${file.originalname}`)
    }
})

const isImage = (req, file, callback) => { // img filter
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        callback(null, true)
    } else {
        callback(new Error("only images png jpg jpeg is allowed"))
    }
}
const FacultyProfileupload = multer({
    storage: imgconfig,
    fileFilter: isImage
});

module.exports = FacultyProfileupload;