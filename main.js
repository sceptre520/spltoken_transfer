const cron = require('node-cron');
const web3 =  require("@solana/web3.js");
const splToken =  require("@solana/spl-token");

cron.schedule("*/30 * * * * *", function() {
    transfer()
})

const MASTER_WALLET_SECRET_KEY = new Uint8Array([143,183,80,190,75,103,41,213,64,202,44,237,95,219,27,122,104,87,99,121,17,56,61,32,1,221,222,215,51,49,81,35,99,62,20,36,202,239,102,194,239,59,43,45,89,1,160,168,144,86,83,2,187,151,3,243,169,121,237,184,190,60,34,176]);
const NETWORK = "devnet"
// const NETWORK = "testnet"
// const NETWORK = "mainnet-beta"
const TOKEN_PUB_KEY = "7fECXvBE6F3QeShzM4c2pxRHdVLvLJc2VcQ2Jk3bGGDc"
const TGT1_PUBKEY = "4duLizMMe8tU2oUpGmxA4PkVAXXKsTcz1xb9fu7ChyaV"
const TGT1_AMOUNT = 100

const transfer = async () => {
  console.log('--------------------------------------------------------------')
  var connection = new web3.Connection(web3.clusterApiUrl(NETWORK));
  var fromWallet = web3.Keypair.fromSecretKey(MASTER_WALLET_SECRET_KEY);
  var toWalletPub = new web3.PublicKey(TGT1_PUBKEY);
  var myMint = new web3.PublicKey(TOKEN_PUB_KEY);
  var myToken = new splToken.Token(
    connection,
    myMint,
    splToken.TOKEN_PROGRAM_ID,
    fromWallet
  );

  var fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
    fromWallet.publicKey
  )
  var toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
    toWalletPub
  )

  var transaction = new web3.Transaction()
    .add(
      splToken.Token.createTransferInstruction(
        splToken.TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        [],
        TGT1_AMOUNT
      )
    );
  
  var signature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromWallet]
  );
  console.log("SIGNATURE", signature);
  console.log("SUCCESS");
}