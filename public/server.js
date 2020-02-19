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

wss.on('connection', (ws, req) => {
    console.log(req.url);
    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {
        //log the received message and send it back to the client
        console.log('received: %s', message);


        //send back the message to the other clients
        var clientNum = 0;
        wss.clients
            .forEach(client => {
            if (client != ws) {
                clientNum++;
                console.log('send: ' + clientNum);
                //cards = PLAYERS.get(id);
                client.send(`{"cards": ${message}}`);
                //console.log('cards: '+JSON.stringify(cardArray));
                //console.log(client.id);
            }
        });
            
        ws.send(`{"message":"move received"}`);

    });
    let id = getUniqueID();
    var cards = initCards();

    
    PLAYERS.set(id, cards);

    //send immediatly a feedback to the incoming connection    
    //ws.send(JSON.stringify(ws));
    ws.send(`{"id":"${id}", "cards":${JSON.stringify(cards)}}`);
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
    console.log(JSON.stringify(cardArray));
    return JSON.stringify(cardArray);
}
function getRandom() {
    return Math.floor(Math.random() * 10);
}
//# sourceMappingURL=server.js.map