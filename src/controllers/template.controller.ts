import httpStatus from "http-status";
import pick from "../utils/pick";
import ApiError from "../utils/ApiError";
import catchAsync from "../utils/catchAsync";
import { templateService } from "../services";
import ApiResponse from "../utils/ApiResponse";

const createTemplate = catchAsync(async (req, res) => {
  const template = await templateService.createTemplate(req.body);
  // res.status(httpStatus.CREATED).send(user);
  ApiResponse(res, httpStatus.CREATED, "create success", template);
});

const getTemplates = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await templateService.getTemplates(filter, options);
  // res.send(result);
  ApiResponse(res, httpStatus.OK, httpStatus[200], result);
});

const getTemplate = catchAsync(async (req, res) => {
  const template = await templateService.getTemplateById(req.params.templateId);
  if (!template) {
    throw new ApiError(httpStatus.NOT_FOUND, "Template not found");
  }
  ApiResponse(res, httpStatus.OK, httpStatus[200], template);
});

const updateTemplate = catchAsync(async (req, res) => {
  const template = await templateService.updateTemplateById(
    req.params.templateId,
    req.body
  );
  ApiResponse(res, httpStatus.OK, "update success", template);
});

const deleteTemplate = catchAsync(async (req, res) => {
  const template = await templateService.deleteTemplateById(
    req.params.templateId
  );
  // res.status(httpStatus.NO_CONTENT).send();
  ApiResponse(res, httpStatus.OK, "delete success", template);
});

export {
  createTemplate,
  getTemplates,
  getTemplate,
  updateTemplate,
  deleteTemplate,
};
