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
      .spritesheet('explosion', './assets/explosion.png', {
        frameWidth: 64,
        frameHeight: 32,
        startFrame: 0,
        endFrame: 9
      })
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

    /* Define scenes. */
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
  }

  update (t, dt) {
    this.starfield.tilePositionX -= dt * starSpeed

    /* update the rocket. */
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
  }
}
