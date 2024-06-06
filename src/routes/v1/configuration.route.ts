import express from 'express';
import { configurationController } from '../../controllers';
import auth from '../../middlewares/auth';
// import validate from "../../middlewares/validate";
// import * as pastenValidation from "../../validations/pasten.validation";

const router = express.Router();

router
  .route('/')
  .post(
    auth(),
    // validate(pastenValidation.createConfiguration),
    configurationController.createConfiguration
  )
  .get(
    auth(),
    // validate(pastenValidation.getConfigurations),
    configurationController.getConfigurations
  );

router
  .route('/:configurationId')
  .get(
    auth(),
    // validate(pastenValidation.getConfiguration),
    configurationController.getConfiguration
  )
  .patch(
    auth(),
    // validate(pastenValidation.updateConfiguration),
    configurationController.updateConfiguration
  )
  .delete(
    auth(),
    // validate(pastenValidation.deleteConfiguration),
    configurationController.deleteConfiguration
  );

export default router;
