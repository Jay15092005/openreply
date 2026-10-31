import Zernio from "@zernio/node";

/**
 * Returns an instance of the official Zernio SDK client.
 * Uses the passed apiKey or falls back to process.env.ZERNIO_API_KEY.
 * Follows the official Zernio quickstart: https://zernio.com/agent-quickstart.md
 */
export function getZernioClient(apiKey?: string): Zernio {
  const key = apiKey ?? process.env.ZERNIO_API_KEY;
  if (!key) {
    throw new Error(
      "Zernio API key is required. Set ZERNIO_API_KEY environment variable or provide an apiKey."
    );
  }
  return new Zernio({ apiKey: key });
}

/**
 * Default Zernio client instance initialized using process.env.ZERNIO_API_KEY.
 * Lazy proxy ensures client is created when first accessed.
 */
export const zernio: Zernio = new Proxy({} as Zernio, {
  get(_target, prop) {
    const client = getZernioClient();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

/**
 * Step 3: Verify with a read-only call.
 * Lists connected social accounts across platforms.
 */
export async function listAccounts(apiKey?: string) {
  const client = apiKey ? getZernioClient(apiKey) : zernio;
  return client.accounts.listAccounts();
}

/**
 * Step 4: Create or schedule a post.
 * Uses client.posts.createPost matching the official SDK specification.
 */
export async function createPost(
  params: {
    content: string;
    platforms: Array<{ platform: string; accountId: string }>;
    scheduledFor?: string;
    publishNow?: boolean;
    media?: Array<{ url: string; type?: "image" | "video" }>;
  },
  apiKey?: string
) {
  const client = apiKey ? getZernioClient(apiKey) : zernio;
  return client.posts.createPost({
    body: {
      content: params.content,
      platforms: params.platforms,
      ...(params.scheduledFor ? { scheduledFor: params.scheduledFor } : {}),
      ...(params.publishNow !== undefined ? { publishNow: params.publishNow } : {}),
      ...(params.media ? { media: params.media as any } : {}),
    },
  });
}

export { Zernio };
export default zernio;
