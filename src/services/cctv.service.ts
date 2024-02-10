import Node from '../models/node/mongoose';
import { getCCTVLink } from './hcp.service';

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<any>}
 */
export const getCCTV = async (filter: any, options: any): Promise<any> => {
  if (filter.search) {
    filter.$or = [
      { name: { $regex: new RegExp(filter.search, 'i') } },
      { code: { $regex: new RegExp(filter.search, 'i') } },
    ];
    delete filter.search;
  }
  filter = {
    ...filter,
    ['detail.cctv_list']: { $exists: true },
  };
  const nodes: any = options.limit ? await Node.paginate(filter, options) : await Node.find(filter);
  // if (options.limit) {
  //   nodes.docs = await Promise.all(
  //     nodes.docs.map(async (node: any, index: number) => {
  //       node.detail.cctv_list = await Promise.all(
  //         node.detail.cctv_list.map(async (cctv: any) => {
  //           console.log(cctv);
  //           // if(cctv.)
  //           const link = await getCCTVLink(cctv.link);
  //         })
  //       );
  //       return node;
  //     })
  //   );
  // }
  return nodes;
};
