import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import IContractData from './IContractData';
import ISubscriptionContract from './ISubscriptionContract';

export default class SubscriptionContract implements ISubscriptionContract {
  private contractInstance: Contract;
  constructor(_web3: Web3, abi: AbiItem[], address: string) {
    this.contractInstance = new _web3.eth.Contract(abi, address);
  }

  async subscribe(from: string, value: number): Promise<void> {
    return this.contractInstance.methods.subscribe().send({ from, value });
  }

  async getBalance(from: string): Promise<number> {
    return this.contractInstance.methods.getBalance().call({ from });
  }

  async withdraw(from: string): Promise<void> {
    return this.contractInstance.methods.withdraw().send({ from });
  }

  async isSubscriptionValid(from: string): Promise<boolean> {
    return this.contractInstance.methods.isSubscriptionValid().call({ from });
  }

  async remove(from: string): Promise<void> {
    return this.contractInstance.methods.remove().send({ from });
  }

  async getAllContractData(from: string): Promise<IContractData> {
    const owner = await this.contractInstance.methods.owner().call({ from });
    const subscriptionValue = await this.contractInstance.methods.subscriptionBaseValue().call({ from });
    const subscriptionDuration = await this.contractInstance.methods.subscriptionDuration().call({ from });
    return {
      owner,
      subscriptionValue,
      subscriptionDuration,
    };
  }

  onSubscriptionSuccess(from: string, callback: (data: any) => void) {
    this.contractInstance.events.SubscriptionSuccess({ filter: { from } }).on('data', callback);
  }

  offSubscriptionSuccess(from: string, callback: (data: any) => void) {
    this.contractInstance.events.SubscriptionSuccess({ filter: { from } }).off('data', callback);
  }
}
