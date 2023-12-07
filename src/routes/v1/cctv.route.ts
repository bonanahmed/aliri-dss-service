import express from 'express';
import { cctvController } from '../../controllers';
import auth from '../../middlewares/auth';
// import validate from '../../middlewares/validate';
// import * as areaValidation from '../../validations/area.validation';

const router = express.Router();

router
  .route('/')

  .get(
    auth(),
    // validate(areaValidation.getAreas),
    cctvController.getCCTV
  );

export default router;
