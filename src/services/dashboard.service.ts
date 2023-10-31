import httpStatus from 'http-status';
import { Template } from '../models/template'; // Import the ITemplateDocument type from your models
import ApiError from '../utils/ApiError';
import { Node } from '../models/node';

/**
 * Get user by id
 * @returns {Promise<any>}
 */
export const getDashboard = async (): Promise<any> => {
  // assignPrevNode();
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
  console.log(dataNew);
  return dataNew;
};
