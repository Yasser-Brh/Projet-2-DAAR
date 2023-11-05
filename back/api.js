var http = require('http');

var cors = require("cors");

const express = require("express");
const {checkForAccount} = require("./authentification")
const {createNewCollection, retrieveCollections, createNewCard, retrieveCardsOfCollection} = require("./collection")

const app = express();

var server = http.createServer(app);
app.use(express.urlencoded({extended : true}));
app.use(cors());

const port = 8181;

app.use(express.json({
    type: "*/*" 
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.post('/connect', async function(req, res){
    try{
        const  {address, privateKey} = req.body;

        if(!address || !privateKey){
            res.send([{ error: 'Missing Data' }])
            return;
        }
        const addr  = checkForAccount(privateKey)
        if(addr != false){
            if(addr == address){
                res.send([{ isConnected: "True", "address": address, "privateKey": privateKey}]);
            }
        }
    }catch (error){
        res.send([{ error: 'Error' }])
    }
})

app.post('/createNewCollection', async function(req, res){
    console.log("Hello")
    try{
        const collectionName = req.body.collectionName;
        const numCards = req.body.numCards;
        const privateKey = req.body.privateKey;
        if(createNewCollection(collectionName, numCards, privateKey)){
            res.send({ collectionCreated: "True"});
            
        }else{
            res.send([{ error: 'Error' }])
        }
        

    }catch (error){
        console.log("Error")
        console.log(error.message)

        res.send([{ error: 'Error' }])
    }
})

app.post('/retrieveCollection', async function(req, res){
    try{
        console.log("Hello")
        const privateKey = req.body.privateKey;
        const collection = await retrieveCollections(privateKey);
        res.send(collection)
    }catch(error){
        console.log(error.message)
        res.send([])
    }
})

app.post('/retrieveCardsOfCollection', async function(req, res){
    try{
        const privateKey = req.body.privateKey;
        const collectionId = req.body.collectionId; 
        const cards = await retrieveCardsOfCollection(privateKey, collectionId);
        res.send(cards)
    }catch(error){
        console.log(error.message)
        res.send([])
    }
})

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
