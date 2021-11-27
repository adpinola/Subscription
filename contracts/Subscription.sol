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
    mapping(address => Subscriber) subscribersList;

    constructor(uint256 _subscriptionBaseValue) {
        subscriptionBaseValue = _subscriptionBaseValue;
        owner = msg.sender;
        subscribersList[owner] = Subscriber(true, 0, block.timestamp);
    }

    function subscribe() external payable {
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
        require(msg.sender == owner, "Only the owner can call this method");
        return address(this).balance;
    }

    function withdraw() external {
        require(msg.sender == owner);
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function remove() external {
        require(msg.sender == owner);
        selfdestruct(payable(owner));
    }
}
