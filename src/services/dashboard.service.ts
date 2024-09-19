import httpStatus from 'http-status';
import { Template } from '../models/template'; // Import the ITemplateDocument type from your models
import ApiError from '../utils/ApiError';
import { Node } from '../models/node';
import Line from '../models/line/mongoose';
import Area from '../models/area/mongoose';

/**
 * Get user by id
 * @returns {Promise<any>}
 */
export const getDashboard = async (): Promise<any> => {
  // assignPrevNode();
};

/**
 * Get maps data
 * @returns {Promise<any>}
 * @param {Object} filter - Mongo filter
 */
export const getMaps = async (filter: any): Promise<any> => {
  if (filter.search) {
    filter.$or = [{ name: { $regex: new RegExp(filter.search, 'i') } }];
    delete filter.search;
  }
  filter = {
    ...filter,
    ['location']: { $exists: true },
  };
  const nodes = await Node.find(filter).select('id name location type');
  const lines = await Line.find({
    type: {
      $ne: 'tersier',
    },
    location: { $exists: true },
    'location.data': { $exists: true },
  }).select('id name location type');
  const areas = await Area.find({
    // type: {
    //   $ne: 'daerah irigasi',
    // },
    $or: [
      { $and: [{ location: { $exists: true } }, { 'location.data': { $exists: true } }] },
      { link_google_map: { $exists: true } },
    ],
  }).select('id name location type link_google_map');
  // assignPrevNode();
  return {
    nodes,
    lines,
    areas,
  };
};

const assignPrevNode = async () => {
  const nodes: Array<any> = await Node.find({ type: { $ne: 'bendungan' } }).sort({ code: 1 });
  const sorted = nodes.sort((a: any, b: any) => {
    // console.log(item.code);
    let codeA = a.code.split('_')[1];
    const splittedCodeA = codeA.split('.');
    const joinedCodeA = `${splittedCodeA[0]}_${parseInt(splittedCodeA[1] + splittedCodeA[2])
      .toString()
      .padStart(6, '0')}`;
    // console.log(a.code, joinedCodeA);
    let codeB = b.code.split('_')[1];
    const splittedCodeB = codeB.split('.');
    const joinedCodeB = `${splittedCodeB[0]}_${parseInt(splittedCodeB[1] + splittedCodeB[2])
      .toString()
      .padStart(6, '0')}`;
    return joinedCodeA.localeCompare(joinedCodeB);
  });
  // console.log(sorted);
  let lastData: any = {};
  let prevData: any = {};
  const dataNew = await Promise.all(
    sorted.map(async (item) => {
      const lastCode = lastData.code?.split('_')[1].split('.')[0];
      const itemCode = item.code.split('_')[1].split('.')[0];
      // console.log(lastCode, itemCode);
      let returnData: any = {};
      if (lastCode === itemCode) {
        returnData = {
          name: item.name,
          code: item.code,
          type: item.type,
          parent_id: item.parent_id.id,
          line_id: item.line_id.id,
          detail: item.detail,
          prev_id: prevData.id,
          // prev_code: prevData.code,
          // prev_name: prevData.name,
        };
      } else {
        lastData = item;
        returnData = {
          name: item.name,
          code: item.code,
          type: item.type,
          parent_id: item.parent_id.id,
          line_id: item.line_id.id,
          detail: item.detail,
        };
      }
      prevData = item;
      const update = await Node.findOneAndUpdate(item._id, returnData);
      return update;
    })
  );
  return dataNew;
};

export const convertToHm = async () => {
  const nodes = await Node.find({});
  const promises: any[] = [];
  for (const node of nodes) {
    const hm = parseInt(node.code.split('.')[1] + node.code.split('.')[2]);
    if (!Number.isNaN(hm)) {
      const updateOne = Node.findByIdAndUpdate(node.id, {
        hm: hm,
      });
      promises.push(updateOne);
    }
  }
  return await Promise.all(promises);
};
