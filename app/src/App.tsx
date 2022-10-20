import { useState, useEffect } from "react";
import InitButton from "./components/InitButton/InitButton";
import {
  hasUserLikedBefore,
  isDuplicatePost,
} from "./services/twitter.service";
import "./App.css";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { Program, AnchorProvider, web3, Idl } from "@project-serum/anchor";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  useWallet,
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import idl from "./idl.json";
import kp from "./keypair.json";
import InputBar from "./components/InputBar/InputBar";
import { Tweet } from "./interfaces/tweet";
import TweetGrid from "./components/TweetGrid/TweetGrid";
import { getBalance } from "./services/web3.service";
require("@solana/wallet-adapter-react-ui/styles.css");

const wallets = [new PhantomWalletAdapter()];
const { SystemProgram } = web3;

const arr: number[] = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);

const programId = new PublicKey(idl.metadata.address);
const network = WalletAdapterNetwork.Devnet;
const endpoint = clusterApiUrl(network);

function App(): JSX.Element {
  const [inputValue, setInputValue] = useState<string>("");
  const [tweetList, setTweetList] = useState<Tweet[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const wallet = useWallet();

  useEffect(() => {
    if ((wallet as any).connected) {
      console.log("here");
      getTweetList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  const getProvider = (): AnchorProvider => {
    const connection = new Connection(endpoint, "processed");
    const provider = new AnchorProvider(connection, wallet as any, {
      preflightCommitment: "processed",
    });
    return provider;
  };

  const getProgram = async (): Promise<Program<Idl>> => {
    const idl = await Program.fetchIdl(programId, getProvider());
    return new Program(idl as Idl, programId, getProvider());
  };

  const createTweetAccount = async (): Promise<void> => {
    try {
      const provider = getProvider();
      const program = await getProgram();

      await program.methods
        .startStuffOff()
        .accounts({
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([baseAccount])
        .rpc();

      await getTweetList();
    } catch (error) {
      console.log("Error creating BaseAccount account:", error);
    }
  };

  const getTweetList = async (): Promise<void> => {
    setLoading(true);
    try {
      const program = await getProgram();
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      setTweetList(account.tweetList as Tweet[]);
    } catch (error) {
      console.error("Could not get tweets");
      setTweetList(null);
    }
    setLoading(false);
  };

  const sendTweet = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (
      !/.*twitter.*\/status\/.*/.test(inputValue) ||
      inputValue.length === 0
    ) {
      toast.error("Please provide a valid Tweet Link!", {
        position: "bottom-right",
        theme: "colored",
      });
      return;
    }

    if (isDuplicatePost(inputValue, tweetList)) {
      toast("Duplicate post!", {
        position: "bottom-right",
      });
      return;
    }

    try {
      const provider = getProvider();
      const program = await getProgram();
      setInputValue("");

      await program.methods
        .addTweet(inputValue)
        .accounts({
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        })
        .rpc();

      toast("Linked Tweet successfully", {
        position: "bottom-right",
      });

      getTweetList();
    } catch (error) {
      console.log(error);
    }
  };

  const likeTweet = async (tweetUrl: string): Promise<void> => {
    try {
      const provider = getProvider();
      const hasUserLikedAlready = hasUserLikedBefore(
        provider.wallet.publicKey.toString(),
        tweetUrl,
        tweetList
      );

      if (hasUserLikedAlready) {
        toast("You liked that post already!", {
          position: "bottom-right",
        });
        return;
      }

      const program = await getProgram();

      await program.methods
        .likeTweet(tweetUrl)
        .accounts({
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        })
        .rpc();

      toast("Liked successfully!", {
        position: "bottom-right",
      });

      getTweetList();
    } catch (error) {
      console.log(error);
    }
  };

  const onHandleSend = async (toAddress: PublicKey) => {
    try {
      const connection = new Connection(endpoint, "processed");
      const provider = getProvider();

      // if (!fromWallet) throw new WalletNotConnectedError();
      getBalance(connection, provider.wallet.publicKey, "beforetest");
      const txn = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: provider.wallet.publicKey,
          toPubkey: toAddress,
          lamports: 0.1 * LAMPORTS_PER_SOL,
        })
      );

      const signature = await wallet.sendTransaction(txn, connection);

      const latestBlockHash = await connection.getLatestBlockhash();

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: signature,
      });

      getBalance(connection, provider.wallet.publicKey, "test");
    } catch (error) {
      console.log(error);
    }
  };

  const renderConnectedContainer = () => {
    if (tweetList === null && !loading) {
      return <InitButton onClickHandler={createTweetAccount} />;
    } else {
      return (
        <div className="connected-container">
          <InputBar
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSubmit={(event) => sendTweet(event)}
          />
          <TweetGrid
            list={tweetList}
            handleSend={(address) => onHandleSend(address)}
            handleClick={(tweetLink) => likeTweet(tweetLink)}
          />
        </div>
      );
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <div className="header-wallet-btn">
            <WalletMultiButton />
          </div>
          <p className="header">🏛 Memorable Solana Tweets</p>
          <p className="sub-text">
            A devnet monument to preserve memorable tweets of Solana community
          </p>
          {(wallet as any).connected && renderConnectedContainer()}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

const AppWithProvider = () => (
  <ConnectionProvider endpoint={endpoint}>
    <WalletProvider wallets={wallets} autoConnect>
      <WalletModalProvider>
        <App />
      </WalletModalProvider>
    </WalletProvider>
  </ConnectionProvider>
);

export default AppWithProvider;
