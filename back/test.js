const { ethers } = require('ethers');
const fs = require('fs')
let mainContractABI = []
let cardContractABI = []
const blockchainProvider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
try {
  mainContractABI = fs.readFileSync("../frontend/src/abis/Main.json", 'utf8');
} catch (err) {
  console.error('Erreur lors de la lecture du fichier :', err);
}

try {
  cardContractABI = fs.readFileSync("../frontend/src/abis/Card.json", 'utf8');
} catch (err) {
  console.error('Erreur lors de la lecture du fichier :', err);
}

privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
primaryAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

async function initiateNewCollection(collectionName, numCards, privateKey) {  
  try {
    const wallet = new ethers.Wallet(privateKey, blockchainProvider);
    const contract = new ethers.Contract(contractAddress, mainContractABI, wallet);

    // Appel de la fonction createCollection du contrat Main
    const transaction = await contract.createCollection(collectionName, numCards);
    await transaction.wait();

    console.log('Collection créée avec succès!');
  } catch (error) {
    console.error('Erreur lors de la création de la collection :', error);
  }
}

async function retrieveCollections(privateKey) {
  
  const wallet = new ethers.Wallet(privateKey, blockchainProvider); 
  const contract = new ethers.Contract(contractAddress, mainContractABI, wallet);

  try {
    const collections = await contract.getAllCollections();
     collections.forEach(async function(collection){
      const collec = await contract.getCollection(collection);
      console.log("L'id est ", parseInt(collec[0], 10))
      console.log("Le nom : ", collec[1])
      console.log("Le nombre de carte:", parseInt(collec[2], 10))
    });
  } catch (error) {
    console.error('Erreur :', error);
  }
}

async function initiateNewCard(privateKey, collectionId, cardName, imageCard) {
  try{
    const wallet = new ethers.Wallet(privateKey, blockchainProvider); 
    const contract = new ethers.Contract(contractAddress, mainContractABI, wallet);

    const transaction = await contract.createCardInCollection(collectionId, cardName, imageCard);
      await transaction.wait();

      console.log('Carte créée avec succès!');
  } catch (error) {
    console.error('Erreur lors de la création de la carte :');
    console.log("Le nombre de carte a atteind le max");
  }
}

async function retrieveCardsOfCollection(privateKey, collectionId) {
  
  const wallet = new ethers.Wallet(privateKey, blockchainProvider); 
  const contract = new ethers.Contract(contractAddress, mainContractABI, wallet);

  try {
    const cards = await contract.getCardOfCollection(collectionId);
    cards.forEach(async function(card){
      const car = await contract.getCardInfo(card);
      console.log("Le nom : ", car[0])
      console.log("Le url:", car[1])
    });
  } catch (error) {
    console.error('Erreur :', error);
  }
}

async function verifyOwner(privateKey, idCard) {
  try {
    const wallet = new ethers.Wallet(privateKey, blockchainProvider); 
    const contract = new ethers.Contract(contractAddress, mainContractABI, wallet);
    const owner = await contract.getOwnerOf(idCard);
    return owner;
  } catch (error) {
    console.log("Erreur dans la fonction verifieOwner")
    return false
  }
}

async function mintNewCard(privateKey, idCard, address) {
  try {
    const wallet = new ethers.Wallet(privateKey, blockchainProvider); 
    const contract = new ethers.Contract(contractAddress, mainContractABI, wallet);
    await contract.mintCard(idCard, address);
    return true;
  } catch (error) {
    console.error('Erreur dans la fonction mintCard');
    return false; 
  }
}

async function transferExistingCard(privateKey, idCard, address) {
  try {
    const wallet = new ethers.Wallet(privateKey, blockchainProvider); 
    const contract = new ethers.Contract(contractAddress, mainContractABI, wallet);
    await contract.transferCard(idCard, address);
    return true;
  } catch (error) {
    console.error('Erreur dans la fonction transferCard');
    return false;
  }
}

async function fetchAllCards(privateKey) {
  try {
    const wallet = new ethers.Wallet(privateKey, blockchainProvider); 
    const contract = new ethers.Contract(contractAddress, mainContractABI, wallet);
    const cards = await contract.getAllCard();
    var cardList = []
    for(var i = 0; i < cards; i++){
      const car = await contract.getCardInfoById(i);
      if(await verifyOwner(privateKey, i) == wallet.address){
        cardList.push({"nom": car[0], "url": car[1], "id": parseInt(car[2], 16)})
      }
    }
    console.log("La liste des cartes sont: ", cardList)
    return cardList
  } catch (error) {
    console.error('Erreur dans la fonction getAllCard');
    return false; 
  }
}

