const canvas = document.getElementById('tetris'); //Créa du canevas
const context = canvas.getContext('2d'); //Le contexte à dessiner

context.scale(20, 20); //Pour que les éléments soient plus gros, sinon ils sont tout pitits



function collide(arena, player) { // Gerer les collisions murs et sol
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x  = 0; x< m[y].length; ++x) { // Coll mur
      if (m[y][x] !== 0 &&
      (arena[y + o.y] && 
        arena[y + o.y][x + o.x]) !== 0) { //Coll sol
        return true; // Collision il y a
      }
    }
  }
  return false; // Il n'y a pas collision
}

function createMatrix(w, h) {
  const matrix = [];
  while (h--) { // Tant que h !== 0 alors on enlève 1 à h
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function createPieces(type) {
  if (type === 'T') {
    return [ //La première de nos pièces, en T
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0], // Représentée par deux valeurs
    ];
  } else if (type === 'O') {
    return [ // Une pièce en O
      [1, 1],
      [1, 1],
    ];
  } else if (type === 'L') {
    return [ // Une pièce en L
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ];
  } else if (type === 'J') {
    return [ // Une pièce en J
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ];
  } else if (type === 'I') {
    return [ // Une pièce en I
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0], //Une matrice plus grande pour anticiper la rotation
    ];
  } else if (type === 'S') {
    return [ // Une pièce en S
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ];
  } else if (type === 'Z') {
    return [ // Une pièce en Z
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ];
  }
}

function draw() {
  context.fillStyle = '#000'; //La couleur noire bg (oui c'est de toi que je parle)
  context.fillRect(0, 0, canvas.width, canvas.height); //width et height définies en html
  // Le fond est redraw a chaque update
  drawMatrix(arena, {x: 0, y:0});
  drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => { //Sélectionner chaques lignes
    row.forEach((value, x) => { //Sélectionner chaque carrés
      if (value !== 0) { //Si le carré = 1 la pièce est présente
        context.fillStyle = 'red'; //Alors la pièce est appelée en rouge
        context.fillRect(x + offset.x,
                          y + offset.y,
                          1, 1);
        //Dimensions de la pièce
      }
    });
  });
}

function merge(arena, player) { //Garder en mémoire les positions des pièces sur le jeu
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function playerDrop() {
  player.pos.y++; //Plonge plus vite
  if (collide(arena, player)) {
    player.pos.y--; // Si il y a coll avec le sol
    merge(arena, player); // Actualisation de l'arène
    playerReset(); // Nouvelle pièce tombe
  }
  dropCounter = 0; //Reinit pour obtenir le délai d'1 sec
}

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
}

function playerReset() {
  const pieces = "ILOJZST";
  player.matrix = createPieces(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0;
  player.pos.x = (arena[0] .length / 2 | 0) -
                  (player.matrix[0].length / 2 | 0);
}

function playerRotate(dir) {
  const pos = player.pos.x;
  rotate(player.matrix, dir); // Rotation de la pièce
  let offset = 1;             
  while (collide(arena, player)) { // Gerer les coll pendant la rotation
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1)); // Si o = 0 alors coll il y a -> On retourne de nouveau la pièce pour ne pas qu'elle passe à travers le mur
    if (offset > player.matrix[0].length) { // La direction de la rotation est la constante malgré la collision
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

function rotate(matrix, dir) { // Faire tourner les pièces
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [
        // On fait un simple échange de place des carrés dans la matrice
          matrix[x][y], 
          matrix[y][x],
      ] = [
          matrix[y][x],
          matrix[x][y],
      ];
    }
  }

  if (dir > 0) {
    matrix.forEach(row => row.reverse());
  } else {
    matrix.reverse();
  }
}

let dropCounter = 0;
let dropInterval = 1000; 

let lastTime = 0;
function update(time = 0) { // L'animation se répète
  const deltaTime = time - lastTime;
  lastTime = time;
  // L'animation dure 1 seconde

  dropCounter += deltaTime;
  if (dropCounter > dropInterval) {
    playerDrop()
  }

  draw();
  requestAnimationFrame(update);
}

const arena = createMatrix(12, 20); // 20 d'unités et 12 en étendue
// console.log(arena); console.table(arena);

const player = {
  pos : {x:5, y:-1},
  matrix: createPieces('T'),
}

document.addEventListener('keydown', event => {
  if (event.keyCode === 37) {
    playerMove(-1); //Se déplace à gauche

  } else if (event.keyCode === 39) {
    playerMove(1); //Se déplace à droite

  } else if (event.keyCode === 40) {
    playerDrop(); // Plonge
    
  } else if (event.keyCode === 81) {
    playerRotate(-1);

  } else if (event.keyCode === 87) {
    playerRotate(1);
  }
});

update();