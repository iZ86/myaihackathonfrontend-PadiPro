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

export const reverseGeocodeAPI = async (lat: number, lon: number): Promise<string> => {
  try {
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
    );
    const geoJson = await geoRes.json();
    const city =
      geoJson.address.city ||
      geoJson.address.town ||
      geoJson.address.village ||
      geoJson.address.suburb;
    const state = geoJson.address.state;
    if (city && state) return `${city}, ${state}`;
    if (geoJson.display_name)
      return geoJson.display_name.split(",").slice(0, 2).join(",");
    return "Field Location";
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return "Field Site";
  }
};