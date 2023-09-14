import express from "express";
import validate from "../../middlewares/validate";
import * as templateValidation from "../../validations/template.validation";
import { templateController } from "../../controllers";
// import auth from "../../middlewares/auth";

const router = express.Router();

router
  .route("/")
  .post(
    // auth('manageTemplates'),
    validate(templateValidation.createTemplate),

    templateController.createTemplate
  )
  .get(
    // auth('getTemplates'),
    validate(templateValidation.getTemplates),

    templateController.getTemplates
  );

router
  .route("/:templateId")
  .get(
    // auth('getTemplates'),
    validate(templateValidation.getTemplate),

    templateController.getTemplate
  )
  .patch(
    // auth('manageTemplates'),
    validate(templateValidation.updateTemplate),

    templateController.updateTemplate
  )
  .delete(
    // auth('manageTemplates'),
    validate(templateValidation.deleteTemplate),

    templateController.deleteTemplate
  );

export default router;
