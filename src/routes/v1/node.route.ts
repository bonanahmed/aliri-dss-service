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
    // auth(),
    // validate(nodeValidation.getNodes),

    nodeController.getNodes
  );

router
  .route('/:nodeId')
  .get(
    // auth(),
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

router.route('/calculate-flow/:nodeId').get(nodeController.calculateFlow);

router.route('/lines-in-node/:nodeId').get(auth(), nodeController.linesInNode);

router.route('/data-sensor').post(auth(), nodeController.upsertDataNodeSensor);

router.route('/data-sensor/:nodeId').get(nodeController.getDataNodeSensors).delete(auth(), nodeController.deleteNodeSensor);

router.route('/data-sensor/:nodeId/:lineId').get(nodeController.getDataNodeSensor);

router.route('/data-sensor-detail/:sensorId').get(nodeController.getDataNodeSensorDetail);

router.route('/public/list').get(nodeController.getNodes);

router.route('/update/many').patch(auth(), nodeController.updateManyNodes);

router.route('/actual-flow').post(auth(), nodeController.upsertDataNodeToLineDataActual);

router.route('/actual-flow/:nodeId').get(nodeController.getDataNodeToLineDataActuals);

router.route('/actual-flow/:nodeId/:lineId').get(nodeController.getDataNodeToLineDataActual);

router.route('/actual-flow/delete/:actualFlowId').delete(nodeController.deleteNodeToLineDataActual);

// router.route('/convert/hm').get(nodeController.convertToHm);

export default router;
