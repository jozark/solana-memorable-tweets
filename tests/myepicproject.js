const anchor = require("@project-serum/anchor");

const { SystemProgram } = anchor.web3;

const main = async () => {
  console.log("🚀 Starting test...");

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myepicproject;

  const baseAccount = anchor.web3.Keypair.generate();

  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("📝 Your transaction signature", tx);

  // Fetch data from the account.
  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("👀 Tweet Count", account.totalTweets.toString());

  await program.rpc.addTweet(
    "https://twitter.com/art_zilla/status/1371901607810633736",
    {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    }
  );

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("👀 Tweet Count", account.totalTweets.toString());
  console.log("Tweetlist", account.tweetList);

  await program.rpc.likeTweet(
    "https://twitter.com/art_zilla/status/1371901607810633736",
    {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    }
  );
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("Tweetlist", account.tweetList);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
