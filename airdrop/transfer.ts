import {
  Transaction,
  SystemProgram,
  Connection,
  Keypair,
  sendAndConfirmTransaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const from = Keypair.fromSecretKey(new Uint8Array(wallet));

// Turbin3 recipient wallet address
const to = new PublicKey("4gTWiPwC7AHdsu6BtySRd9KvEZVJmhQJRkB9rNH2P1Kj");

const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    const balance = await connection.getBalance(from.publicKey);
    console.log(`Current balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: balance,
      })
    );

    transaction.recentBlockhash = (await connection.getLatestBlockhash("confirmed")).blockhash;
    transaction.feePayer = from.publicKey;

    // Calculate fee for the current transaction message
    const fee = (await connection.getFeeForMessage(transaction.compileMessage(), "confirmed")).value || 0;

    const amountToSend = balance - fee;

    if (amountToSend <= 0) {
      throw new Error("Insufficient balance to cover transaction fee");
    }

    // Replace previous transfer instruction with accurate lamports to send
    transaction.instructions.pop();
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: to,
        lamports: amountToSend,
      })
    );

    // Sign, send and confirm transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, [from]);

    console.log(`Success! Check your transaction at: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
  } catch (e) {
    console.error(`Error during transfer: ${e}`);
  }
})();
