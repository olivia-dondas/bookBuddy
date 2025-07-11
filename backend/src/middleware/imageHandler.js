const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configuration de stockage pour multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, "../../uploads/covers");

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Générer un nom unique pour éviter les conflits
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename =
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  },
});

// Filtrer les types de fichiers acceptés
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error("Seules les images sont autorisées (jpeg, jpg, png, gif, webp)")
    );
  }
};

// Configuration multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: fileFilter,
});

// Fonction pour supprimer une image
const deleteImage = (imagePath) => {
  if (imagePath && fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
    console.log(`Image supprimée: ${imagePath}`);
  }
};

// Fonction pour obtenir l'URL complète d'une image
const getImageUrl = (req, filename) => {
  if (!filename) return null;
  return `${req.protocol}://${req.get("host")}/uploads/covers/${filename}`;
};

// Fonction pour valider et optimiser les images
const processImage = async (imagePath) => {
  // Ici, vous pourriez ajouter des optimisations comme :
  // - Redimensionnement
  // - Compression
  // - Conversion de format
  // Utiliser des librairies comme sharp, jimp, etc.

  return imagePath;
};

module.exports = {
  upload,
  deleteImage,
  getImageUrl,
  processImage,
};
