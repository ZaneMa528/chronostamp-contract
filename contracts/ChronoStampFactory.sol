// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ChronoStamp.sol";

contract ChronoStampFactory {
    address public owner;

    // To notify frontend when a new badge is created
    event BadgeCreated(address indexed badgeAddress);

    constructor() {
        owner = msg.sender;
    }

    /// @notice Creates a new ChronoStamp contract instance
    /// @param baseTokenURI IPFS/URL prefix
    /// @param trustedSigner Public key address of the Oracle
    /// @return The address of the newly deployed ChronoStamp contract
    function createNewBadge(
        string memory baseTokenURI,
        address trustedSigner
    ) public returns (address) {
    require(msg.sender == owner, "Only the owner can create new badges");
    require(bytes(baseTokenURI).length > 0, "Base token URI cannot be empty");
    require(trustedSigner != address(0), "Trusted signer address cannot be zero");

    // Deploy a new ChronoStamp contract
    ChronoStamp badge = new ChronoStamp(
        "ChronoStamp Badge",
        "CSB",
        msg.sender, // Initial owner is the factory creator
        trustedSigner,
        baseTokenURI
    );

    // emit event to notify frontend
    emit BadgeCreated(address(badge));

    // TO DO: let Person D manage the badge array

    // Return the address of the newly created badge contract
    return address(badge);
    }
}