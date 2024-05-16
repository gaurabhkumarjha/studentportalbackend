const multer = require("multer");


const Assconfig = multer.diskStorage({ // Assignment storage path
    destination: (req, file, callback) => {
        callback(null, "./Upload")
    },
    filename: (req, file, callback) => {
        callback(null, `Document.${file.originalname}`)
    }
})

const isAss = (req, file, callback) => {

    const fileExtension = file.originalname.split('.').pop();

    if (fileExtension === 'docx' || fileExtension === 'doc' || fileExtension === 'pdf' || fileExtension === 'csv' || fileExtension === 'numbers') {
        callback(null, true);
    } else {
        callback(new Error("Only .doc, .docx, .pdf, .csv and .numbers files are allowed."));
    }
};
const AssignmentuploadByFac = multer({
    storage: Assconfig,
    fileFilter: isAss
});

module.exports = AssignmentuploadByFac;