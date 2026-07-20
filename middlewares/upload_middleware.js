  import upload from "../service/multer_s3.js";

  const uploadtoS3 = (fileName) => (req, res, next) => {
    const uploadhandler = upload.single(fileName);
    uploadhandler(req, res, (err) => {
      if (err) {
        req.uploadSuccess = false;
        return res.status(400).json({ success: false, message: err.message });
      }

      if (!req.file) {
        req.uploadSuccess = false;
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }
      req.uploadSuccess = true;
      next();
    });
  };

export default uploadtoS3;

