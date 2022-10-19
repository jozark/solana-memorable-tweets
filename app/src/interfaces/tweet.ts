import { PublicKey } from "@solana/web3.js";

export interface Tweet {
  tweetLink: string;
  userAddress: PublicKey;
}
