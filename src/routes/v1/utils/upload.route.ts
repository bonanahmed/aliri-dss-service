import express from 'express';
import { uploadController } from '../../../controllers';
import auth from '../../../middlewares/auth';
// import auth from "../../middlewares/auth";

const router = express.Router();

router.route('/').post(auth(), uploadController.upload);

export default router;
