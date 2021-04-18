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
      .image('mountains1', 'assets/mountains1.png')
      .image('mountains2', 'assets/mountains2.png')
      .image('soft', 'assets/soft.png')
      .spritesheet('explosion', 'assets/explosion.png', {
        frameWidth: 64,
        frameHeight: 32,
        startFrame: 0,
        endFrame: 9
      })

    /* Load audio. */
    this.load
      .audio('sfx_select', 'assets/blip_select12.wav')
      .audio('sfx_explosion0', 'assets/explode1.wav')
      .audio('sfx_explosion1', 'assets/explode2.wav')
      .audio('sfx_explosion2', 'assets/explode3.wav')
      .audio('sfx_explosion3', 'assets/explode4.wav')
      .audio('sfx_rocket', 'assets/rocket_shot.wav')
      .audio('music', 'assets/music.mp3')
  }

  create () {
    if (!this.music) {
      this.music = this.sound.add('music', {
        loop: true,
        volume: 0.5
      })
      /* Play music. */
      this.music.play()
    }

    /* Place starfield. */
    this.backgrounds = [
      this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0),
      this.add.tileSprite(0, 0, 640, 480, 'mountains1').setOrigin(0, 0),
      this.add.tileSprite(0, 0, 640, 480, 'mountains2').setOrigin(0, 0)
    ]

    /* Particles. */
    this.explodeParticles = this.add.particles('soft')

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
    for (let i = 0; i < 3; i++) {
      this.ships.push(new Spaceship(
        this,
        game.config.width + borderUISize * (6 - 3 * i),
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

    /* Initialize score. */
    this.p1Score = 0
    const scoreConfig = {
      fontFamily: 'Courier',
      fontSize: '28px',
      backgroundColor: '#f3b141',
      color: '#843605',
      align: 'right',
      padding: {
        top: 5,
        bottom: 5
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
    this.clock = Math.floor(game.settings.gameTimer / 1000)

    const clockTextConfig = {
      ...scoreConfig,
      align: 'center'
    }

    /* Time remaining. */
    this.clockText = this.add.text(
      game.config.width / 2,
      borderUISize + borderPadding * 2,
      clockText(this.clock),
      clockTextConfig
    ).setOrigin(0.5, 0)

    const gameOverConfig = { ...scoreConfig, fixedWidth: 0 }

    const handleSecondElapsed = () => {
      this.clock--
      this.clockText.text = clockText(this.clock)
      if (this.clock === 0) {
        this.add.text(
          game.config.width / 2,
          game.config.height / 2,
          'GAME OVER',
          gameOverConfig
        ).setOrigin(0.5)
        this.add.text(
          game.config.width / 2,
          game.config.height / 2 + 64,
          'Press (R) to Restart or ← for Menu',
          gameOverConfig
        ).setOrigin(0.5)
        this.gameOver = true
      } else {
        this.time.delayedCall(1000, handleSecondElapsed, null, this)
      }
    }
    this.time.delayedCall(1000, handleSecondElapsed, null, this)
  }

  update (t, dt) {
    this.backgrounds.forEach((x, i) => {
      x.tilePositionX -= dt * starSpeed * (i + 1)
    })

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

    const config = {
      lifespan: 500,
      maxParticles: 20,
      frequency: -1,
      radial: true,
      blendMode: Phaser.BlendModes.ADD,
      alpha: { start: 1, end: 0 },
      scale: { min: 0.5, max: 1, end: 2.0 },
      speedX: { min: -256, max: 128 },
      speedY: { min: -128, max: 128 }
    }
    const explosion = this.explodeParticles.createEmitter({
      ...config,
      tint: 0xff00ff,
      deathCallback: () => {
        if (explosion.getAliveParticleCount() === 0) {
          this.explodeParticles.removeEmitter(explosion)
          ship.reset()
          ship.alpha = 1
        }
      }
    })
    explosion.explode(
      config.maxParticles,
      ship.x + ship.width / 2,
      ship.y + ship.height / 2
    )

    /* Play sound effect. */
    this.sound.play('sfx_explosion' + Math.floor(Math.random() * 4))

    /* Add to the player's score. */
    this.p1Score += ship.points
    this.scoreLeft.text = this.p1Score
    
    /* Increase the amount of time left based on the ship point value. */
    this.clock += ship.points / 5

    /* Update clock UI. */
    this.clockText.text = clockText(this.clock)
  }
}
