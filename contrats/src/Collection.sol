// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Card.sol";

contract Collection {
  string public name;
  uint public cardCount;
  uint private idCollection;
  Card[] private setCard;
  
  constructor(string memory _name, uint _cardCount, uint _idCollection) {
    name = _name;
    cardCount = _cardCount;
    idCollection = _idCollection;
  }

  function createCard(string memory _cardName, string memory _imageUrl, uint cardId) public returns (Card) {
    require(setCard.length < cardCount, "Le nombre de cartes a atteint sa limite."); 
    Card newCard = new Card(_cardName, _imageUrl, cardId);
    setCard.push(newCard);
    return (newCard);
  }

  function getCardInfo(Card _card) public view returns (string memory, string memory){
    return (_card.getNameCard(), _card.getImageURI());
  }

  function getCards() public view returns (Card[] memory) {
    return setCard;
  }

  function getName() public view returns (string memory) {
    return name;
  }

  function getCardCount() public view returns (uint) {
    return cardCount;
  }

  function getId() public view returns (uint) {
    return idCollection;
  }
  
}
