import express from 'express';
import { plantPatternController } from '../../controllers';
import auth from '../../middlewares/auth';
// import validate from '../../middlewares/validate';
// import * as plantPatternvalidation from '../../validations/plant-pattern.validation';

const router = express.Router();

router
  .route('/')
  .post(
    auth(),
    // validate(plantPatternvalidation.savePlantPattern),
    plantPatternController.savePlantPattern
  )
  .get(
    auth(),
    // validate(plantPatternvalidation.getPlantPatterns),
    plantPatternController.getPlantPatterns
  );

router
  .route('/:plantPatternId')
  .get(
    auth(),
    // validate(plantPatternvalidation.getPlantPattern),
    plantPatternController.getPlantPattern
  )
  .delete(
    auth(),
    // validate(plantPatternvalidation.deletePlantPattern),
    plantPatternController.deletePlantPattern
  );

export default router;
