import express from 'express';
import { areaController } from '../../controllers';
import auth from '../../middlewares/auth';
// import validate from '../../middlewares/validate';
// import * as areaValidation from '../../validations/area.validation';

const router = express.Router();

router
  .route('/')
  .post(
    auth(),
    // validate(areaValidation.createArea),
    areaController.createArea
  )
  .get(
    auth(),
    // validate(areaValidation.getAreas),
    areaController.getAreas
  );

router
  .route('/:areaId')
  .get(
    auth(),
    // validate(areaValidation.getArea),
    areaController.getArea
  )
  .patch(
    auth(),
    // validate(areaValidation.updateArea),
    areaController.updateArea
  )
  .delete(
    auth(),
    // validate(areaValidation.deleteArea),
    areaController.deleteArea
  );

router.route('/maps/list').get(areaController.getMaps);

export default router;
