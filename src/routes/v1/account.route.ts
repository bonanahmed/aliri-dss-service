import express from 'express';
import { accountController } from '../../controllers';
import auth from '../../middlewares/auth';
// import { accountValidation } from '../../validations';
// import validate from '../../middlewares/validate';

const router = express.Router();

router
  .route('/')
  .post(
    // validate(accountValidation.createUserAndAccount),
    accountController.createUserAndAccount
  )
  .get(
    auth(),
    // validate(accountValidation.getUsersAndAccounts),
    accountController.getUsersAndAccounts
  );

router
  .route('/:id')
  .get(
    auth(),
    // validate(accountValidation.getUserByAccountId),
    accountController.getUserAndAccount
  )
  .patch(
    auth(),
    // validate(accountValidation.updateUserAndAccount),
    accountController.updateUserAndAccount
  )
  .delete(
    auth(),
    // validate(accountValidation.deleteUserAndAccount),
    accountController.deleteUserAndAccount
  );

router.route('/password/:id').patch(
  auth(),
  // validate(accountValidation.updateUserAndAccount),
  accountController.updatePassword
);

export default router;
