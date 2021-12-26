import IContractData from './IContractData';
import ISubscriberData from './ISubscriberData';

export default interface ISubscriptionContract {
  subscribe: (from: string, value: number) => Promise<void>;
  getBalance: (from: string) => Promise<number>;
  withdraw: (from: string) => Promise<void>;
  remove: (from: string) => Promise<void>;
  getSubscriptionData: (from: string) => Promise<ISubscriberData>;
  getDataOfSubscriber: (from: string, of: string) => Promise<ISubscriberData>;
  getAllSubscribers: (from: string) => Promise<Array<string>>;
  getAllContractData: (from: string) => Promise<IContractData>;
  onSubscriptionSuccess: (from: string, callback: (data: any) => void) => void;
  offSubscriptionSuccess: (from: string, callback: (data: any) => void) => void;
}
