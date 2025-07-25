// SPDX-License-Identifier: No License
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

// IChronoStamp.sol
import "./IChronoStamp.sol";

contract ChronoStamp is ERC721, Ownable, IChronoStamp {
    
    // State variables
    address public immutable trustedSigner;

    // Base URI for token metadata
    string public baseTokenURI;

    // NFT counter
    uint256 private nextTokenId;

    // Used to prevent replay attacks
    mapping(bytes32 => bool) private usedNonces;

    // Events
    event BadgeClaimed(address indexed recipient, uint256 indexed tokenId);

}