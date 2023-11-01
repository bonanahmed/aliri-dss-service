import express from 'express';
import validate from '../../middlewares/validate';
import * as templateValidation from '../../validations/template.validation';
import { templateController } from '../../controllers';
import auth from '../../middlewares/auth';
// import auth from "../../middlewares/auth";

const router = express.Router();

router
  .route('/')
  .post(
    auth(),
    validate(templateValidation.createTemplate),

    templateController.createTemplate
  )
  .get(
    auth(),
    validate(templateValidation.getTemplates),

    templateController.getTemplates
  );

router
  .route('/:templateId')
  .get(
    auth(),
    validate(templateValidation.getTemplate),

    templateController.getTemplate
  )
  .patch(
    auth(),
    validate(templateValidation.updateTemplate),

    templateController.updateTemplate
  )
  .delete(
    auth(),
    validate(templateValidation.deleteTemplate),

    templateController.deleteTemplate
  );

export default router;
