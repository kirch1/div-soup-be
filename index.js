const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.locals.title = 'Div Soup API'
app.locals.players = {
  player1: { x: 100, y: 100, isAttacker: true},
  player2: { x: 300, y: 300, isAttacker: false}
};

const updatePosition = (player, x, y) => {
  app.locals.players[player].x = x;
  app.locals.players[player].y = y;
}

const newPlayer = (player) => {
  app.locals.players[player].x = 100;
  app.locals.players[player].y = 100;
}

const removePlayer = (player) => {
  delete app.locals.players[player];
}

app.set('port', 3001);

app.get('/api/v1/gameboard', (request, response) => {
  response.status(200).json(app.locals.players);
});

app.post('/api/v1/move', (request, response) => {
  const newPosition = request.body;
  updatePosition(newPosition.player, newPosition.x, newPosition.y);
  response.status(200).json(app.locals.players);
});

app.post('/api/v1/new', (request, response) => {
  const newPlayer = request.body;
  newPlayer(newPosition.player);
  response.status(200).json(app.locals.players);
});

app.post('/api/v1/delete', (request, response) => {
  const player = request.body;
  removePlayer(newPosition.player);
  response.status(200).json(app.locals.players);
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is now running on port ${app.get('port')}!`);
});
