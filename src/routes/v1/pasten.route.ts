import express from 'express';
import { pastenController } from '../../controllers';
import auth from '../../middlewares/auth';
// import validate from "../../middlewares/validate";
// import * as pastenValidation from "../../validations/pasten.validation";

const router = express.Router();

router
  .route('/')
  .post(
    auth(),
    // validate(pastenValidation.createPasten),
    pastenController.createPasten
  )
  .get(
    auth(),
    // validate(pastenValidation.getPastens),
    pastenController.getPastens
  );

router
  .route('/:pastenId')
  .get(
    auth(),
    // validate(pastenValidation.getPasten),
    pastenController.getPasten
  )
  .patch(
    auth(),
    // validate(pastenValidation.updatePasten),
    pastenController.updatePasten
  )
  .delete(
    auth(),
    // validate(pastenValidation.deletePasten),
    pastenController.deletePasten
  );

export default router;
