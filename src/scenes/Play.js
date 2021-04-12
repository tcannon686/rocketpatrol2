class Play extends Phaser.Scene {
  constructor () {
    super('playScene')
  }

  preload () {
    /* Load images/tile sprites. */
    this.load
      .image('rocket', 'assets/rocket.png')
      .image('spaceship', 'assets/spaceship.png')
      .image('starfield', 'assets/starfield.png')
      .spritesheet('explosion', 'assets/explosion.png', {
        frameWidth: 64,
        frameHeight: 32,
        startFrame: 0,
        endFrame: 9
      })

    /* Load audio. */
    this.load
      .audio('sfx_select', '/assets/blip_select12.wav')
      .audio('sfx_explosion', '/assets/explosion38.wav')
      .audio('sfx_rocket', '/assets/rocket_shot.wav')
  }

  create () {
    /* Place starfield. */
    this.starfield = this.add
      .tileSprite(0, 0, 640, 480, 'starfield')
      .setOrigin(0, 0)

    /* Create the players. */
    this.p1Rocket = new Rocket(
      this,
      game.config.width / 2,
      game.config.height - borderUISize - borderPadding,
      'rocket',
      0
    ).setOrigin(0.5, 0)

    /* Create the spaceships. */
    this.ships = []
    for (let i = 0; i < 3; i ++) {
      this.ships.push(new Spaceship(
        this,
        game.config.width + borderUISize * (6 -  3 * i),
        borderUISize * 4 + (borderUISize + borderPadding) * i,
        'spaceship',
        0,
        30 - i * 10
      ).setOrigin(0, 0))
    }

    /* Create green UI background. */
    this.add.rectangle(
      0,
      borderUISize + borderPadding,
      game.config.width,
      borderUISize * 2,
      0x00FF00
    ).setOrigin(0, 0)

    this.add.rectangle(
      0,
      0,
      game.config.width,
      borderUISize,
      0xFFFFFF
    ).setOrigin(0, 0)

    this.add.rectangle(
      0,
      game.config.height - borderUISize,
      game.config.width,
      borderUISize,
      0xFFFFFF
    ).setOrigin(0, 0)

    this.add.rectangle(
      0,
      0,
      borderUISize,
      game.config.height,
      0xFFFFFF
    ).setOrigin(0, 0)

    this.add.rectangle(
      game.config.width - borderUISize,
      0,
      borderUISize,
      game.config.height,
      0xFFFFFF
    ).setOrigin(0, 0)

    /* Define keys. */
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
    keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

    /* Configure animation. */
    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers('explosion', {
        start: 0,
        end: 9,
        first: 0
      }),
      frameRate: 30
    })

    /* Initialize score. */
    this.p1Score = 0
    let scoreConfig = {
      fontFamily: 'Courier',
      fontSize: '28px',
      backgroundColor: '#f3b141',
      color: '#843605',
      align: 'right',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 100
    }

    this.scoreLeft = this.add.text(
      borderUISize + borderPadding,
      borderUISize + borderPadding * 2,
      this.p1Score,
      scoreConfig
    )

    /* Game over flag. */
    this.gameOver = false

    /* 60-second play clock. */
    scoreConfig.fixedWidth = 0;
    this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
      this.add.text(
        game.config.width/2,
        game.config.height/2,
        'GAME OVER',
        scoreConfig
      ).setOrigin(0.5);
      this.add.text(
        game.config.width/2,
        game.config.height/2 + 64,
        'Press (R) to Restart or ← for Menu',
        scoreConfig
      ).setOrigin(0.5);
      this.gameOver = true
    }, null, this);
  }

  update (t, dt) {
    this.starfield.tilePositionX -= dt * starSpeed

    if (!this.gameOver) {
      /* Update the rocket. */
      this.p1Rocket.update(t, dt)

      /* Update the spaceships. */
      this.ships.forEach(x => x.update(t, dt))

      /* Check collisions. */
      this.ships.forEach(x => {
        if (this.checkCollision(this.p1Rocket, x)) {
          this.p1Rocket.reset()
          this.shipExplode(x)
        }
      })
    } else {
      /* Restart the scene if R is pressed. */
      if (Phaser.Input.Keyboard.JustDown(keyR)) {
        this.scene.restart()
      }

      /* Go back to the menu if left is pressed. */
      if (Phaser.Input.Keyboard.JustDown(keyLeft)) {
        this.scene.start('menuScene')
      }
    }
  }

  checkCollision (rocket, ship) {
    if (
      rocket.x < ship.x + ship.width &&
      rocket.x + rocket.width > ship.x &&
      rocket.y < ship.y + ship.height &&
      rocket.y + rocket.height > ship.y
    ) {
      return true
    }
  }

  shipExplode (ship) {
    /* Temporarily hide the ship. */
    ship.alpha = 0

    /* Create explosion sprite at the ship's position. */
    const boom = this.add.sprite(
      ship.x,
      ship.y,
      'explosion'
    ).setOrigin(0, 0)
    boom.anims.play('explode')
    boom.on('animationcomplete', () => {
      ship.reset()
      ship.alpha = 1
      boom.destroy()
    })

    /* Play sound effect. */
    this.sound.play('sfx_explosion')

    /* Add to the player's score. */
    this.p1Score += ship.points
    this.scoreLeft.text = this.p1Score
  }
}
