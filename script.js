const gameOptions = {
  yercekimi: 5,
  topHiz: 4,
  topZiplama: 30,
  bolmeler: 4,
  renkler: [0x1abc9c, 0x2980bc, 0x9b59bb, 0xf1c40f, 0xc0302b, 0xecf0f1],
  skor: 0,
  rekor: localStorage.getItem('rekor') || 0,

}
debugger;




const SOL = 0;
const SAG = 1;

let game;
let scene1;
window.onload = function () {

  scene1 = new PlayGame();

  const config = {
    // chose html5-canvas vs CanvasGL. 
    type: Phaser.AUTO,
    //width - height
    width: 750,
    height: 1334,

    //background color of canvas
    backgroundColor: 0x225566, //hexadecimal color code

    scale: {
      autoCenter: Phaser.Scale.CENTER_BOTH, // rescale with aspect ratio
      mode: Phaser.Scale.FIT,               // vertical and horizontal center
    },
    // default scene objects properties
    scene: [scene1],
    // physics engine
    physics: {
      default: 'matter',
      matter: {
        gravity: { x: 0, y: gameOptions.yercekimi }, // set gravity
        debug: true,              // debug mode
      },
    },
  };

  game = new Phaser.Game(config);

}

