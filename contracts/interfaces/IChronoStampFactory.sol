// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IChronoStampFactory {
    function createNewBadge(
        string memory baseTokenURI,
        address trustedSigner
    ) external returns (address);
}