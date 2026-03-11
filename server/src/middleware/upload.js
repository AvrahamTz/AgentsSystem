import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage,   limits: {
        fileSize: 5 * 1024 * 1024
    },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type, only JPEG, PNG, and svg are allowed!!'), false);
        }
    }
});
export const image = (req, res, next) => {
  upload.single("image")(req, res, function (err) {

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          error: "Image too large. Max size is 5MB"
        });
      }
    }

    if (err) {
      return res.status(400).json({
        error: err.message
      });
    }

    next();
  });

}
  
export const uploadCSV = multer({
  storage: multer.memoryStorage()
});