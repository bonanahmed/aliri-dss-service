import express from 'express';
// import validate from '../../middlewares/validate';
// import * as groupValidation from '../../validations/group.validation';
import { groupController } from '../../controllers';
// import auth from "../../middlewares/auth";

const router = express.Router();

router
  .route('/')
  .post(
    // auth('manageGroups'),
    // validate(groupValidation.createGroup),

    groupController.createGroup
  )
  .get(
    // auth('getGroups'),
    // validate(groupValidation.getGroups),

    groupController.getGroups
  );

router.route('/plant-pattern').get(
  // auth('getGroups'),
  // validate(groupValidation.getGroups),

  groupController.getGroupsWithPlantPattern
);

router
  .route('/:groupId')
  .get(
    // auth('getGroups'),
    // validate(groupValidation.getGroup),

    groupController.getGroup
  )
  .patch(
    // auth('manageGroups'),
    // validate(groupValidation.updateGroup),

    groupController.updateGroup
  )
  .delete(
    // auth('manageGroups'),
    // validate(groupValidation.deleteGroup),

    groupController.deleteGroup
  );

export default router;
