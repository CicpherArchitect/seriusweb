import Web3 from 'web3';

const web3 = new Web3(process.env.ETHEREUM_NODE_URL || 'http://localhost:8545');

export const anchorToBlockchain = async (hash: string): Promise<string> => {
  try {
    const account = web3.eth.accounts.privateKeyToAccount(
      process.env.ETHEREUM_PRIVATE_KEY || 'your-private-key'
    );
    
    const data = web3.utils.asciiToHex(hash);
    const tx = {
      from: account.address,
      to: process.env.SMART_CONTRACT_ADDRESS,
      data,
      gas: 100000
    };
    
    const signedTx = await account.signTransaction(tx);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction!);
    
    return receipt.transactionHash;
  } catch (error) {
    console.error('Blockchain anchoring failed:', error);
    throw error;
  }
};