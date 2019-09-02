class PlayGame extends Phaser.Scene {

  constructor(config) {
    super(config);

  }


  preload() {
    const baseURL = './assets/images/colourJump/';
    this.load.image('ball', baseURL + 'ball.png');
    this.load.image('coin', baseURL + 'coin.png');
    this.load.image('wall', baseURL + 'wall.png');
  }

  create() {
    // this.matter.world.setBounds();  //set world bounds in matter
    gameOptions.skor = 0;
    this.coin = this.matter.add.image(100, 100, 'coin');
    this.coin.setCircle();  // make body boundry circle
    this.coin.setStatic(true);  // make body static
    this.coin.body.label = 'coin';
    this.coin.body.isSensor = true; // çarpışma sırasında fizik olmadan etkileşim
    this.createRandomCoin();

    this.ball = this.matter.add.image(50, 300, 'ball');
    this.ball.setCircle();
    this.ball.setVelocityX(gameOptions.topHiz);
    this.ball.set

    this.input.on('pointerdown', this.jump, this);

    this.solDuvarlar = [];
    this.sagDuvarlar = [];

    for (let i = 0; i < gameOptions.bolmeler; i++) {
      this.solDuvarlar[i] = this.duvarEkle(i, SOL);
      this.sagDuvarlar[i] = this.duvarEkle(i, SAG);
    }

    this.matter.world.on('collisionstart', function (e, b1, b2) {
      if (b1.label === 'solduvar' || b2.label === 'solduvar') {
        this.duvarlaCarpis(SOL, b1, b2);
      }

      if (b1.label === 'sagduvar' || b2.label === 'sagduvar') {
        this.duvarlaCarpis(SAG, b1, b2);
      }

      if (b1.label === 'coin' || b2.label === 'coin') {
        this.createRandomCoin();
        gameOptions.skor += 1;
        this.skorText.setText(gameOptions.skor);
        if (gameOptions.rekor < gameOptions.skor) {
          localStorage.setItem('rekor', gameOptions.skor);
          gameOptions.rekor = gameOptions.skor;
        }
      }


    }, this);


    this.skorText = this.add.text(
      this.game.canvas.width / 2,
      30,
      gameOptions.skor,
      { fontSize: '50px', fill: '#fff', fontStyle: 'bold' });
    this.skorText.setOrigin(0.5);

    const rekorSkor = localStorage.getItem('rekor');

    this.rekorSkorText = this.add.text(
      this.game.canvas.width / 2,
      this.game.canvas.height - 70,
      gameOptions.rekor,
      { fontSize: '100px', fill: '#fff', fontStyle: 'bold' });
    this.rekorSkorText.setOrigin(0.5);

  }

  update() {

    if ((this.ball.y < this.ball.width * 0.6) ||
      (this.ball.y > this.game.canvas.height - this.ball.height * 0.6)) {
      this.scene.restart('scene1');

    }


  }

  createRandomCoin() {
    const paddingX = 50;
    const paddingY = 50;
    this.coin.x = Phaser.Math.Between(
      paddingX,
      this.game.canvas.width - paddingX);

    this.coin.y = Phaser.Math.Between(
      paddingY,
      this.game.canvas.height - paddingY);
  }

  jump() {
    console.log("jump...");
    this.ball.setVelocity(
      this.ball.body.velocity.x > 0 ? gameOptions.topHiz : -gameOptions.topHiz,
      -gameOptions.topZiplama
    );
  }

  duvarEkle(duvarNo, taraf) {
    let duvarTexture = this.textures.get('wall');
    let duvarHeight = this.game.canvas.height / gameOptions.bolmeler;

    let duvarX = taraf * this.game.canvas.width +
      duvarTexture.source[0].width / 2 - duvarTexture.source[0].width * taraf;

    let duvarY = duvarNo * duvarHeight + duvarHeight / 2;

    let duvar = this.matter.add.image(duvarX, duvarY, 'wall');
    duvar.setStatic(true);
    duvar.body.label = (taraf == SAG) ? 'sagduvar' : 'solduvar';
    duvar.displayHeight = duvarHeight;

    return duvar;
  }

  duvarlaCarpis(taraf, bodyA, bodyB) {
    if (bodyA.color !== bodyB.color) {
      // debugger;
      console.log("Restart.....................");
      // this.scene.stop("PlayGame");
      this.scene.restart("scene1");
    }


    if (taraf == SOL) {
      this.ball.setVelocity(gameOptions.topHiz, this.ball.body.velocity.y);
      this.duvarBoya(this.sagDuvarlar);
    } else {
      this.ball.setVelocity(-gameOptions.topHiz, this.ball.body.velocity.y);
      this.duvarBoya(this.solDuvarlar);
    }


  }

  duvarBoya(duvarlar) {
    duvarlar.forEach(duvar => {
      let renk = Phaser.Math.RND.pick(gameOptions.renkler);
      duvar.setTint(renk);
      duvar.body.color = renk;
    });

    let rastgeleDuvar = Phaser.Math.RND.pick(duvarlar);
    this.ball.setTint(rastgeleDuvar.body.color); // burası
    this.ball.body.color = rastgeleDuvar.body.color;
  }

}