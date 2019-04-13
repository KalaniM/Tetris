const canvas = document.getElementById('tetris'); //Créa du canevas
const context = canvas.getContext('2d'); //Le contexte à dessiner

context.scale(20, 20); //Pour que les éléments soient plus gros, sinon ils sont tout pitits

context.fillStyle = '#000'; //La couleur noire bg (oui c'est de toi que je parle)
context.fillRect(0, 0, canvas.width, canvas.height); //width et height définies en html

const matrix = [ //La première de nos pièces, en T
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0], //Représentée par deux valeurs
]; 

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

const player = {
  pos : {x:5, y:5},
  matrix: matrix,
}

drawMatrix(matrix, {x:5, y: 5});