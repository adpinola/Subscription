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

    function isSubscriptionValid() public view returns (bool) {
        bool isSubscribed = subscribersList[msg.sender].subscribed == true;
        uint256 limitDate = subscribersList[msg.sender].subscribedAt + subscriptionDuration;
        return isSubscribed && block.timestamp <= limitDate;
    }

    function subscribe() external payable exactAmount {
        if (subscribersList[msg.sender].subscribed == true) {
            require(!isSubscriptionValid(), "Subscription is still active");
            subscribersList[msg.sender].payedAmount += msg.value;
            subscribersList[msg.sender].subscribedAt = block.timestamp;
        } else {
            Subscriber memory newSubscriber = Subscriber(true, msg.value, block.timestamp);
            subscribersList[msg.sender] = newSubscriber;
        }
        emit SubscriptionSuccess(msg.sender, block.timestamp);
    }

    function getBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function getSubscriberData() external view returns (Subscriber memory data) {
        bool isSubscribed = isSubscriptionValid();
        uint256 at = subscribersList[msg.sender].subscribedAt;
        uint256 payedAmount = subscribersList[msg.sender].payedAmount;
        data = Subscriber(isSubscribed, payedAmount, at);
        return data;
    }

    function remove() external onlyOwner {
        selfdestruct(payable(owner));
    }

    function withdraw() external onlyOwner {
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }
}
