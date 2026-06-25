import crypto from "node:crypto";

function percentEncode(value: string): string {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

function oauthHeader(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerKey: string,
  consumerSecret: string,
  token: string,
  tokenSecret: string,
): string {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: token,
    oauth_version: "1.0",
  };

  const signatureBase = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(
      Object.entries({ ...params, ...oauthParams })
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${percentEncode(k)}=${percentEncode(v)}`)
        .join("&"),
    ),
  ].join("&");

  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;
  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(signatureBase)
    .digest("base64");

  const headerParams = { ...oauthParams, oauth_signature: signature };
  const header =
    "OAuth " +
    Object.entries(headerParams)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${percentEncode(k)}="${percentEncode(v)}"`)
      .join(", ");

  return header;
}

export type XPostResult = {
  postId: string;
  url: string;
};

export async function postToX(text: string): Promise<XPostResult> {
  const consumerKey = process.env.X_API_KEY?.trim();
  const consumerSecret = process.env.X_API_SECRET?.trim();
  const accessToken = process.env.X_ACCESS_TOKEN?.trim();
  const accessTokenSecret = process.env.X_ACCESS_TOKEN_SECRET?.trim();

  if (!consumerKey || !consumerSecret || !accessToken || !accessTokenSecret) {
    throw new Error(
      "Missing X credentials (X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET)",
    );
  }

  const url = "https://api.twitter.com/2/tweets";
  const auth = oauthHeader(
    "POST",
    url,
    {},
    consumerKey,
    consumerSecret,
    accessToken,
    accessTokenSecret,
  );

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const payload = (await response.json()) as {
    data?: { id: string };
    errors?: { detail?: string; message?: string }[];
  };

  if (!response.ok || !payload.data?.id) {
    const detail =
      payload.errors?.map((e) => e.detail ?? e.message).join("; ") ??
      response.statusText;
    throw new Error(`X API error (${response.status}): ${detail}`);
  }

  const postId = payload.data.id;
  return {
    postId,
    url: `https://x.com/i/web/status/${postId}`,
  };
}
