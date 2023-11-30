import express from 'express';
import { nodeController } from '../../controllers';
import auth from '../../middlewares/auth';
// import validate from '../../middlewares/validate';
// import * as nodeValidation from '../../validations/node.validation';

const router = express.Router();

router
  .route('/')
  .post(
    auth(),
    // validate(nodeValidation.createNode),

    nodeController.createNode
  )
  .get(
    auth(),
    // validate(nodeValidation.getNodes),

    nodeController.getNodes
  );

router
  .route('/:nodeId')
  .get(
    auth(),
    // validate(nodeValidation.getNode),

    nodeController.getNode
  )
  .patch(
    auth(),
    // validate(nodeValidation.updateNode),

    nodeController.updateNode
  )
  .delete(
    auth(),
    // validate(nodeValidation.deleteNode),

    nodeController.deleteNode
  );

router.route('/generate-papan-eksploitasi/:nodeId').get(nodeController.generatePapanEksploitasi);
router.route('/map/:code').get(nodeController.getMapNodeData);

export default router;
