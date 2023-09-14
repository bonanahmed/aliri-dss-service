import { Response } from "express";

const ApiResponse = (
  res: Response,
  httpStatus: number,
  message: string,
  data?: any
) => {
  res.status(httpStatus).send({
    status: "success",
    message,
    data,
  });
};

export default ApiResponse;
