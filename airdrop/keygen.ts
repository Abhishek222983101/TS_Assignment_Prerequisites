import { Keypair } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

// Generate a new Solana keypair
const kp = Keypair.generate();

console.log(`✔️ You've generated a new Solana wallet!`);
console.log(`Public Key: ${kp.publicKey.toBase58()}`);

// Save the secret key array to dev-wallet.json locally
const secretKeyArray = Array.from(kp.secretKey);
const filePath = path.join(__dirname, "dev-wallet.json");

fs.writeFileSync(filePath, JSON.stringify(secretKeyArray), {
  encoding: "utf8",
  mode: 0o600, // File permissions: owner read/write only
});

console.log(`\n🔐 Your wallet secret key has been saved at: ${filePath}`);
console.log("⚠️ Keep this file safe and never share it. If lost or exposed, you lose access to your wallet!");
