const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.set('port', 3001);
app.locals.title = 'Div Soup API'
app.locals.players = {};
let attacker = '';

const updatePosition = (player, x, y) => {
  app.locals.players[player].x = x;
  app.locals.players[player].y = y;
}

const newPlayer = (player) => {
  app.locals.players[player] = {x: randomIntFromInterval(0,650), y: randomIntFromInterval(0,400), isAttacker: false};
  console.log('new player joined: ', player)
}

const removePlayer = (player) => {
  delete app.locals.players[player];
  console.log('defeated: ', player)
}

const setAttacker = () => {
  const keys = Object.keys(app.locals.players);
  if(keys.length) {
    const randomIndex = Math.floor(Math.random() * keys.length)
    keys.forEach(key => app.locals.players[key].isAttacker = false);
    app.locals.players[keys[randomIndex]].isAttacker = true;
    attacker = keys[randomIndex];
    console.log('new attacker: ', attacker)
  }
}
setInterval(setAttacker, 10000);

const checkWin = () => {
  if(attacker){
    const keys = Object.keys(app.locals.players);
    const attackerX = app.locals.players[attacker].x
    const attackerY = app.locals.players[attacker].y
    const victims = keys.filter(key => !app.locals.players[key].isAttacker);
    const deads = victims.filter(victim => {
      const victimX = app.locals.players[victim].x
      const victimY = app.locals.players[victim].y
      return ((attackerX + 50 > victimX - 50  && attackerX < victimX + 100) && (attackerY + 50 > victimY - 50  && attackerY < victimY + 100))
    })
    deads.forEach(dead => removePlayer(dead))
  }
}
setInterval(checkWin, 100);

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

app.get('/api/v1/gameboard', (request, response) => {
  response.status(200).json(app.locals.players);
});

app.post('/api/v1/new', (request, response) => {
  newPlayer(request.body.player);
  response.status(200).json(app.locals.players);
});

app.post('/api/v1/move', (request, response) => {
  const newPosition = request.body;
  updatePosition(newPosition.player, newPosition.x, newPosition.y);
  response.status(200).json(app.locals.players);
});

app.post('/api/v1/delete', (request, response) => {
  removePlayer(request.body.player);
  response.status(200).json(app.locals.players);
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is now running on port ${app.get('port')}!`);
});
