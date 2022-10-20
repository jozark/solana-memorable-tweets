import { Connection, PublicKey } from "@solana/web3.js";

export const getBalance = async (
  connection: Connection,
  wallet: PublicKey,
  name: string
) => {
  const balance = await connection.getBalance(wallet);
  console.log(`${name} has ${balance}`);
};
