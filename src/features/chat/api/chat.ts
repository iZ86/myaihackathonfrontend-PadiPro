import { backendServerConfig } from "@config/config";

export async function getUploadUrl(mobileNo: string, fileName: string, contentType: string): Promise<{ uploadUrl: string; downloadUrl: string; storagePath: string; }> {
  const res = await fetch(`${backendServerConfig.backendServerUrl}/webchat/upload/url/${mobileNo}`, {
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

async function computeSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function uploadChatFile(mobileNo: string, file: File): Promise<{ downloadUrl: string; storagePath: string; sha256: string; }> {
  const { uploadUrl, downloadUrl, storagePath } = await getUploadUrl(mobileNo, file.name.split(".")[0], file.type);
  const [, sha256] = await Promise.all([
    uploadFileToStorage(uploadUrl, file),
    computeSHA256(file),
  ]);
  return { downloadUrl, storagePath, sha256 };
}

export async function saveMediaMetaDataAPI(
  token: string,
  mobileNo: string,
  fileName: string,
  mimeType: string,
  storagePath: string,
  downloadUrl: string,
  sha256: string,
  fileType: 'image' | 'audio' | 'video',
  caption?: string,
): Promise<void> {
  await fetch(`${backendServerConfig.backendServerUrl}/webchat/media/${mobileNo}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileName, mimeType, storagePath, downloadUrl, caption: caption ?? '', sha256, fileType }),
  });
}

export const sendWebchatMessageAPI = async (
  token: string,
  mobileNo: string,
  message?: string,
  mediaUrl?: string,
  mediaName?: string,
  mediaType?: 'image' | 'video' | 'audio',
): Promise<Response | undefined> => {
  try {
    return await fetch(`${backendServerConfig.backendServerUrl}/chat/webchat`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mobile_no: mobileNo,
        message,
        media_url: mediaUrl,
        media_name: mediaName,
        media_type: mediaType,
        created_by: 'WEBCHAT',
      }),
      mode: 'cors',
    });
  } catch (err) {
    console.error(err);
  }
};

export const getChatHistoryAPI = async (token: string, mobileNo: string): Promise<Response | undefined> => {
  try {
    return await fetch(`${backendServerConfig.backendServerUrl}/webchat/history/${mobileNo}`, {
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

