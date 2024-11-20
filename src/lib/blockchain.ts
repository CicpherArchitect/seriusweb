import { ethers } from 'ethers';
import { EvidenceContract } from '../contracts/EvidenceContract';

const ETHEREUM_NODE_URL = process.env.ETHEREUM_NODE_URL || 'http://localhost:8545';
const CONTRACT_ADDRESS = process.env.EVIDENCE_CONTRACT_ADDRESS || '';
const PRIVATE_KEY = process.env.ETHEREUM_PRIVATE_KEY || '';

let provider: ethers.Provider;
let contract: ethers.Contract;
let signer: ethers.Wallet;

export const initializeBlockchain = async () => {
  try {
    provider = new ethers.JsonRpcProvider(ETHEREUM_NODE_URL);
    signer = new ethers.Wallet(PRIVATE_KEY, provider);
    contract = new ethers.Contract(CONTRACT_ADDRESS, EvidenceContract.abi, signer);
  } catch (error) {
    console.error('Failed to initialize blockchain connection:', error);
    throw error;
  }
};

export const recordEvidence = async (
  evidenceHash: string,
  metadata: string
): Promise<string> => {
  try {
    const tx = await contract.recordEvidence(evidenceHash, metadata);
    const receipt = await tx.wait();
    return receipt.transactionHash;
  } catch (error) {
    console.error('Failed to record evidence:', error);
    throw error;
  }
};

export const verifyEvidence = async (
  evidenceHash: string
): Promise<{ verified: boolean; timestamp: number; blockNumber: number }> => {
  try {
    const result = await contract.verifyEvidence(evidenceHash);
    return {
      verified: result.exists,
      timestamp: result.timestamp.toNumber(),
      blockNumber: result.blockNumber.toNumber()
    };
  } catch (error) {
    console.error('Failed to verify evidence:', error);
    throw error;
  }
};