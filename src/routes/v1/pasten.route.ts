import express from 'express';
// import validate from "../../middlewares/validate";
// import * as pastenValidation from "../../validations/pasten.validation";
import { pastenController } from '../../controllers';
// import auth from "../../middlewares/auth";

const router = express.Router();

router
  .route('/')
  .post(
    // auth('managePastens'),
    // validate(pastenValidation.createPasten),

    pastenController.createPasten
  )
  .get(
    // auth('getPastens'),
    // validate(pastenValidation.getPastens),

    pastenController.getPastens
  );

router
  .route('/:pastenId')
  .get(
    // auth('getPastens'),
    // validate(pastenValidation.getPasten),

    pastenController.getPasten
  )
  .patch(
    // auth('managePastens'),
    // validate(pastenValidation.updatePasten),

    pastenController.updatePasten
  )
  .delete(
    // auth('managePastens'),
    // validate(pastenValidation.deletePasten),

    pastenController.deletePasten
  );

export default router;
