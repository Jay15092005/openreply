import { getZernioClient } from "../lib/zernio/sdk";

async function main() {
  const apiKey = process.argv[2] || process.env.ZERNIO_API_KEY;
  if (!apiKey) {
    console.error("Usage: npx tsx scripts/verify-zernio.ts <ZERNIO_API_KEY>");
    console.error("   or: ZERNIO_API_KEY=sk_... npx tsx scripts/verify-zernio.ts");
    process.exit(1);
  }

  console.log("Connecting to Zernio API with provided key...");
  const client = getZernioClient(apiKey);

  try {
    const { data } = await client.accounts.listAccounts();
    console.log("✅ Successfully authenticated with Zernio!");
    console.log(`Found ${(data as any).accounts?.length ?? 0} connected account(s):`);

    for (const acc of (data as any).accounts ?? []) {
      console.log(`  - Platform: ${acc.platform}`);
      console.log(`    Username: @${acc.username}`);
      console.log(`    Display Name: ${acc.displayName}`);
      console.log(`    Account ID: ${acc._id}`);
      console.log(`    Profile: ${acc.profileId?.name ?? acc.profileId} (${acc.profileId?._id ?? acc.profileId})`);
      console.log(`    Active: ${acc.isActive}`);
      console.log(`    Permissions: ${acc.permissions?.join(", ")}`);
    }
  } catch (err) {
    console.error("❌ Failed to verify Zernio credentials:", err);
    process.exit(1);
  }
}

main();
