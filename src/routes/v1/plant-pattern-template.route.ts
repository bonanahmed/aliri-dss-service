import express from 'express';
import { plantPatternTemplateController } from '../../controllers';
import auth from '../../middlewares/auth';
// import validate from '../../middlewares/validate';
// import * as plantPatternTemplateValidation from "../../validations/plantPatternTemplate.validation";

const router = express.Router();

router
  .route('/')
  .post(
    auth(),
    // validate(plantPatternTemplateValidation.createPlantPatternTemplate),
    plantPatternTemplateController.createPlantPatternTemplate
  )
  .get(
    auth(),
    // validate(plantPatternTemplateValidation.getPlantPatternTemplates),
    plantPatternTemplateController.getPlantPatternTemplates
  );

router
  .route('/:plantPatternTemplateId')
  .get(
    auth(),
    // validate(plantPatternTemplateValidation.getPlantPatternTemplate),
    plantPatternTemplateController.getPlantPatternTemplate
  )
  .patch(
    auth(),
    // validate(plantPatternTemplateValidation.updatePlantPatternTemplate),
    plantPatternTemplateController.updatePlantPatternTemplate
  )
  .delete(
    auth(),
    // validate(plantPatternTemplateValidation.deletePlantPatternTemplate),
    plantPatternTemplateController.deletePlantPatternTemplate
  );

export default router;
