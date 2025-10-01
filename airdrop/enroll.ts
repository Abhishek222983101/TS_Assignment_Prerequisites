import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { IDL, Turbin3Prereq } from "./programs/Turbin3_prereq";
import wallet from "./dev-wallet.json";
import prompt from "prompt-sync";


const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection("https://api.devnet.solana.com");


const githubHandle = prompt()("Enter your GitHub handle: ");
const github = Buffer.from(githubHandle, "utf8");
const programId = new PublicKey(IDL.address);

const provider = new AnchorProvider(connection, new Wallet(keypair), {
  commitment: "confirmed",
});

const program = new Program(IDL as Turbin3Prereq, programId, provider);

(async () => {
  try {
    // Derive PDA: seeds ['prereqs', signer public key]
    const [prereqPda] = await PublicKey.findProgramAddress(
      [Buffer.from("prereqs"), keypair.publicKey.toBuffer()],
      programId
    );

    // Call program's complete method with args and accounts
    const txhash = await program.methods
      .complete([...github])
      .accounts({
        signer: keypair.publicKey,
        prereq: prereqPda,
        system_program: SystemProgram.programId,
      })
      .signers([keypair])
      .rpc();

    console.log(
      `✅ Enrollment success! TX: https://explorer.solana.com/tx/${txhash}?cluster=devnet`
    );
    console.log(`PDA account: ${prereqPda.toBase58()}`);
  } catch (e) {
    console.error(`❌ Enrollment error: ${e}`);
  }
})();
