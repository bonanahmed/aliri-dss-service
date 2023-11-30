import express from 'express';
import { lineController } from '../../controllers';
import auth from '../../middlewares/auth';
// import validate from '../../middlewares/validate';
// import * as lineValidation from '../../validations/line.validation';

const router = express.Router();

router
  .route('/')
  .post(
    auth(),
    // validate(lineValidation.createLine),
    lineController.createLine
  )
  .get(
    auth(),
    // validate(lineValidation.getLines),
    lineController.getLines
  );

router
  .route('/:lineId')
  .get(
    auth(),
    // validate(lineValidation.getLine),
    lineController.getLine
  )
  .patch(
    auth(),
    // validate(lineValidation.updateLine),
    lineController.updateLine
  )
  .delete(
    auth(),
    // validate(lineValidation.deleteLine),
    lineController.deleteLine
  );

export default router;
