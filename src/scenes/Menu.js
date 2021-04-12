class Menu extends Phaser.Scene {
  constructor () {
    super('menuScene')
  }

  preload () {
    /* Load audio. */
    this.load
      .audio('sfx_select', '/assets/blip_select12.wav')
  }

  create () {
    /* Menu text config. */
    const menuConfig = {
      fontFamily: 'Courier',
      fontSize: '28px',
      backgroundColor: '#f3b141',
      color: '#843605',
      align: 'right',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 0
    }

    this.add.text(
      game.config.width / 2,
      game.config.height / 2 - borderUISize - borderPadding,
      'ROCKET PATROL',
      menuConfig
    ).setOrigin(0.5)

    this.add.text(
      game.config.width / 2,
      game.config.height / 2,
      'Use ←→ arrows to move & (F) to fire',
      menuConfig
    ).setOrigin(0.5)

    this.add.text(
      game.config.width / 2,
      game.config.height / 2 + borderUISize + borderPadding,
      'Press ← for Novice or → for Expert',
      {
        ...menuConfig,
        backgroundColor: '#00ff00',
        color: '#000'
      }
    ).setOrigin(0.5)

    /* Define keys. */
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
    keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
  }

  update () {
    if (Phaser.Input.Keyboard.JustDown(keyLeft)) {
      game.settings = {
        spaceshipSpeed: 3 * 60 / 1000,
        gameTimer: 60000
      }
      this.sound.play('sfx_select')
      this.scene.start('playScene')
    }
    if (Phaser.Input.Keyboard.JustDown(keyRight)) {
      game.settings = {
        spaceshipSpeed: 4 * 60 / 1000,
        gameTimer: 45000
      }
      this.sound.play('sfx_select')
      this.scene.start('playScene')
    }
  }
}
