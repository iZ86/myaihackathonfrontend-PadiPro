import { backendServerConfig } from "../../../config/config";

export const getUsersAPI = async (token: string): Promise<Response | undefined> => {
  try {
    return await fetch(`${backendServerConfig.backendServerUrl}/api/v1/users`,
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

export const getUserByMobileNoAPI = async (token: string, mobileNo: string): Promise<Response | undefined> => {
  try {
    return await fetch(`${backendServerConfig.backendServerUrl}/users/${mobileNo}`,
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