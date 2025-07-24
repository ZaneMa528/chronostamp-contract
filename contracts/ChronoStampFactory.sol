// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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

        // TODO: Implement the logic to deploy a new ChronoStamp contract
        // and return its address. This is a placeholder for now.
        revert("Not yet implemented");
    }
}