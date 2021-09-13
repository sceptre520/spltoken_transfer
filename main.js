const cron = require('node-cron');
const web3 =  require("@solana/web3.js");
const splToken =  require("@solana/spl-token");


const MASTER_WALLET_SECRET_KEY = new Uint8Array([53,148,141,100,246,232,104,140,58,13,31,238,37,162,102,57,7,167,189,96,107,141,179,175,243,162,109,175,223,15,60,227,102,252,240,2,32,225,103,200,75,194,77,217,120,204,30,182,50,237,141,3,193,151,150,200,203,5,81,154,11,191,228,151]);
const NETWORK = "devnet"
// const NETWORK = "testnet"
// const NETWORK = "mainnet-beta"
const TOKEN_PUB_KEY = "3XqUEgQuKk37jhnvL3zBpzpAU4ZGM72CAdBi6H1NS3Qz"
const TGT1_PUBKEY = "E3teWggB4m6TXLzEcEJd7XjEnZB8t5sJaqCq94uU2pnU"
const TGT1_AMOUNT = 50000
const TGT2_PUBKEY = "AAsxTQ8q9KQfuvRDbD9tP5MrMzdAsC4n8x3n3Dc84UTt"
const TGT2_AMOUNT = 100000
const TGT3_PUBKEY = "CTtdDqVntRM1igfGTK9eXMBDFM9ho4XQpjLSsrusWQRc"
const TGT3_AMOUNT = 30000
const transfer = async (tgt_pub, tgt_amount) => {
  console.log('--------------------------------------------------------------')
  var connection = new web3.Connection(web3.clusterApiUrl(NETWORK));
  var fromWallet = web3.Keypair.fromSecretKey(MASTER_WALLET_SECRET_KEY);
  var toWalletPub = new web3.PublicKey(tgt_pub);
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
        tgt_amount
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

cron.schedule("0 */1 * * * *", function() {
  transfer(TGT1_PUBKEY, TGT1_AMOUNT)
  transfer(TGT2_PUBKEY, TGT2_AMOUNT)
  transfer(TGT3_PUBKEY, TGT3_AMOUNT)
})