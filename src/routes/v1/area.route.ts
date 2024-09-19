import express from 'express';
import { areaController } from '../../controllers';
import auth from '../../middlewares/auth';
// import validate from '../../middlewares/validate';
// import * as areaValidation from '../../validations/area.validation';

const router = express.Router();

router
  .route('/')
  .post(
    auth(),
    // validate(areaValidation.createArea),
    areaController.createArea
  )
  .get(
    // validate(areaValidation.getAreas),
    areaController.getAreas
  );

router
  .route('/:areaId')
  .get(
    auth(),
    // validate(areaValidation.getArea),
    areaController.getArea
  )
  .patch(
    auth(),
    // validate(areaValidation.updateArea),
    areaController.updateArea
  )
  .delete(
    auth(),
    // validate(areaValidation.deleteArea),
    areaController.deleteArea
  );

// router.route('/maps/list').get(areaController.getMaps);

router.route('/public/list').get(areaController.getAreas);

router.route('/data-sensor/:areaId').get(areaController.getAreaSensor);

router.route('/data-sensor/:areaId/list').get(areaController.getAreaSensors);

router.route('/data-sensor/:sensorId/detail').get(areaController.getAreaSensorDetail);

router.route('/data-sensor').post(areaController.upsertDataAreaSensor);

router.route('/documents/list').get(areaController.getDocuments);

router.route('/documents/create').post(areaController.createDocument);

router.route('/documents/:documentId').delete(areaController.deleteDocument);

router.route('/configuration/list').get(areaController.getConfigurations);

router.route('/configuration/create').post(areaController.createConfiguration);

router.route('/configuration/:configId').delete(areaController.deleteConfiguration);

router.route('/configuration/:configId').get(areaController.getConfigurationDetail);

router.route('/configuration/area/:areaId').get(areaController.getConfigurationDetail);

router.route('/configuration/:configId').patch(areaController.updateConfiguration);

router.route('/flow/summary/list').get(areaController.getFlowSummaries);

export default router;
