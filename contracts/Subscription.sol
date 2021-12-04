// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

contract Subscription {
    struct Subscriber {
        bool subscribed;
        uint256 payedAmount;
        uint256 subscribedAt;
    }

    address private owner;
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

    modifier notSubscribed() {
        require(
            subscribersList[msg.sender].subscribed == false,
            "Already Subscribed"
        );
        _;
    }

    function subscribe() external payable notSubscribed {
        require(msg.value == subscriptionBaseValue, "Insufficient funds");
        Subscriber memory newSubscriber = Subscriber(
            true,
            msg.value,
            block.timestamp
        );
        subscribersList[msg.sender] = newSubscriber;
        // return newSubscriber.subscribedAt; --> Should Fire an event here.
    }

    function getBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function amISubscribed() external returns (bool) {
        if(block.timestamp > subscribersList[msg.sender].subscribedAt + subscriptionDuration) {
            subscribersList[msg.sender].subscribed = false;
        }
        return subscribersList[msg.sender].subscribed;
    }

    function remove() external onlyOwner {
        selfdestruct(payable(owner));
    }

    function withdraw() external onlyOwner {
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }
}
