import { backendServerConfig } from "@config/config";

export async function getUploadUrl(fileName: string, contentType: string): Promise<string> {
  const res = await fetch(`${backendServerConfig.backendServerUrl}/webchat/upload/url`, {
    method: 'POST',
    body: JSON.stringify({
      fileName,
      contentType,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "Failed to get upload URL");
  }

  return json.data;
}

export async function uploadFileToStorage(uploadUrl: string, file: File): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
  });

  if (!res.ok) {
    throw new Error("Failed to upload file to storage");
  }
}

export async function uploadChatFile(file: File): Promise<string> {
  const uploadUrl = await getUploadUrl(file.name, file.type);
  await uploadFileToStorage(uploadUrl, file);

  const finalUrl = uploadUrl.split("?")[0];
  return finalUrl;
}

export const getChatHistoryAPI = async (token: string, mobileNo: string): Promise<Response | undefined> => {
  try {
    return await fetch(`${backendServerConfig.backendServerUrl}/whatsapp/history/${mobileNo}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      mode: "cors"
    });
  } catch (err) {
    console.error(err);
  }
};

