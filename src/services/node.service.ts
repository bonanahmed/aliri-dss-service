import httpStatus from 'http-status';
import { Node } from '../models/node'; // Import the INodeDocument type from your models
import ApiError from '../utils/ApiError';
import { INodeDocument } from '../models/node/mongoose';
import { Line } from '../models/line';
import { Area } from '../models/area';
import { PlantPattern } from '../models/plant-pattern';
import { Pasten } from '../models/pasten';
import { Group } from '../models/group';
import { PlantPatternTemplate } from '../models/plant-pattern-template';
import moment from 'moment';
import axios from 'axios';

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
  options.populate = [
    { path: 'parent_id', options: { strictPopulate: false } },
    {
      path: 'line_id',
      options: { strictPopulate: false },
      populate: { path: 'node_id', options: { strictPopulate: false } },
    },
    {
      path: 'prev_id',
      select: 'name',
      options: { strictPopulate: false },
    },
  ];
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

const generatePapanEksploitasi = async (nodeId: string): Promise<any> => {
  let totalData: any = [];
  const data1: any = await recursiveFunction(nodeId, false, true, '', false);
  totalData.push(...data1);
  const nodeData: any = await Node.findById(nodeId).populate('line_id');
  const data2 = await nextRecursiveFunction(nodeId, nodeData);
  totalData.push(...data2);
  const uniqueLineNames = [...new Set(totalData.map((item: any) => item._doc.line_name))];
  let returnData: any = {};
  returnData['papan_digital'] = uniqueLineNames.map((item: any) => {
    return {
      [item]: totalData.filter((filtered: any) => filtered._doc.line_name == item),
      titik_bangunan: nodeData.name,
      kode_titik_bangunan: nodeData.code,
    };
  });
  returnData['rating_curve_table'] = nodeData.rating_curve_table;
  returnData['debit_ketersediaan'] = await getDebitKetersediaan();
  returnData['realtime'] = await getRealtimeMonitoringDebit();
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
      if (area) {
        let plant_patterns = await findPlantPattern(area);
        const areaDetail = await findAreaDetail(plant_patterns);
        if (hasSekunder) {
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
        area._doc.detail.areaDetail = areaDetail;
        delete area._doc.detail.group;
        promises.push(area);
      }
    }
  }

  const data = await Promise.all(promises);
  return data;
};
const findPeriod = (date: any) => {
  const getCurrentDate = moment(date).format('DD');
  const getCurrentMonth = moment(date).format('YYYY-MM');
  const startOfMonth = moment(date, 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
  const endOfMonth = moment(date, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD');
  let startDate = startOfMonth;
  let endDate = endOfMonth;
  if (parseInt(getCurrentDate) <= 15) {
    endDate = getCurrentMonth + '-15';
  } else {
    startDate = getCurrentMonth + '-16';
  }
  return {
    startDate,
    endDate,
  };
};

const findPlantPattern = async (area: any) => {
  const dateNow = moment(Date.now()).format('YYYY-MM-DD');
  const { startDate, endDate } = findPeriod(dateNow);
  const plantPatternActual = await PlantPattern.find({ area_id: area.id, date: { $gte: startDate, $lte: endDate } });
  if (plantPatternActual.length === 0) {
    const findGroupTemplate = await Group.findById(area.detail.group);
    const plantPatternPlanningCount = await PlantPatternTemplate.count({
      plant_pattern_template_name_id: findGroupTemplate?.plant_pattern_template_name_id,
      date: { $gte: startDate, $lte: endDate },
    });
    const plantPatternPlanning = (
      await PlantPatternTemplate.find({
        plant_pattern_template_name_id: findGroupTemplate?.plant_pattern_template_name_id,
        date: { $gte: startDate, $lte: endDate },
      })
    ).map((item: any) => {
      const dataRawArea = area.detail.standard_area / plantPatternPlanningCount;
      const actualWaterNeeded = dataRawArea * item.pasten;
      return {
        code: item.code,
        color: item.color,
        date: item.date,
        growth_time: item.growth_time,
        pasten: item.pasten,
        raw_material_area_planted: dataRawArea,
        // actualWaterNeeded: 0,
        actual_water_needed: dataRawArea * item.pasten,
        // water_flow: actualWaterNeeded * 1.25,
        water_flow: actualWaterNeeded,
      };
    });
    return plantPatternPlanning;
  }

  return plantPatternActual;
};

const findAreaDetail = async (plant_patterns: any) => {
  let areaDetail: any = {};
  for (const plant_pattern of plant_patterns) {
    const plant: any = await Pasten.findOne({ code: plant_pattern.code });
    if (plant?.plant_type) {
      let detail = {};
      const rawArea =
        (areaDetail[plant.plant_type]?.total_area ? areaDetail[plant.plant_type]?.total_area ?? 0 : 0) +
          plant_pattern.raw_material_area_planted ?? 0;
      detail = {
        total_area: isNaN(rawArea) ? 0 : rawArea,
        pasten: plant.pasten,
      };

      areaDetail[plant.plant_type] = detail;
      if (plant_pattern?.water_flow) areaDetail.waterFlow = plant_pattern.water_flow;
    }
  }
  return areaDetail;
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
  const linesByNodeId = await Line.find({ node_id: node_id }).populate([
    {
      path: 'node_id',
      options: { strictPopulate: false },
      populate: { path: 'line_id', options: { strictPopulate: false } },
    },
  ]);
  return linesByNodeId;
};
const getNodesByLine = async (line_id: string) => {
  const nodesByLine = await Node.find({ line_id: line_id });
  return nodesByLine;
};
const getDebitKetersediaan = async () => {
  try {
    const token = (
      await axios.post('http://202.169.239.21:8733/TopkapiService/LogIn', {
        AccountName: 'ADMINISTRATOR',
        Password: 'wiratama1791',
        Timeout: 99999,
      })
    ).data.LogInResult.Token;
    let totalDebit = 0;
    const dataDebit = (
      await axios.post('http://202.169.239.21:8733/TopkapiService/GetRealTimeValues', {
        FormulaList: [
          {
            Formula: 'B_KP.0.00_DEBIT_AVE_5DAY',
            Formatted: true,
          },
          {
            Formula: 'B_KP.6.1_DEBIT_AVE_5DAY',
            Formatted: true,
          },
        ],
        Token: token,
      })
    ).data.GetRealTimeValuesResult.ValueList;

    dataDebit.forEach((debit: any) => {
      totalDebit += parseFloat(debit.Value);
    });
    return totalDebit.toString();
  } catch (error: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};
const getRealtimeMonitoringDebit = async () => {
  try {
    const token = (
      await axios.post('http://202.169.239.21:8733/TopkapiService/LogIn', {
        AccountName: 'ADMINISTRATOR',
        Password: 'wiratama1791',
        Timeout: 99999,
      })
    ).data.LogInResult.Token;
    let dataReturn: any = {};
    const dataMonitoring = (
      await axios.post('http://202.169.239.21:8733/TopkapiService/GetRealTimeValues', {
        FormulaList: [
          {
            Formula: 'B_KP.6.1_LEVEL',
            Formatted: true,
          },
          {
            Formula: 'B_KP.6.1_DEBIT',
            Formatted: true,
          },
        ],
        Token: token,
      })
    ).data.GetRealTimeValuesResult.ValueList;
    dataMonitoring.forEach((data: any) => {
      dataReturn[data.Formula] = data.Value;
    });
    return dataReturn;
  } catch (error: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};
export const getMapNodeData = async (code: string) => {
  const codeFormat = code.replace(' ', '');
  const nodeByCode = await Node.findOne({ name: { $regex: new RegExp(codeFormat, 'i') } })
    .populate('line_id')
    .populate('parent_id');
  return nodeByCode;
};

export { createNode, getNodes, getNodeById, updateNodeById, deleteNodeById, generatePapanEksploitasi };
