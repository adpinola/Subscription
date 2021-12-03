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
    mapping(address => Subscriber) private subscribersList;

    constructor(uint256 _subscriptionBaseValue) {
        subscriptionBaseValue = _subscriptionBaseValue;
        owner = msg.sender;
        subscribersList[owner] = Subscriber(true, 0, block.timestamp);
    }

    function subscribe() external payable {
        require(
            subscribersList[msg.sender].subscribed == false,
            "Already Subscribed"
        );
        require(msg.value == subscriptionBaseValue, "Insufficient funds");
        Subscriber memory newSubscriber = Subscriber(
            true,
            msg.value,
            block.timestamp
        );
        subscribersList[msg.sender] = newSubscriber;
        // return newSubscriber.subscribedAt; --> Should Fire an event here.
    }

    function getBalance() external view returns (uint256) {
        require(msg.sender == owner, "Not Owner");
        return address(this).balance;
    }

    function withdraw() external {
        require(msg.sender == owner, "Not Owner");
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function remove() external {
        require(msg.sender == owner, "Not Owner");
        selfdestruct(payable(owner));
    }
}
