import IContractData from './IContractData';

export default interface ISubscriptionContract {
  subscribe: (from: string, value: number) => Promise<void>;
  getBalance: (from: string) => Promise<number>;
  withdraw: (from: string) => Promise<void>;
  renew: (from: string, value: number) => Promise<void>;
  amISubscribed: (from: string) => Promise<boolean>;
  remove: (from: string) => Promise<void>;
  getAllContractData: (from: string) => Promise<IContractData>;
}
