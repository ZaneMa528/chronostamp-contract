// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

// IChronoStamp.sol
import "./interfaces/IChronoStamp.sol";

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
    function tokenURI(uint256 tokenId) public view override(ERC721, IChronoStamp) returns (string memory) {
        // Ensure the token exists
        _requireOwned(tokenId);
        // Return the full token URI
        return string(abi.encodePacked(baseTokenURI, "/", _toString(tokenId)));
    }

    // -------Claim Function-------
    /**
     * @dev Allows a user to claim a badge by providing a valid signature and nonce.
     * @param signature The signature from the trusted signer.
     * @param nonce A unique nonce to prevent replay attacks.
     */
    function claim(bytes memory signature, bytes32 nonce) external override {
        // Ensure the nonce has not been used
        require(!usedNonces[nonce], "ChronoStamp: Nonce already used");

        // Flag the nonce as used
        usedNonces[nonce] = true;

        // build the message hash
        // Format: keccak256(abi.encodePacked(msg.sender, nonce))
        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, nonce));

        // Add the Ethereum signed message prefix to the message hash
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        // Recover the signer address using the prefixed message hash
        address signer = ECDSA.recover(ethSignedMessageHash, signature);

        // Ensure the signer is the trusted signer
        require(signer == trustedSigner, "ChronoStamp: Invalid signature");

        // Mint the new badge (NFT)
        uint256 tokenIdToMint = nextTokenId;
        _safeMint(msg.sender, tokenIdToMint);

        // Increment the token ID for the next mint and emit event
        nextTokenId++;
        emit BadgeClaimed(msg.sender, tokenIdToMint);
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        // Convert uint256 to string using OpenZeppelin's Strings library
        return Strings.toString(value);
    }
    
}
