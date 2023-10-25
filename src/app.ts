import express from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import passport from 'passport';

import routes from './routes/v1';

import { json, urlencoded } from 'body-parser';
import { jwtStrategy } from './config/passport';
import { errorConverter, errorHandler } from './middlewares/error';

const app = express();

// set security HTTP headers
app.use(helmet());

app.use(json({ limit: '10mb' }));
app.use(urlencoded({ limit: '10mb', extended: true }));

// sanitize request data
app.use(mongoSanitize());

// gzip compression
// app.use(compression());

// enable cors
const allowedOrigins = [
  'http://localhost:3000',
  'https://kedung-putri-web.wsi.digibay.id',
  // Add more origins as needed
];
app.use(
  cors({
    credentials: true,
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

//v1 api routes
app.use('/api/v1', routes);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
