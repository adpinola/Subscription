import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

export interface ISubscriptionContract {
  subscribe: (from: string, value: number) => Promise<void>;
  getBalance: (from: string) => Promise<number>;
  withdraw: (from: string) => Promise<void>;
  renew: (from: string, value: number) => Promise<void>;
  amISubscribed: (from: string) => Promise<boolean>;
  remove: (from: string) => Promise<void>;
  getAllContractData: (from: string) => Promise<IContractData>;
}

export interface ISubscriberData {
  isSubscribed: boolean;
  payedAmount: number;
  subscribedAt: number;
}

export interface IContractData {
  owner: string;
  subscriptionValue: number;
  subscriptionDuration: number;
  subscribersList: Array<ISubscriberData>;
}

export class SubscriptionContract implements ISubscriptionContract {
  private contractInstance: Contract;
  constructor(_web3: Web3, abi: AbiItem[], address: string) {
    this.contractInstance = new _web3.eth.Contract(abi, address);
  }

  async subscribe(from: string, value: number) {
    return this.contractInstance.methods.subscribe().send({ from, value });
  }

  async getBalance(from: string) {
    return this.contractInstance.methods.getBalance().call({ from });
  }

  async withdraw(from: string) {
    return this.contractInstance.methods.withdraw().send({ from });
  }

  async renew(from: string, value: number) {
    return this.contractInstance.methods.subscribe().renew({ from, value });
  }

  async amISubscribed(from: string) {
    return this.contractInstance.methods.amISubscribed().call({ from });
  }

  async remove(from: string) {
    return this.contractInstance.methods.remove().send({ from });
  }

  async getAllContractData(from: string) {
    const owner = '';
    // await this.contractInstance.methods.owner().call({ from });
    const subscriptionValue: number = await this.contractInstance.methods.subscriptionBaseValue().call({ from });
    const subscriptionDuration: number = await this.contractInstance.methods.subscriptionDuration().call({ from });
    const subscribersList: Array<ISubscriberData> = []; // await this.contractInstance.methods.subscribersList().call({ from });
    return {
      owner,
      subscriptionValue,
      subscriptionDuration,
      subscribersList,
    };
  }
}
