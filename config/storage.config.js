const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'profile-avatars', // Puede ser el nombre del proyecto
  allowFormats: ['jpg', 'png'],
  filename: (req, file, next) => {
    next(null, `${Date.now()}${file.originalname}`) // Nombre único para el fichero que se sube
  }
}) // También se puede poner validaciones con el tamaño del fichero (el máximo estará marcado por el servidor)

module.exports = multer({ storage });