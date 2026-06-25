export type LinkedInPostResult = {
  postId: string;
  url: string;
};

export async function postToLinkedIn(text: string): Promise<LinkedInPostResult> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN?.trim();
  const authorUrn = process.env.LINKEDIN_AUTHOR_URN?.trim();

  if (!token || !authorUrn) {
    throw new Error(
      "Missing LinkedIn credentials (LINKEDIN_ACCESS_TOKEN, LINKEDIN_AUTHOR_URN)",
    );
  }

  const linkedinVersion =
    process.env.LINKEDIN_API_VERSION?.trim() ?? "202401";

  const response = await fetch("https://api.linkedin.com/rest/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "LinkedIn-Version": linkedinVersion,
      "X-Restli-Protocol-Version": "2.0.0",
    },
    body: JSON.stringify({
      author: authorUrn,
      commentary: text,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    }),
  });

  const postId = response.headers.get("x-restli-id") ?? "";
  const payload = (await response.json().catch(() => ({}))) as {
    message?: string;
    status?: number;
  };

  if (!response.ok) {
    throw new Error(
      `LinkedIn API error (${response.status}): ${payload.message ?? response.statusText}`,
    );
  }

  return {
    postId,
    url: postId
      ? `https://www.linkedin.com/feed/update/${encodeURIComponent(postId)}/`
      : "https://www.linkedin.com/in/ilakkmanoharan/recent-activity/all/",
  };
}
