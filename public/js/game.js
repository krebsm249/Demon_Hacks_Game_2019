var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  backgroundColor: '#000000',
  width: 800,
  height: 600,
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

var spacebar;
var player;
var bullets;

var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('background', 'assets/background.png');
  this.load.image('enemy', 'assets/enemy.png');
  this.load.image('player', 'assets/player.png');
}

function create ()
{
  var Bullet = new Phaser.Class({

      Extends: Phaser.GameObjects.Image,

      initialize:

      function Bullet (scene)
      {
          Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

          this.speed = Phaser.Math.GetSpeed(600, 1);
      },

      fire: function (x, y)
      {
          this.setPosition(x, y);

          this.setActive(true);
          this.setVisible(true);
      },

      update: function (time, delta)
      {
          this.x += this.speed * delta;

          if (this.x > 820)
          {
              this.setActive(false);
              this.setVisible(false);
          }
      }

  });

  bullets = this.add.group({
      classType: Bullet,
      maxSize: 30,
      runChildUpdate: true
  });

  this.add.image(400, 300, 'background');

  player = game.add.sprite(100, 300, 'player');
  player.scale.setTo(2,2)

  spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

}

x = 50
y = 50
function update ()
{
  if (Phaser.Input.Keyboard.JustDown(spacebar))
  {
      var bullet = bullets.get();

      if (bullet)
      {
          bullet.fire(player.x, player.y);
      }
  }

  if (d.isDown)
  {
      x = x+10;
      player.setPosition(x,y);
  }

  if (a.isDown)
  {
      x = x-10;
      player.setPosition(x,y);
  }

  if (w.isDown)
  {
      y = y-10;
      player.setPosition(x,y);
  }

  if (s.isDown)
  {
      y = y+10;
      player.setPosition(x,y);
  }
}