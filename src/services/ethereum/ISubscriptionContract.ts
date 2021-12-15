import IContractData from './IContractData';

export default interface ISubscriptionContract {
  subscribe: (from: string, value: number) => Promise<void>;
  getBalance: (from: string) => Promise<number>;
  withdraw: (from: string) => Promise<void>;
  isSubscriptionValid: (from: string) => Promise<boolean>;
  remove: (from: string) => Promise<void>;
  getAllContractData: (from: string) => Promise<IContractData>;
  onSubscriptionSuccess: (from: string, callback: (data: any) => void) => void;
}
