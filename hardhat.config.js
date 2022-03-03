/**
 * @type import('hardhat/config').HardhatUserConfig
 */
// deployed on 0xD747632e3A17B93Bc28cc652bA74CE29160853Cb
// deplyoed on 0x2B347Da7c80C7fC8b06F1C667fc0268354Dc53eC
// deplyoed on 0x55d10A1932EF0C9C3268b9ce96150b2b4859F7EC
// deployed on 0xdF1256923621B705194e5548d5F4b3A8ce58A927
require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')
require('dotenv').config({path:__dirname+'/.env'})

const infura_url = process.env.INFURA_URL
const metamask_private_key = process.env.METAMASK_PRIVATE_KEY
const etherscan_api_key = process.env.ETHERSCAN_API_KEY

module.exports = {
  solidity: "0.8.0",
  networks:{
    rinkeby:{
      url:infura_url,
      accounts: [`0x${metamask_private_key}`]
    }
  },
  etherscan:{
    apiKey: etherscan_api_key
  }
};
