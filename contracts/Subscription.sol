// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

contract Subscription {
    struct Subscriber {
        bool subscribed;
        uint256 payedAmount;
        uint256 subscribedAt;
    }

    event SubscriptionSuccess(address indexed from, uint256 subscribedAt);

    address public owner;
    uint256 public subscriptionBaseValue;
    uint256 public subscriptionDuration;
    mapping(address => Subscriber) private subscribersList;

    constructor(uint256 _baseValue, uint256 _durationInMinutes) {
        subscriptionBaseValue = _baseValue;
        subscriptionDuration = _durationInMinutes * 1 minutes;
        owner = msg.sender;
        subscribersList[owner] = Subscriber(true, 0, block.timestamp);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
        _;
    }

    modifier exactAmount() {
        require(msg.value == subscriptionBaseValue, "Insufficient funds");
        _;
    }

    function isSubscriptionValid(address subscriberAddress) private view returns (bool) {
        bool isSubscribed = subscribersList[subscriberAddress].subscribed == true;
        uint256 limitDate = subscribersList[subscriberAddress].subscribedAt + subscriptionDuration;
        return isSubscribed && block.timestamp <= limitDate;
    }

    function subscribe() external payable exactAmount {
        address target = msg.sender;
        if (subscribersList[target].subscribed == true) {
            require(!isSubscriptionValid(target), "Subscription is still active");
            subscribersList[target].payedAmount += msg.value;
            subscribersList[target].subscribedAt = block.timestamp;
        } else {
            Subscriber memory newSubscriber = Subscriber(true, msg.value, block.timestamp);
            subscribersList[target] = newSubscriber;
        }
        emit SubscriptionSuccess(target, block.timestamp);
    }

    function getSubscriberData(address subscriberAddress) private view returns (Subscriber memory data) {
        bool isSubscribed = isSubscriptionValid(subscriberAddress);
        uint256 at = subscribersList[subscriberAddress].subscribedAt;
        uint256 payedAmount = subscribersList[subscriberAddress].payedAmount;
        data = Subscriber(isSubscribed, payedAmount, at);
        return data;
    }

    function getDataOfSubscriber(address subscriberAddress) external view onlyOwner returns (Subscriber memory data) {
        return getSubscriberData(subscriberAddress);
    }

    function getSubscriptionData() external view returns (Subscriber memory data) {
        return getSubscriberData(msg.sender);
    }
    
    function getBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function remove() external onlyOwner {
        selfdestruct(payable(owner));
    }

    function withdraw() external onlyOwner {
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

}
