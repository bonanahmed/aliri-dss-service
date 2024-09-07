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
      await axios.post('https://65d7-202-169-239-12.ngrok-free.app/TopkapiService/GetRealTimeValues', {
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
    await axios.post('https://65d7-202-169-239-12.ngrok-free.app/TopkapiService/LogIn', {
      AccountName: 'ADMINISTRATOR',
      Password: 'wiratama1791',
      Timeout: 99999,
    })
  ).data.LogInResult.Token;
  return token;
};
