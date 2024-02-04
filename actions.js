var fs = require('fs');
var bs58 = require('bs58');

const {
  Keypair,
  PublicKey,
  Connection,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} = require('@solana/web3.js');

const generateKey = async () => {
  const keyPair = Keypair.generate();

  fs.writeFile(
    'wallet.json',
    JSON.stringify(
      {
        publicKey: keyPair.publicKey.toString(),
        privateKey: bs58.encode(keyPair.secretKey),
        balance: 0,
      },
      null,
      2
    ),
    'utf8',
    () => {}
  );

  console.log('Your wallet has been created');
};

const getUserFromSecretKey = async () => {
  const data = JSON.parse(fs.readFileSync('./wallet.json'));
  const user = Keypair.fromSecretKey(bs58.decode(data.privateKey));

  return user;
};

const getAirdrop = async (amount) => {
  const connection = new Connection('https://api.testnet.solana.com');

  const feePayer = await getUserFromSecretKey();

  let txhash = await connection.requestAirdrop(
    feePayer.publicKey,
    amount * LAMPORTS_PER_SOL
  );

  await connection.confirmTransaction(txhash);

  console.log('Transaction hash is: ', txhash);
};

const getBalance = async () => {
  const connection = new Connection('https://api.testnet.solana.com');

  const feePayer = await getUserFromSecretKey();
  let balance = await connection.getBalance(feePayer.publicKey);

  console.log('Your balance is : ', balance / LAMPORTS_PER_SOL);
};

const transfer = async (address, amount) => {
  const user = await getUserFromSecretKey();

  const connection = new Connection('https://api.testnet.solana.com');

  let tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: user.publicKey,
      toPubkey: new PublicKey(address),
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );

  const signature = await sendAndConfirmTransaction(connection, tx, [user]);

  console.log('Signature: ', signature);
};

//transfer('3mFiiouedBZh8Mczspkby1rBiVfzYg8MYob9hyaYWY5R', 1);
module.exports = {
  generateKey,
  getAirdrop,
  getBalance,
  transfer,
};
