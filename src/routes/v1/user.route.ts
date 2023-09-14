import express from "express";
import validate from "../../middlewares/validate";
import * as userValidation from "../../validations/user.validation";
import { userController } from "../../controllers";
// import auth from "../../middlewares/auth";

const router = express.Router();

router
  .route("/")
  .post(
    // auth('manageUsers'),
    validate(userValidation.createUser),

    userController.createUser
  )
  .get(
    // auth('getUsers'),
    validate(userValidation.getUsers),

    userController.getUsers
  );

router
  .route("/:userId")
  .get(
    // auth('getUsers'),
    validate(userValidation.getUser),

    userController.getUser
  )
  .patch(
    // auth('manageUsers'),
    validate(userValidation.updateUser),

    userController.updateUser
  )
  .delete(
    // auth('manageUsers'),
    validate(userValidation.deleteUser),

    userController.deleteUser
  );

export default router;
