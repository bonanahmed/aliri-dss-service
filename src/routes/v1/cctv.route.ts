import express from 'express';
import { areaController } from '../../controllers';
import auth from '../../middlewares/auth';
// import validate from '../../middlewares/validate';
// import * as areaValidation from '../../validations/area.validation';

const router = express.Router();

router
  .route('/')

  .get(
    auth(),
    // validate(areaValidation.getAreas),
    areaController.getAreas
  );

export default router;
