const redis = require('redis');
const redirURL = 'redis://localhost:6379';

const client = redis.createClient(redirURL);

client.hset('spanish', 'red', 'rojo');
client.hset('spanish', 'orange', 'naranja');
client.hset('spanish', 'blue', 'azul');

client.hset('german', 'red', 'rot');


function logValue(err, value) {
  err 
    ? console.error(err)
    : console.log(value);
}

client.hget('spanish', 'red', logValue)