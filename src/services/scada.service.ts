import axios from 'axios';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

export const getRealtimeValues = async (body: Array<string>) => {
  try {
    const FormulaList = body.map((item: string) => {
      return {
        Formula: item,
        Formatted: true,
      };
    });
    const token = await getToken();
    const datas = (
      await axios.post('http://192.168.50.58:8733/TopkapiService/GetRealTimeValues', {
        FormulaList: FormulaList,
        Token: token,
      })
    ).data.GetRealTimeValuesResult.ValueList;

    return datas;
  } catch (error: any) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

const getToken = async () => {
  const token = (
    await axios.post('http://192.168.50.58:8733/TopkapiService/LogIn', {
      AccountName: 'ADMINISTRATOR',
      Password: 'wiratama1791',
      Timeout: 99999,
    })
  ).data.LogInResult.Token;
  return token;
};
