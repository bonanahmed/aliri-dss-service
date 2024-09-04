import httpStatus from 'http-status';
import { Node } from '../models/node'; // Import the INodeDocument type from your models
import ApiError from '../utils/ApiError';
import { INodeDocument, INodeModel } from '../models/node/mongoose';
import { Line } from '../models/line';
import { Area } from '../models/area';
import { PlantPattern } from '../models/plant-pattern';
import { Pasten } from '../models/pasten';
import { Group } from '../models/group';
import { PlantPatternTemplate } from '../models/plant-pattern-template';
import moment from 'moment';
import axios from 'axios';
import { NodeSensor } from '../models/node-sensor';
import { getRealtimeValues } from './scada.service';
import AreaConfiguration from '../models/area-configuration/mongoose';
import { NodeToLineDataActual } from '../models/actual-flow';

/**
 * Create a user
 * @param {Object} body
 * @returns {Promise<INodeDocument>}
 */
export const createNode = async (body: any): Promise<INodeDocument> => {
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
export const getNodes = async (filter: any, options: any): Promise<any> => {
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
export const getNodeById = async (id: string): Promise<INodeDocument | null> => {
  return Node.findById(id).populate('line_id');
};

/**
 * Update user by id
 * @param {string} nodeId
 * @param {Object} updateBody
 * @returns {Promise<INodeDocument | null>}
 */
export const updateNodeById = async (nodeId: string, updateBody: any): Promise<INodeDocument | null> => {
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
export const deleteNodeById = async (nodeId: string): Promise<INodeDocument | null> => {
  const node = await getNodeById(nodeId);
  if (!node) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Node not found');
  }
  await Node.findByIdAndRemove(nodeId);
  return node;
};

/**
 * Update user by id
 * @param {Object} updateBody
 * @returns {Promise<INodeDocument | null>}
 */
export const updateManyNodes = async (updateBody: any[]): Promise<INodeDocument[] | null> => {
  const promises: any[] = [];
  for (const data of updateBody) {
    if (data.id) {
      const dataLocation = {
        location: {
          type: data.mapType,
          data: {
            lat: parseFloat(data.Latitude.replace(',', '.')),
            lng: parseFloat(data.Longitude.replace(',', '.')),
          },
        },
      };
      console.log(data.id, dataLocation);
      const node = await Node.findByIdAndUpdate(data.id, {
        ...dataLocation,
      });
      promises.push(node);
    }
  }
  return await promises;
};

export const generatePapanEksploitasi = async (nodeId: string): Promise<any> => {
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
      let area: any = await Area.findOne({ line_id: line.id }).populate('line_id detail.kemantren detail.juru');
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
        actual_water_needed: dataRawArea * item.pasten,
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
      await axios.post('http://192.168.50.58:8733/TopkapiService/LogIn', {
        AccountName: 'ADMINISTRATOR',
        Password: 'wiratama1791',
        Timeout: 99999,
      })
    ).data.LogInResult.Token;
    let totalDebit = 0;
    const dataDebit = (
      await axios.post('http://192.168.50.58:8733/TopkapiService/GetRealTimeValues', {
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
      await axios.post('http://192.168.50.58:8733/TopkapiService/LogIn', {
        AccountName: 'ADMINISTRATOR',
        Password: 'wiratama1791',
        Timeout: 99999,
      })
    ).data.LogInResult.Token;
    let dataReturn: any = {};
    const dataMonitoring = (
      await axios.post('http://192.168.50.58:8733/TopkapiService/GetRealTimeValues', {
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

export const calculateFlow = async (nodeId: string, date: string) => {
  const node: any | null = await Node.findById(nodeId)
    .select('name code line_id hm distance_to_prev rating_curve_table area_id')
    .populate('line_id');
  let returnData = await checkNode(node!, date);
  const nodes: any = await Node.find({
    line_id: node.line_id._id,
    hm: {
      $gt: node.hm,
    },
  })
    .sort({ hm: -1 })
    .select('name code line_id hm distance_to_prev prev_id')
    .populate('line_id line_id.detail.juru');
  for (const nodeData of nodes) {
    const checkNodeData = await checkNode(nodeData!, date);
    let panjangSaluran = 0;
    let faktorDistribusi = 0;
    if (checkNodeData.line_id.type === 'primer') {
      // panjangSaluran = 9232;
      panjangSaluran = parseFloat((await AreaConfiguration.findOne({ key: 'panjang_saluran_primer' }))?.value ?? '0');
      faktorDistribusi = parseFloat((await AreaConfiguration.findOne({ key: 'faktor_distribusi_primer' }))?.value ?? '0');
      // faktorDistribusi = 0.9;
    } else if (checkNodeData.line_id.type === 'sekunder') {
      // panjangSaluran = 68223;
      panjangSaluran = parseFloat((await AreaConfiguration.findOne({ key: 'panjang_saluran_sekunder' }))?.value ?? '0');
      faktorDistribusi = parseFloat((await AreaConfiguration.findOne({ key: 'faktor_distribusi_sekunder' }))?.value ?? '0');
      // faktorDistribusi = 0.3;
    }
    const distance_total = nodeData.distance_to_prev ?? 0;
    const faktor_loses = (distance_total ?? 0) / panjangSaluran;
    const pangkat_loses = faktorDistribusi ** faktor_loses;
    const debit_sebelumnya = returnData.direction[node.line_id.name]?.debit_kebutuhan ?? 0;
    const akumulasi_debit = debit_sebelumnya + checkNodeData.total_debit_kebutuhan;
    const debit_loses = akumulasi_debit / pangkat_loses;
    // console.log(checkNodeData.name, faktorDistribusi, panjangSaluran);
    // console.log('\tpanjang_ruas: ', distance_total);
    // console.log('\ttotal_luas_area: ', checkNodeData.total_luas_area);
    // console.log('\tfaktor_loses: ', faktor_loses);
    // console.log('\tdebit_perintah: ', checkNodeData.total_debit_kebutuhan);
    // console.log('\tdebit_sebelumnya: ', debit_sebelumnya ?? 'Tidak ada');
    // console.log('\tdebit_loses: ', debit_loses);
    // console.log('\tarah: ', checkNodeData.direction);
    let pola_tanam: any[] = [];
    Object.values(checkNodeData.direction).forEach((data: any) => {
      pola_tanam = [...pola_tanam, ...data.pola_tanam];
    });
    const lineDetail: any = await Line.findById(node.line_id._id).populate('detail.juru detail.kemantren');
    returnData = {
      ...returnData,
      total_luas_area: returnData.total_luas_area + checkNodeData.total_luas_area,
      direction: {
        ...returnData.direction,
        [node.line_id.name]: {
          line_id: node.line_id._id,
          juru: lineDetail?.detail?.juru?.name ?? '',
          juru_phone: lineDetail?.detail?.juru?.mobile_phone_number ?? undefined,
          kemantren: lineDetail?.detail?.kemantren?.name ?? '',
          luas_area: (returnData.direction[node.line_id.name]?.luas_area ?? 0) + checkNodeData.total_luas_area,
          debit_kebutuhan: debit_loses,
          pola_tanam: [...(returnData.direction[node.line_id.name]?.pola_tanam ?? []), ...pola_tanam],
        },
      },
    };
  }
  returnData.total_debit_kebutuhan = 0;
  Object.entries(returnData?.direction).forEach((datareturn: any) => {
    returnData.total_debit_kebutuhan += datareturn[1].debit_kebutuhan;
  });
  let panjangSaluran = 0;
  let faktorDistribusi = 0;
  if (returnData.line_id.type === 'primer') {
    panjangSaluran = 9232;
    faktorDistribusi = parseFloat((await AreaConfiguration.findOne({ key: 'faktor_distribusi_primer' }))?.value ?? '0');
    // faktorDistribusi = 0.9;
  } else if (returnData.line_id.type === 'sekunder') {
    panjangSaluran = 68223;
    faktorDistribusi = parseFloat((await AreaConfiguration.findOne({ key: 'faktor_distribusi_sekunder' }))?.value ?? '0');
  }
  const distance_total = node.distance_to_prev ?? 0;
  const faktor_loses = (distance_total ?? 0) / panjangSaluran;
  const pangkat_loses = faktorDistribusi ** faktor_loses;
  const akumulasi_debit = returnData.total_debit_kebutuhan;
  returnData.total_debit_kebutuhan = akumulasi_debit / pangkat_loses;
  returnData.rating_curve_table = node.rating_curve_table;
  return returnData;
};

const checkNode = async (node: any, date: string) => {
  const direction: any = {};
  let debit_loses_terakhir = 0;
  let total_debit_kebutuhan = 0;
  let total_luas_area = 0;
  let lastLineData: any;
  const lines: any = await Line.find({ node_id: node.id }).populate('detail.juru detail.kemantren');
  for (const line of lines) {
    if (!lastLineData) lastLineData = line;
    if (line.type === 'sekunder') {
      const nodesByLineSekunder = await Node.find({ line_id: line.id })
        .select('name code distance_to_prev prev_id')
        .sort({ hm: -1 });
      for (const nodeByLineSekunder of nodesByLineSekunder) {
        const nodeDetail = await checkNode(nodeByLineSekunder, date);
        if (lastLineData?.id !== line.id) {
          debit_loses_terakhir = 0;
          lastLineData = line;
        }
        const distance_total = nodeByLineSekunder.distance_to_prev ?? 0;
        const faktor_loses = (distance_total ?? 0) / 68223.0;
        const pangkat_loses = 0.3 ** faktor_loses;
        const akumulasi_debit = debit_loses_terakhir + nodeDetail.total_debit_kebutuhan;
        const debit_dengan_loses = akumulasi_debit / pangkat_loses;
        debit_loses_terakhir = debit_dengan_loses;
        total_luas_area += nodeDetail.total_luas_area;
        // if (isPrimary) {
        //   console.log(nodeByLineSekunder.name);
        //   console.log('\tpanjang_ruas: ', distance_total);
        //   console.log('\ttotal_luas_area: ', total_luas_area);
        //   console.log('\tfaktor_loses: ', faktor_loses);
        //   console.log('\tdebit_perintah: ', nodeDetail.total_debit_kebutuhan);
        //   console.log('\tdebit_sebelumnya: ', debit_loses_terakhir ?? 'Tidak ada');
        //   console.log('\tdebit_loses: ', debit_dengan_loses);
        //   console.log('\tarah: ', direction);
        // }
        let plant_patterns: any = [];
        const nodePlantPatterns: any[] = Object.values(nodeDetail.direction);
        for (const nodePlantPattern of nodePlantPatterns) {
          plant_patterns = [...plant_patterns, ...nodePlantPattern.pola_tanam];
        }
        direction[line.name] = {
          line_id: line.id,
          juru: line.detail?.juru?.name ?? '',
          juru_phone: line?.detail?.juru?.mobile_phone_number ?? undefined,
          kemantren: line.detail?.kemantren?.name ?? '',
          luas_area: (direction[line.name]?.luas_area ?? 0) + nodeDetail.total_luas_area,
          debit_kebutuhan: debit_dengan_loses,
          pola_tanam: [...(direction[line.name]?.pola_tanam ?? []), ...plant_patterns],
        };
        const directionIsExist = Object.entries(direction).length !== 0;
        if (directionIsExist) {
          total_debit_kebutuhan = 0;
          Object.entries(direction).forEach((direct: any) => {
            total_debit_kebutuhan += direct[1].debit_kebutuhan;
          });
        }
      }
    } else {
      const area: any = await Area.findOne({ line_id: line.id }).populate('detail.juru detail.kemantren');
      const plantPatterns: any = area ? await calculatePlantPattern(area, date) : [];

      const luas_area = area?.detail.standard_area ?? 0;
      // const debit_kebutuhan = luas_area * 1 * 1.25;
      let debit_kebutuhan = 0;
      for (const plantPattern of plantPatterns) {
        debit_kebutuhan += plantPattern.water_flow;
      }
      total_luas_area += luas_area;
      total_debit_kebutuhan += debit_kebutuhan;
      direction[line.name] = {
        nama_area: area?.name ?? undefined,
        juru: area?.detail?.juru?.name ?? undefined,
        juru_phone: area?.detail?.juru?.mobile_phone_number ?? undefined,
        kemantren: area?.detail?.kemantren?.name ?? undefined,
        line_id: line.id,
        luas_area,
        debit_kebutuhan,
        pola_tanam: plantPatterns,
      };
    }
  }
  const returnData = {
    ...node._doc,
    total_debit_kebutuhan,
    total_luas_area,
    direction: direction,
  };
  return returnData;
};
const calculatePlantPattern = async (area: any, date?: any) => {
  const dateNow = date ? date : moment(Date.now()).format('YYYY-MM-DD');
  const distinctPlantPatternActualCount = await PlantPattern.distinct('code', {
    area_id: area.id,
    date: dateNow,
  });
  const plantPatternActual = await PlantPattern.find({
    area_id: area.id,
    date: dateNow,
  });
  if (plantPatternActual.length !== 0) {
    return plantPatternActual.map((item: any) => {
      const raw_material_area_planted =
        item.raw_material_area_planted ?? area?.detail?.standard_area / distinctPlantPatternActualCount.length ?? 0;
      const water_flow = raw_material_area_planted * item.pasten * 1.25;
      return {
        area: area.name,
        code: item.code,
        color: item.color,
        date: item.date,
        growth_time: item.growth_time,
        plant_type: item.plant_type,
        pasten: item.pasten,
        raw_material_area_planted: raw_material_area_planted,
        water_flow: water_flow,
        type: 'actual',
      };
    });
  } else {
    const findGroupTemplate = await Group.findById(area.detail.group);
    const distinctPlantPatternPlanningCount = await PlantPatternTemplate.distinct('code', {
      plant_pattern_template_name_id: findGroupTemplate?.plant_pattern_template_name_id,
      date: dateNow,
    });
    const plantPatternPlanning = (
      await PlantPatternTemplate.find({
        plant_pattern_template_name_id: findGroupTemplate?.plant_pattern_template_name_id,
        date: dateNow,
      })
    ).map((item: any) => {
      const raw_material_area_planted = area.detail.standard_area / distinctPlantPatternPlanningCount.length;
      const water_flow = raw_material_area_planted * item.pasten * 1.25;
      return {
        area: area.name,
        code: item.code,
        color: item.color,
        date: item.date,
        growth_time: item.growth_time,
        plant_type: item.plant_type,
        pasten: item.pasten,
        raw_material_area_planted: raw_material_area_planted,
        water_flow: water_flow,
        type: 'planning',
      };
    });
    return plantPatternPlanning;
  }
};

const calculateDistance = async (prev_id: any) => {
  if (prev_id) {
    let distance_total = 0;
    const nodeLineExist = await Line.find({ node_id: prev_id });
    if (nodeLineExist.length === 0) {
      const node = await Node.findById(prev_id);
      console.log('\t' + node?.name);
      distance_total += node?.distance_to_prev ?? 0;
      if (node?.prev_id) {
        distance_total += await calculateDistance(node?.prev_id);
      }
    }

    return distance_total;
  }
  return 0;
};

export const linesInNode = async (nodeId: string) => {
  const node = await Node.findById(nodeId);
  const lines: any = await Line.find({
    $or: [
      { _id: node?.line_id }, // Assuming line_id is the ID of the Line document
      { node_id: nodeId },
    ],
  });
  return lines;
};

//Sensor

export const upsertDataNodeSensor = async (data: any) => {
  const sensor = await NodeSensor.findOneAndUpdate(
    { node_id: data.node_id, direction_line: data.direction_line, sensor_type: data.sensor_type },
    {
      ...data,
    },
    { upsert: true, new: true, runValidators: true }
  );
  return sensor;
};

export const getDataNodeSensors = async (nodeId: string) => {
  const sensors = await NodeSensor.find({ node_id: nodeId }).populate('direction_line');
  return sensors;
};

export const getDataNodeSensor = async (nodeId: string, lineId: string, filter: any) => {
  let sensorFind = await NodeSensor.findOne({ node_id: nodeId, direction_line: lineId, ...filter }).populate(
    'direction_line'
  );
  if (sensorFind?.sensor_code) {
    const sensorData = (await getRealtimeValues([sensorFind?.sensor_code]))[0].Value;
    await NodeSensor.findByIdAndUpdate(sensorFind.id, {
      sensor_value: sensorData,
    });
  }
  const sensor = await NodeSensor.findById(sensorFind?.id);
  return sensor;
};

export const getDataNodeSensorDetail = async (sensorId: string) => {
  const sensor = await NodeSensor.findById(sensorId);
  return sensor;
};

export const deleteNodeSensor = async (id: string) => {
  const sensor = await NodeSensor.findByIdAndDelete(id);
  return sensor;
};

//Actual Flow
export const upsertDataNodeToLineDataActual = async (data: any) => {
  const dataActual = await NodeToLineDataActual.findOneAndUpdate(
    { node_id: data.node_id, direction_line: data.direction_line, date: data.date },
    {
      ...data,
    },
    { upsert: true, new: true, runValidators: true }
  );
  return dataActual;
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
export const getDataNodeToLineDataActuals = async (filter: any, options: any): Promise<any> => {
  if (filter.search) {
    filter.$or = [
      { code: { $regex: new RegExp(filter.search, 'i') } },
      { name: { $regex: new RegExp(filter.search, 'i') } },
    ];
    delete filter.search;
  }
  options.populate = [
    { path: 'node_id', options: { strictPopulate: false } },
    {
      path: 'direction_line',
      options: { strictPopulate: false },
    },
  ];
  const nodes = options.limit
    ? await NodeToLineDataActual.paginate(filter, options)
    : await NodeToLineDataActual.find(filter);
  return nodes;
};

export const getDataNodeToLineDataActual = async (nodeId: string, lineId: string, filter: any) => {
  // if (!filter.date) delete filter.date;
  // let sensorFind = await NodeSensor.findOne({ node_id: nodeId, direction_line: lineId, ...filter }).populate(
  //   'direction_line'
  // );
  // if (sensorFind?.sensor_code) {
  //   const sensorData = (await getRealtimeValues([sensorFind?.sensor_code]))[0].Value;
  //   await NodeSensor.findByIdAndUpdate(sensorFind.id, {
  //     sensor_value: sensorData,
  //   });
  //   const sensor = await NodeSensor.findById(sensorFind?.id);
  //   return sensor;
  // }
  // else {
  if (!filter.date) {
    filter.date = moment(new Date()).format('YYYY-MM-DD');
  }
  let dataActualFind = await NodeToLineDataActual.findOne({ node_id: nodeId, direction_line: lineId, ...filter }).populate(
    'direction_line'
  );
  return dataActualFind;
  // }
};

export const deleteNodeToLineDataActual = async (id: string) => {
  const node = await NodeToLineDataActual.findByIdAndDelete(id);
  return node;
};
