class Menu extends Phaser.Scene {
  constructor () {
    super('menuScene')
    this.easySettings = {
      spaceshipSpeed: 3 * 60 / 1000,
      gameTimer: 60000
    }
    this.hardSettings = {
      spaceshipSpeed: 4 * 60 / 1000,
      gameTimer: 45000
    }
  }

  preload () {
    /* Load images. */
    this.load
      .image('mainmenu', 'assets/mainmenu.png')
    /* Load audio. */
    this.load
      .audio('sfx_select', 'assets/blip_select12.wav')
  }

  create () {
    this.add.image(0, 0, 'mainmenu').setOrigin(0, 0)

    /* Define keys. */
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
    keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
    keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

    /* Handle mouse. */
    this.input.on(Phaser.Input.Events.POINTER_DOWN, (e) => {
      if (e.button === 0) {
        this.select(this.easySettings)
      } else if (e.button === 2) {
        this.select(this.hardSettings)
      }
    })
  }

  select (settings) {
    game.settings = settings
    this.sound.play('sfx_select')
    this.scene.start('playScene')
  }

  update () {
    if (Phaser.Input.Keyboard.JustDown(keyLeft)) {
      this.select(this.easySettings)
    }
    if (Phaser.Input.Keyboard.JustDown(keyRight)) {
      this.select(this.hardSettings)
    }
  }
}
