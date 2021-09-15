const express = require('express');

const server = express();

// sinaliza a utilização do json
server.use(express.json());
/**
 * Query params = ?nome=Maicon
 * Route params = /users/:1
 * Request body =  { } payload transmissão de dados (POST | PUT)
 */

const users = ['Maria', 'João', 'Ricardo', 'Aline', 'Joana', 'Daniel', 'Tainara'];

/**
 * Primeiro parametro rota
 * Segundo parametro, manipulação (Middlewares)
 * req => requisição para o servidor
 * res => resposta para o cliente
 */

/**
 * CRUD - Create, Read, Update, Delete
 */

// Middlewares Global
server.use((req, res, next) => {

  console.time('Request')
  console.log(`Método: ${req.method}; url: ${req.url}`);

  next();

  console.timeEnd('Request');
});

// Middlewares Local
function checkUserExists(req, res, next) {
  if(!req.body.name) {
    return res.status(400).json({ error: 'User name is required'});
  }

  return next();
}

function checkUserInArray(req, res, next) {

  const user = users[req.params.index];

  if(!users) {
    return res.status(400).json({error: 'User does not exists'});
  }

  req.user = user;

  return next();
}

// Lista de usuários
server.get('/users', (req, res) => {

  return res.json(users)
});

// Lista o usuário
server.get('/users/:index', checkUserInArray, (req, res) => {

  return res.json(req.user);
});

// Cria um novo usuário
server.post('/users', checkUserExists, (req, res) => {

  const {name} = req.body;

  users.push(name);

  return res.json(users)
});

// Editar o usuário
server.put('/users/:index',checkUserInArray, checkUserExists, (req,res) => {

  const {index} = req.params;
  const {name} = req.body;

  users[index] = name;

  return res.json(users);
});

// Deletar o usuário
server.delete('/users/:index', checkUserInArray, (req, res) => {

  const {index} = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);