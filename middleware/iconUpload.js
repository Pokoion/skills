const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/icons/');
    },
    filename: function (req, file, cb) {
        const originalName = path.parse(file.originalname).name;
        const extension = path.extname(file.originalname);
        
        const filefull = `${originalName}${extension}`;
        cb(null, filefull);
    }
});

const fileFilter = function (req, file, cb) {
    const allowedTypes = ['image/svg+xml'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only SVG files are permitted.'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // (2MB)
    }
});

module.exports = upload;