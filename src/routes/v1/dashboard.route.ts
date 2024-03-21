import express from 'express';
import { dashboardController } from '../../controllers';
import auth from '../../middlewares/auth';
// import validate from '../../middlewares/validate';
// import * as templateValidation from '../../validations/template.validation';

const router = express.Router();

router.route('/').get(auth(), dashboardController.getDashboard);

router.route('/maps').get(dashboardController.getMaps);

export default router;
