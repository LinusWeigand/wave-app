require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.export = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: process.env.ALCHEMY_API_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};