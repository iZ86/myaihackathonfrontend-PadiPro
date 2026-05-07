import { backendServerConfig } from "@config/config";

export async function updateUserCoordsByMobileNoAPI(mobileNo: string, latitude: number, longitude: number): Promise<Response | undefined> {
  try {
    return await fetch(`${backendServerConfig.backendServerUrl}/webchat/location/${mobileNo}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat: latitude,
        long: longitude
      }),
    });
  } catch (error) {
    console.error(error);
  }

}
