const WebSocket = require('ws');
var uuid = require('uuid-random');

const wss = new WebSocket.WebSocketServer({port:8080}, () => {

    console.log('server started');

});

wss.on('connection', function connection(client){

	client.id = uuid();

	console.log(`Client ${client.id} Connected!`)
	
	client.send(`{"id": "${client.id}"}`)

	client.on('message', (data) => {
		var dataJSON = JSON.parse(data)
        console.log(dataJSON);
        wss.clients.forEach(function each(cl) {
            if (cl.readyState === WebSocket.OPEN) {
                cl.send(JSON.stringify(dataJSON));
            }
        });
	})

	client.on('close', () => {
		console.log('This Connection Closed!')
		console.log("Removing Client: " + client.id)

        wss.clients.forEach(function each(cl) {
            if (cl.readyState === WebSocket.OPEN) {
                console.log(`Client with id ${client.id} just left`)
                cl.send(`Closed:${client.id}`);
            }
        });
	})

});

wss.on("listening", () => {
    console.log('listening on 8080');
});

