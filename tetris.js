const canvas = document.getElementById('tetris'); //Créa du canevas
const context = canvas.getContext('2d'); //Le contexte à dessiner

context.scale(20, 20); //Pour que les éléments soient plus gros, sinon ils sont tout pitits


const matrix = [ //La première de nos pièces, en T
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0], //Représentée par deux valeurs
];

function createMatrix(w, h) {
  const matrix = [];
  while (h--) { // Tant que h !== 0 alors on enlève 1 à h
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function draw() {

  context.fillStyle = '#000'; //La couleur noire bg (oui c'est de toi que je parle)
  context.fillRect(0, 0, canvas.width, canvas.height); //width et height définies en html
  // Le fond est redraw a chaque update

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

function playerDrop() {
  player.pos.y++; //Plonge plus vite
  dropCounter = 0; //Reinit pour obtenir le délai d'1 sec
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
  pos : {x:5, y:5},
  matrix: matrix,
}

document.addEventListener('keydown', event => {
  if (event.keyCode === 37) {
     player.pos.x--; //Se déplace à gauche
  } else if (event.keyCode === 39) {
     player.pos.x++; //Se déplace à droite
  } else if (event.keyCode === 40) {
    playerDrop();
    
  }
});

update();