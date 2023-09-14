import httpStatus from 'http-status';
import { Template } from './../models/template'; // Import the ITemplateDocument type from your models
import ApiError from '../utils/ApiError';
import { ITemplateDocument } from '../models/template/mongoose';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<ITemplateDocument>}
 */
const createTemplate = async (body: any): Promise<ITemplateDocument> => {
  return Template.create(body);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<any>}
 */
const getTemplates = async (filter: any, options: any): Promise<any> => {
  const templates = await Template.paginate(filter, options);
  return templates;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<ITemplateDocument | null>}
 */
const getTemplateById = async (id: string): Promise<ITemplateDocument | null> => {
  return Template.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<ITemplateDocument | null>}
 */
const getTemplateByEmail = async (email: string): Promise<ITemplateDocument | null> => {
  return Template.findOne({ email });
};

/**
 * Update user by id
 * @param {string} templateId
 * @param {Object} updateBody
 * @returns {Promise<ITemplateDocument | null>}
 */
const updateTemplateById = async (templateId: string, updateBody: any): Promise<ITemplateDocument | null> => {
  const template = await getTemplateById(templateId);
  if (!template) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Template not found');
  }
  Object.assign(template, updateBody);
  await template.save();
  return template;
};

/**
 * Delete user by id
 * @param {string} userId
 * @returns {Promise<ITemplateDocument | null>}
 */
const deleteTemplateById = async (templateId: string): Promise<ITemplateDocument | null> => {
  const template = await getTemplateById(templateId);
  if (!template) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Template not found');
  }
  await Template.findByIdAndRemove(templateId);
  return template;
};

export { createTemplate, getTemplates, getTemplateById, getTemplateByEmail, updateTemplateById, deleteTemplateById };
