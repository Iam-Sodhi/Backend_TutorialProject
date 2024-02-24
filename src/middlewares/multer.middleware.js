//Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.  file vgera ko express handle nhi krta json data ki tarah,  that's why  multer is used.
import multer from "multer";

const storage = multer.diskStorage({ //this code from official github documentation
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  export const upload = multer({ storage: storage })