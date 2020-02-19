"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const app = express();
//initialize a simple http server
const server = http.createServer(app);
//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

var PLAYERS = new Map();
var SOCKETS = new Map();


let cardReference = {
    0:{name:"jib wiggler", damage:1},
    1:{name:"knob bollocker", damage:3},
    2:{name:"turd wrangler", damage:2},
    3:{name:"willy grabber", damage:4},
    4:{name:"bog jiggler", damage:2},
    5:{name:"reed warbler", damage:1},
    6:{name:"fish stretcher", damage:1},
    7:{name:"shrew muncher", damage:7},
    8:{name:"cheek twister", damage:4},
    9:{name:"clamp incinerator", damage:0}
}

wss.on('connection', (ws, req) => {
    console.log(req.url);
    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {
        //log the received message and send it back to the client
        console.log('received: %s', message);


        // Response to the sending client
        let data = JSON.parse(message);
        //console.log(message);

        if(id != null) {
            let id = data.id;
        }
            
        let playerData = JSON.parse(PLAYERS.get(id));
        if(playerData.hand != undefined) {
            let hand = playerData.hand;

            if(data.data.event == "play") {
                //console.log('play');
                
                let playCardNum = data.data.card;

                playCard(id, playCardNum);
                
            }

        }

        sendStatusToClient(id, ws);

        console.log(PLAYERS);

        // Response to the other clients
        /*var clientNum = 0;
        wss.clients
            .forEach(client => {
            if (client != ws) {


                clientNum++;
                console.log('send: ' + clientNum);
                
                //client.send(`{"data": ${message}}`);
                //console.log('cards: '+JSON.stringify(cardArray));
            }
        });*/

        console.log("socks----------------");
        for (const [k, v] of SOCKETS.entries()) {
            console.log("sock +++ "+k);
            if(v !== ws) {
                console.log('this one');
                sendStatusToClient(k, v);
            }
            
        }


    });
    let id = getUniqueID();
    var cards = initCards();

    
    PLAYERS.set(id, cards);
    SOCKETS.set(id, ws);

    //send welcome message to the incoming connection
    ws.send(`{"id":"${id}", "data":${JSON.stringify(cards)}}`);
});
function getUniqueID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
}
;
//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ` + (process.env.PORT || 8999) + ` :)`);
});
function initCards() {
    let cardArray = [getRandom(), getRandom(), getRandom(), getRandom(), getRandom()];
    let health = 20;

    let playerData = {
        hand:cardArray,
        health:health
    };

    console.log(JSON.stringify({playerData}));
    return JSON.stringify(playerData);
}
function getRandom() {
    return Math.floor(Math.random() * 10);
}

function playCard(id, playCardNum) {
    
    let playerData = JSON.parse(PLAYERS.get(id));
    console.log("play card: "+playCardNum);

    // Now damage other players

    let playedCardDetails = cardReference[playerData.hand[playCardNum]];
    console.log("damage: "+playedCardDetails.damage);

    // For now at least apply damage to all other players
    for (const [k, v] of PLAYERS.entries()) {
        console.log("player +++ "+k);
        if(k !== id) {
            console.log('this one');
            alterHealth(k, -(playedCardDetails.damage));
        }
        
    }

    // Now remove the used card

    playerData.hand.splice(playCardNum, 1);
    PLAYERS.set(id, JSON.stringify(playerData));


}

function alterHealth(id, amount) {
    
    let playerData = JSON.parse(PLAYERS.get(id));

    playerData.health += amount;
    PLAYERS.set(id, JSON.stringify(playerData));
}

function sendStatusToClient(id, ws) {
    
    let playerData = JSON.parse(PLAYERS.get(id));
    //console.log(playerData);
    ws.send(`{"id":"${id}", "data":${JSON.stringify(playerData)}}`);
}
//# sourceMappingURL=server.js.map