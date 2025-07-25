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

    // Constructor
    /**
     * @dev Initializes the contract with a base URI and a trusted signer.
     * @param _name The name of NFT collection.
     * @param _symbol The symbol of NFT collection.
     * @param _initialOwner The initial owner of the contract.
     * @param _trustedSigner The address of the trusted signer.
     * @param _baseTokenURI The base URI for the token metadata.
     */
     constructor(
        string memory _name,
        string memory _symbol,
        address _initialOwner,
        address _trustedSigner,
        string memory _baseTokenURI
    ) ERC721(_name, _symbol) Ownable(_initialOwner) {
        trustedSigner = _trustedSigner;
        baseTokenURI = _baseTokenURI;
        nextTokenId = 1; // Start token IDs from 1
    }

    // -------NFT Functions-------

    /**
     * @dev return the token URI for a given token ID.
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        // Ensure the token exists
        _requireOwned(tokenId);
        // Return the full token URI
        return string(abi.encodePacked(baseTokenURI, "/", _toString(tokenId)));
    }
}