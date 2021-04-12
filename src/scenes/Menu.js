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
  }
}
