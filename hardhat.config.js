require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.export = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/1vQY62g6fT4VMUAv6x2psIVZvaGWIFrO",
      accounts: ["0xddb21e4575a175509b890d4b65cfac4e5e031034c4925e0fb5428dee2b717bbe"],
    },
  },
};