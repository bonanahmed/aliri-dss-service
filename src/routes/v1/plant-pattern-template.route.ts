import express from 'express';
import validate from '../../middlewares/validate';
// import * as plantPatternTemplateValidation from "../../validations/plantPatternTemplate.validation";
import { plantPatternTemplateController } from '../../controllers';
// import auth from "../../middlewares/auth";

const router = express.Router();

router
  .route('/')
  .post(
    // auth('manageTemplates'),
    // validate(plantPatternTemplateValidation.createPlantPatternTemplate),

    plantPatternTemplateController.createPlantPatternTemplate
  )
  .get(
    // auth('getPlantPatternTemplates'),
    // validate(plantPatternTemplateValidation.getPlantPatternTemplates),

    plantPatternTemplateController.getPlantPatternTemplates
  );

router
  .route('/:plantPatternTemplateId')
  .get(
    // auth('getPlantPatternTemplates'),
    // validate(plantPatternTemplateValidation.getPlantPatternTemplate),

    plantPatternTemplateController.getPlantPatternTemplate
  )
  .patch(
    // auth('manageTemplates'),
    // validate(plantPatternTemplateValidation.updatePlantPatternTemplate),

    plantPatternTemplateController.updatePlantPatternTemplate
  )
  .delete(
    // auth('manageTemplates'),
    // validate(plantPatternTemplateValidation.deletePlantPatternTemplate),

    plantPatternTemplateController.deletePlantPatternTemplate
  );

export default router;
