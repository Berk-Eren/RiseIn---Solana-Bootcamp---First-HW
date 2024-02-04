const {
  generateKey,
  getAirdrop,
  getBalance,
  transfer,
} = require('./actions.js');

const commandLine = async () => {
  if (process.argv[2] == 'new') {
    await generateKey();
  } else if (process.argv[2] == 'airdrop') {
    await getAirdrop(Number(process.argv[2]));
  } else if (process.argv[2] == 'balance') {
    await getBalance();
  } else if (process.argv[2] == 'transfer') {
    await transfer(process.argv[3], Number(process.argv[4]));
  }
};

commandLine();
