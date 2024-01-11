import express from 'express';
import validate from '../../middlewares/validate';
import * as kemantrenValidation from '../../validations/kemantren.validation';
import { kemantrenController } from '../../controllers';
import auth from '../../middlewares/auth';
// import auth from "../../middlewares/auth";

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(kemantrenValidation.createKemantren), kemantrenController.createKemantren)
  .get(auth(), validate(kemantrenValidation.getKemantrens), kemantrenController.getKemantrens);

router
  .route('/:kemantrenId')
  .get(auth(), validate(kemantrenValidation.getKemantren), kemantrenController.getKemantren)
  .patch(auth(), validate(kemantrenValidation.updateKemantren), kemantrenController.updateKemantren)
  .delete(auth(), validate(kemantrenValidation.deleteKemantren), kemantrenController.deleteKemantren);

export default router;
