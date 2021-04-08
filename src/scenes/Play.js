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
  }

  create () {
    /* Place starfield. */
    this.starfield = this.add
      .tileSprite(0, 0, 640, 480, 'starfield')
      .setOrigin(0, 0)

    this.p1Rocket = new Rocket(
      this,
      game.config.width / 2,
      game.config.height - borderUISize,
      'rocket',
      0
    ).setOrigin(0.5, 1)

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
  }

  update (t, dt) {
    this.starfield.tilePositionX -= dt * starSpeed

    /* update the rocket. */
    this.p1Rocket.update(t, dt)
  }
}
