// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IChronoStampFactory {
    // Events
    event BadgeCreated(address indexed badgeAddress);

    // Functions
    function createNewBadge(
        string memory baseTokenURI,
        address trustedSigner
    ) external returns (address);

    function getTotalBadges() external view returns (uint256);

    function getBadgesPaginated(uint256 offset, uint256 limit) external view returns (address[] memory);
}