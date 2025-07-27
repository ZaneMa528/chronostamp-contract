// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// IChronoStamp.sol
interface IChronoStamp {
    function claim(bytes memory signature, bytes32 nonce) external;
    function tokenURI(uint256 tokenId) external view returns (string memory);
}
