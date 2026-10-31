import { Zernio } from "@zernio/node";

/**
 * Returns an instance of the official Zernio SDK client.
 * Uses the passed apiKey or falls back to process.env.ZERNIO_API_KEY.
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

export { Zernio };
