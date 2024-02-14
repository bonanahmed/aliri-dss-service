import express from 'express';
import { cctvController } from '../../controllers';
import auth from '../../middlewares/auth';

const router = express.Router();

router.route('/').get(auth(), cctvController.getCCTV);

router.route('/generate-link-hikvision').post(auth(), cctvController.generateLinkHikVision);

export default router;
