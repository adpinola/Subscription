import ISubscriberData from './ISubscriberData';

export default interface IContractData {
  owner: string;
  subscriptionValue: number;
  subscriptionDuration: number;
  subscribersList: Array<ISubscriberData>;
}
