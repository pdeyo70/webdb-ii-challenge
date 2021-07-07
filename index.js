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
    .catch(res.status(500).json({ error: "Unable to add the entry." }))
})

server.get('/api/zoos', async (req, res) => {
  const zooList = await find();
  if (zooList) {
    (res.status(200).json({ zooList }))
  }
  else {
    (res.status(500).json({ error: "Error retrieving zoos." }))
  }
})

server.get('/api/zoos/:id', async (req, res) => {
  const zoo = await findById(req.params.id);
  if (zoo) {
    (res.status(200).json({ zoo }))
  }
  else {
    (res.status(500).json({ error: "Error retrieving zoo." }))
  }
})

server.put('/api/zoos/:id', async (req, res) => {
  try{
      const zooEdit = await update(req.params.id, req.body);
      res.status(201).json(zooEdit);
  }
  catch{
      res.status(500).json({error: "Error editing zoo."})
  }
})

server.delete('/api/zoos/:id', async (req, res) => {
  try{
      const zooDelete = await remove(req.params.id);
      res.status(201).json({message: "Deleted!"});
  }
  catch{
      res.status(500).json({error: "Error deleting action."})
  }
})



const port = 3300;
server.listen(port, function () {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
