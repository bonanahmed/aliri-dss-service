import express from 'express';
import { cctvController } from '../../controllers';
import auth from '../../middlewares/auth';

const router = express.Router();

router.route('/').get(cctvController.getCCTV);

router.route('/generate-link-hikvision').post(cctvController.generateLinkHikVision);

export default router;
