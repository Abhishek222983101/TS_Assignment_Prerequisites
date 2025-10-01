import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    // Show public wallet address
    console.log(`Requesting airdrop for wallet: ${keypair.publicKey.toBase58()}`);

    // Check balance before airdrop
    const beforeBalance = await connection.getBalance(keypair.publicKey);
    console.log(`Balance before airdrop: ${beforeBalance / LAMPORTS_PER_SOL} SOL`);

    // Request 2 SOL airdrop
    const txhash = await connection.requestAirdrop(keypair.publicKey, 2 * LAMPORTS_PER_SOL);

    // Confirm the transaction finalized
    await connection.confirmTransaction(txhash, "confirmed");

    // Check balance after airdrop
    const afterBalance = await connection.getBalance(keypair.publicKey);
    console.log(`Airdrop successful! Transaction: https://explorer.solana.com/tx/${txhash}?cluster=devnet`);
    console.log(`Balance after airdrop: ${afterBalance / LAMPORTS_PER_SOL} SOL`);
  } catch (e) {
    console.error(`Airdrop error: ${e}`);
  }
})();
