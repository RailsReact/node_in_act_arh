const events = require('events');
const net = require('net');
const channel= new events.EventEmitter();
channel.setMaxListeners(50);
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function(id,client){
  const welcome = `Welcome! Guests online: ${this.listeners('broadcast').length}`;
  client.write(`${welcome}\n`);

  this.clients[id] = client;
  this.subscriptions[id] = (senserId, message) => {
    if(id != senserId){
      this.clients[id].write(message);
    }
  };
  this.on('broadcast', this.subscriptions[id]);
});

channel.on('leave', function(id){
  channel.removeListener('broadcast', this.subscriptions[id]);
  channel.emit('broadcast', id, `${id} has left the chatroom.\n`);
});

channel.on('shutdown', ()=>{
  channel.emit('broadcast', '', 'The server has shut down.\n');
  channel.removeAllListeners('broadcast');
})

const server = net.createServer(client => {
  const id = `${client.remoteAddress}:${client.remotePort}`;
  channel.emit('join', id, client);
  client.on('data', data => {
    data = data.toString();
    if(data === 'shutdown\r\n'){
      channel.emit('shutdown');
    }
    channel.emit('broadcast', id, data);
  });
  client.on('close', () => {
    channel.emit('leave', id);
  });
});
server.listen(8888);