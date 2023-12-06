import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import templateRoute from './template.route';
import lineRoute from './line.route';
import nodeRoute from './node.route';
import areaRoute from './area.route';
import pastenRoute from './pasten.route';
import plantPattern from './plant-pattern.route';
import plantPatternTemplate from './plant-pattern-template.route';
import groupRoute from './group.route';
import dashboardRoute from './dashboard.route';
import accountRoute from './account.route';
import cctvRoute from './cctv.route';
import uploadRoute from './utils/upload.route';
// import docsRoute from "./docs.route";
// import config from "../../config/config";

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/templates',
    route: templateRoute,
  },
  {
    path: '/lines',
    route: lineRoute,
  },
  {
    path: '/nodes',
    route: nodeRoute,
  },
  {
    path: '/areas',
    route: areaRoute,
  },
  {
    path: '/plant-pattern',
    route: plantPattern,
  },
  {
    path: '/pastens',
    route: pastenRoute,
  },
  {
    path: '/plant-pattern-templates',
    route: plantPatternTemplate,
  },
  {
    path: '/groups',
    route: groupRoute,
  },
  {
    path: '/dashboard',
    route: dashboardRoute,
  },
  {
    path: '/accounts',
    route: accountRoute,
  },
  {
    path: '/cctv',
    route: cctvRoute,
  },
  {
    path: '/utils/upload',
    route: uploadRoute,
  },
];

// const devRoutes = [
//   // routes available only in development mode
//   {
//     path: "/docs",
//     route: docsRoute,
//   },
// ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// /* istanbul ignore next */
// if (config.env === "development") {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route);
//   });
// }

export default router;
