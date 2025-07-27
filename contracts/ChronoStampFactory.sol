// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ChronoStamp.sol";
import "./interfaces/IChronoStampFactory.sol";

contract ChronoStampFactory is IChronoStampFactory {
    address public owner;
    address[] public deployedBadges;

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

    // Add the new badge to the deployed badges array
    deployedBadges.push(address(badge));

    // emit event to notify frontend
    emit BadgeCreated(address(badge));

    // Return the address of the newly created badge contract
    return address(badge);
    }

    /**
     * @dev Returns the total number of deployed badge contracts
     */
    function getTotalBadges() external view returns (uint256) {
        return deployedBadges.length;
    }

    /**
     * @dev Returns a paginated list of deployed badge contract addresses
     * @param offset Starting index in the deployedBadges array
     * @param limit Maximum number of addresses to return
     */
    function getBadgesPaginated(uint256 offset, uint256 limit) external view returns (address[] memory) {
        uint256 total = deployedBadges.length;
        if (offset >= total) {
            return new address[](0);
        }
        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }
        uint256 size = end - offset;
        address[] memory list = new address[](size);
        for (uint256 i = 0; i < size; i++) {
            list[i] = deployedBadges[offset + i];
        }
        return list;
    }
}