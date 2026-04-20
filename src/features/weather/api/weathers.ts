import { backendServerConfig } from "../../../config/config";

export const getWeatherDailyByMobileNoAPI = async (token: string, mobileNo: string): Promise<Response | undefined> => {
  try {
    return await fetch(`${backendServerConfig.backendServerUrl}/weather/daily/${mobileNo}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        mode: "cors"
      });
  } catch (err) {
    console.error(err);
  }
};
