const { ethers } = require('ethers');

async function fetchUserAccounts() {
  const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545'); // Assurez-vous que l'URL du fournisseur est correcte

  try {
    const accounts = await provider.listAccounts();
    return accounts;
  } catch (error) {
    console.error('Erreur lors de la récupération des comptes :', error);
    return [];
  }
}

async function verifyPrivateKeyForAccount(userPrivateKey) {
    try {
      const wallet = new ethers.Wallet(userPrivateKey);
      const userAddress = await wallet.getAddress();
      console.log('Clé privée associée à l\'adresse :', userAddress);
      const accountList = await fetchUserAccounts();
      var isConnected = false;
      console.log(accountList.length)
      for(var i = 0; i < accountList.length; i++){
        if(accountList[i] == userAddress){
            isConnected = true;
            break;
        }
      }
      if(isConnected){
        console.log("Connecté")
        return userAddress;
      }else{
        console.log("Non connecté")
      }
      return false;
        
    } catch (error) {
      console.error('La clé privée n\'est pas associée à un compte valide :', error);
    }
}

module.exports = {verifyPrivateKeyForAccount};
