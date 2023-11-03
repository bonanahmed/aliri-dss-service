import httpStatus from 'http-status';
import { Node } from '../models/node'; // Import the INodeDocument type from your models
import ApiError from '../utils/ApiError';
import { INodeDocument } from '../models/node/mongoose';
import { Line } from '../models/line';
import { Area } from '../models/area';

/**
 * Create a user
 * @param {Object} body
 * @returns {Promise<INodeDocument>}
 */
const createNode = async (body: any): Promise<INodeDocument> => {
  return await Node.create(body);
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
const getNodes = async (filter: any, options: any): Promise<any> => {
  if (filter.search) {
    filter.$or = [
      { code: { $regex: new RegExp(filter.search, 'i') } },
      { name: { $regex: new RegExp(filter.search, 'i') } },
    ];
    delete filter.search;
  }
  const nodes = options.limit ? await Node.paginate(filter, options) : await Node.find(filter);
  return nodes;
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<INodeDocument | null>}
 */
const getNodeById = async (id: string): Promise<INodeDocument | null> => {
  return Node.findById(id);
};

/**
 * Update user by id
 * @param {string} nodeId
 * @param {Object} updateBody
 * @returns {Promise<INodeDocument | null>}
 */
const updateNodeById = async (nodeId: string, updateBody: any): Promise<INodeDocument | null> => {
  const node = await getNodeById(nodeId);
  if (!node) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Node not found');
  }
  Object.assign(node, updateBody);
  await node.save();
  return node;
};

/**
 * Delete user by id
 * @param {string} nodeId
 * @returns {Promise<INodeDocument | null>}
 */
const deleteNodeById = async (nodeId: string): Promise<INodeDocument | null> => {
  const node = await getNodeById(nodeId);
  if (!node) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Node not found');
  }
  await Node.findByIdAndRemove(nodeId);
  return node;
};

/**
 * Generate papan ekpsploitasi
 * @param {string} nodeId
 * @returns {Promise<INodeDocument | null>}
 */
const generatePapanEksploitasi = async (nodeId: string): Promise<any> => {
  let totalData: any = [];
  const data1: any = await recursiveFunction(nodeId, false, true, '', false);
  totalData.push(...data1);
  const nodeData: any = await Node.findById(nodeId).populate('line_id');
  const data2 = await nextRecursiveFunction(nodeId, nodeData);
  totalData.push(...data2);
  const uniqueLineNames = [...new Set(totalData.map((item: any) => item._doc.line_name))];
  const returnData = uniqueLineNames.map((item: any) => {
    return {
      [item]: totalData.filter((filtered: any) => filtered._doc.line_name == item),
      titik_bangunan: nodeData.name,
      kode_titik_bangunan: nodeData.code,
    };
  });
  return returnData;
};
const recursiveFunction: any = async (
  nodeId: string,
  hasSekunder: boolean,
  isNotDone: boolean,
  lineParentData: any,
  isNext: boolean
) => {
  const promises = [];
  const linesByNodeId: any = await getLinesByNode(nodeId);
  for (const line of linesByNodeId) {
    if (Object.keys(lineParentData).length === 0) {
      lineParentData = line;
    } else {
      if (line.node_id?.id === lineParentData.node_id?.id) lineParentData = line;
    }
    // console.log(`${line.name}\t\t\t${lineParentData.name}`);
    const nodesByLine = await getNodesByLine(line.id);
    if (nodesByLine.length !== 0) {
      hasSekunder = true;
      if (isNotDone) {
        for (const node of nodesByLine) {
          const nodeData = await recursiveFunction(node.id, hasSekunder, true, lineParentData, isNext);
          promises.push(...nodeData);
        }
      }
    } else {
      let area: any = await Area.findOne({ line_id: line.id }).populate('line_id');
      if (hasSekunder) {
        // area._doc.line_name = line.node_id?.line_id?.name;
        area._doc.line_name = lineParentData.name;
      } else {
        // Ketika Titik Utama Langsung Ke Sawah
        if (isNext) area._doc.line_name = lineParentData.name;
        else area._doc.line_name = line?.name;
      }
      area._doc.line_id = {
        id: area._doc.line_id.id,
        name: area._doc.line_id.name,
      };

      promises.push(area);
    }
  }

  const data = await Promise.all(promises);
  return data;
};

const nextRecursiveFunction = async (nodeId: any, parentNodeData: any) => {
  const promises = [];
  const nextNode = await Node.findOne({ prev_id: nodeId });
  if (nextNode) {
    const nextNodeData = await recursiveFunction(nextNode?._id, false, true, parentNodeData.line_id, true);
    if (nextNode?.prev_id) {
      const nextRecursiveData: any = await nextRecursiveFunction(nextNode?._id, parentNodeData);
      promises.push(...nextRecursiveData);
    }
    promises.push(...nextNodeData);
  }
  return promises;
};
const getLinesByNode = async (node_id: string) => {
  const linesByNodeId = await Line.find({ node_id: node_id });
  return linesByNodeId;
};
const getNodesByLine = async (line_id: string) => {
  const nodesByLine = await Node.find({ line_id: line_id });
  return nodesByLine;
};

export { createNode, getNodes, getNodeById, updateNodeById, deleteNodeById, generatePapanEksploitasi };
