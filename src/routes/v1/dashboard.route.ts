import express from 'express';
import validate from '../../middlewares/validate';
import * as templateValidation from '../../validations/template.validation';
import { dashboardController } from '../../controllers';
import auth from '../../middlewares/auth';
// import auth from "../../middlewares/auth";

const router = express.Router();

router.route('/').get(auth(), dashboardController.getDashboard);

export default router;
