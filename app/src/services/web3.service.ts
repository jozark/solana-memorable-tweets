import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";

export const getBalance = async (
  connection: Connection,
  wallet: PublicKey,
  name: string
) => {
  const balance = await connection.getBalance(wallet);
  console.log(`${name} has ${balance}`);
};
