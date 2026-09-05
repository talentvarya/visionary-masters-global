const LINKEDIN_VERSION = "202401";
const API_BASE = "https://api.linkedin.com";

function getCredentials() {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;

  if (!accessToken || !personUrn) {
    return null;
  }

  return { accessToken, personUrn };
}

function authHeaders(accessToken: string, extra?: Record<string, string>) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "X-Restli-Protocol-Version": "2.0.0",
    "LinkedIn-Version": LINKEDIN_VERSION,
    ...extra,
  };
}

async function initializeImageUpload(personUrn: string, accessToken: string) {
  const res = await fetch(`${API_BASE}/rest/images?action=initializeUpload`, {
    method: "POST",
    headers: authHeaders(accessToken, { "Content-Type": "application/json" }),
    body: JSON.stringify({
      initializeUploadRequest: { owner: personUrn },
    }),
  });

  if (!res.ok) {
    throw new Error(`LinkedIn image init failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return data.value as { uploadUrl: string; image: string };
}

async function uploadImageBinary(uploadUrl: string, imageData: ArrayBuffer, accessToken: string) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: imageData,
  });

  if (!res.ok) {
    throw new Error(`LinkedIn image upload failed: ${res.status}`);
  }
}

async function createPost(
  personUrn: string,
  accessToken: string,
  text: string,
  imageAssetUrn?: string
) {
  const body: Record<string, unknown> = {
    author: personUrn,
    commentary: text,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  if (imageAssetUrn) {
    body.content = { media: { id: imageAssetUrn } };
  }

  const res = await fetch(`${API_BASE}/rest/posts`, {
    method: "POST",
    headers: authHeaders(accessToken, { "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`LinkedIn post creation failed: ${res.status} ${await res.text()}`);
  }
}

export async function shareToLinkedIn(text: string, imageUrl?: string | null) {
  const credentials = getCredentials();
  if (!credentials) {
    throw new Error(
      "LinkedIn is not configured. Set LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_URN to enable auto-posting."
    );
  }
  const { accessToken, personUrn } = credentials;

  let imageAssetUrn: string | undefined;

  if (imageUrl) {
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      throw new Error(`Could not fetch image to share: ${imageUrl}`);
    }
    const imageData = await imageRes.arrayBuffer();

    const { uploadUrl, image } = await initializeImageUpload(personUrn, accessToken);
    await uploadImageBinary(uploadUrl, imageData, accessToken);
    imageAssetUrn = image;
  }

  await createPost(personUrn, accessToken, text, imageAssetUrn);
}

export function isLinkedInConfigured() {
  return getCredentials() !== null;
}
