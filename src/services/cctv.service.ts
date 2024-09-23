import Node from '../models/node/mongoose';
import axios from 'axios';
import httpStatus from 'http-status';
import https from 'https';
import ApiError from '../utils/ApiError';

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
  // const nodes: any = options.limit ? await Node.paginate(filter, options) : await Node.find(filter);
  const nodes = await Node.find(filter);
  let dataReturn: Array<any> = [];
  nodes.forEach((item: any, index: number) => {
    item.detail.cctv_list.forEach((dataCCTV: any) => {
      dataReturn.push({
        name: item.name,
        cctv_list: [
          {
            ...dataCCTV,
            image: item.images[0]?.content,
          },
        ],
      });
    });
  });
  return {
    docs: dataReturn,
  };
};

export const generateLinkHikVision = async (cctv: any) => {
  try {
    if (cctv.type === 'hikvision') {
      let link = cctv.link.split('?')[0];
      // link = link.replace('192.168.50.58', '202.169.239.21');
      const query = cctv.link.split('?')[1];
      const header = query.split('&')[0].split('header=')[1];
      const data = query.split('&')[1].split('body=')[1];
      let headers: any = {
        'x-ca-signature-headers': 'x-ca-key,x-ca-nonce,x-ca-timestamp',
        Accept: 'application/json',
        ContentType: 'application/json;charset=UTF-8',
      };
      header.split(',').forEach((item: any) => {
        let key = item.split(':')[0];
        let value = item.split(':')[1];
        headers[key] = value;
      });
      let body: any = {
        streamType: 0,
        protocol: 'hls',
        transmode: 1,
        requestWebsocketProtocol: 0,
      };
      data.split(',').forEach((item: any) => {
        let key = item.split(':')[0];
        let value = item.split(':')[1];
        body[key] = value;
      });
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      const agent = new https.Agent({
        rejectUnauthorized: false, // Ignore SSL certificate errors
        requestCert: false,
      });
      const response = await axios.post(`${link}`, body, {
        headers: headers,
        httpsAgent: agent,
      });
      if (response.status === 200) {
        if (response.data.code === '0') return response.data.data.url;
      }
    }
    return cctv.link;
  } catch (error: any) {
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, error.toString());
  }
};
