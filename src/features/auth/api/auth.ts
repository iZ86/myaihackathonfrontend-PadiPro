import { backendServerConfig } from "../../../config/config";

export const generateOTPAPI = async (mobileNo: string): Promise<Response | undefined> => {
  try {
    return await fetch(`${backendServerConfig.backendServerUrl}/whatsapp/otp/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobile_no: mobileNo }),
    });
  } catch (err) {
    console.error(err);
  }
};

export const verifyOTPAPI = async (mobileNo: string, otp: string): Promise<Response | undefined> => {
  try {
    return await fetch(`${backendServerConfig.backendServerUrl}/whatsapp/otp/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mobile_no: mobileNo, otp }),
    });
  } catch (err) {
    console.error(err);
  }
};
