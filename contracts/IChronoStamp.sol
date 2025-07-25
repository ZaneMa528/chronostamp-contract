// IChronoStamp.sol
interface IChronoStamp {
    function claim(bytes memory signature, bytes32 nonce) external;
    function tokenURI(uint256 tokenId) external view returns (string memory);
}

// IChronoStampFactory.sol
interface IChronoStampFactory {
    function createNewBadge(string memory baseTokenURI, address trustedSigner)
        external returns (address);
    function getTotalBadges() external view returns (uint256);
}