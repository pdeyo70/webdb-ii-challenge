const express = require('express');
const helmet = require('helmet');

const server = express();

server.use(express.json());
server.use(helmet());

const knex = require('knex');

const config = {
  client: 'sqlite3',
  connection: {
      filename: './data/lambda.db3'
  },
  useNullAsDefault: true
};

const db = knex(config);

// knex functions here

function find() {
  return db('zoos');
}

function findById(id) {
  return db('zoos').where({ id })
}

function add(name) {
  return db('zoos').insert(name);
}

function update(id, changes) {
  return db('zoos').where({ id }).update(changes);
}

function remove(id) {
  return db('zoos').where({ id }).delete();
}

//endpoints to follow

server.post('/api/zoos', (req, res) => {
const zooAdd = req.body;
  add(zooAdd)
  .then(res.status(201).json({ zooAdd }))
  .catch(res.status(500).json({ error: "Unable to add the entry."}))
})



const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
