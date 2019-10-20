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
var fireballs;
var enemy;

var spacebar;
var a;
var w;
var d;
var s;
var path;
var tweeners;
var path;
var game = new Phaser.Game(config);
var towerCanBePlaced = false;
var thisvar;

function preload ()
{
  this.load.image('background', 'assets/background.png');
  this.load.image('enemy', 'assets/enemy.png');
  this.load.image('player', 'assets/player.png');
  this.load.image('fireball','assets/fireball.png');
  this.load.image('tower','assets/tower.png');
}

function create ()
{   
    thisvar=  this;
    //Keyboard definitions
    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    t = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
    b = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);

    //Tween manager
    tweeners = this.tweens

    //Defines the path for enemies to follow
    path = new Phaser.Curves.Path(600, 25);
    path.lineTo(100, 200);
    path.lineTo(700, 200);
    path.lineTo(200, 800);

    var fireball = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,
  
        initialize:
  
        function fireball (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'fireball');
  
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

    var enemy = new Phaser.Class({

        Extends: Phaser.GameObjects.Sprite,

        initialize: function(scene) {
            Phaser.GameObjects.Sprite.call(this,scene,100,100,'enemy');
            this.setScale(2,2);
            this.setActive(true);
            this.setVisible(true);
        },

        run: function() {
            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
            tweeners.add({
                targets: this.follower,
                t: 1,
                ease: 'Sine.easeInOut',
                duration: 10000,
                yoyo: false,
                repeat: -1
            });
            path = path;
        },

        update: function() {
            path.getPoint(this.follower.t, this.follower.vec);
            this.setPosition(this.follower.vec.x, this.follower.vec.y);

            if (this.y > 600 ) {
                this.setActive(false);
                this.setVisible(false);
            }
        }
    });

    var tower = new Phaser.Class({

        Extends: Phaser.GameObjects.Sprite,

        initialize: function(scene) {
            Phaser.GameObjects.Sprite.call(this,scene,100,100,'tower');
            this.setScale(2,2);
            this.setActive(true);
            this.setVisible(true);
            this.damage = 0;
        },

        setDamage: function(newDamage) {self.damage = newDamage;}

    });

    var player = new Phaser.Class({

        Extends: Phaser.GameObjects.Sprite,

        initialize: function(scene) {
            Phaser.GameObjects.Sprite.call(this,scene,100,100,'player');
            this.setScale(2,2);
            this.setActive(true);
            this.setVisible(true);
            this.gold = 0;
            this.fireballs = thisvar.add.group({
                classType: fireball,
                maxSize: 30,
                runChildUpdate: true
            });
        },

        getGold: function() {return self.gold},
        setGold: function(newGold) {self.gold = newGold;},

        update: function() {
            if (Phaser.Input.Keyboard.JustDown(spacebar))
            {
                var fireball = this.fireballs.get();
          
                if (fireball)
                {
                    fireball.fire(this.x, this.y);
                }
            }
          
            if (d.isDown)
            {
                this.setPosition(this.x+10,this.y);
            }
          
            if (a.isDown)
            {
                this.setPosition(this.x-10,this.y);
            }
          
            if (w.isDown)
            {
                this.setPosition(this.x,this.y-10);
            }
          
            if (s.isDown)
            {
                this.setPosition(this.x,this.y+10);
            }
        }
    });

    //Set Background image
  this.add.image(400, 300, 'background');


  //
  enemies = this.add.group({
    classType: enemy,
    maxSize: 100,
    runChildUpdate: true
  })

  players = this.add.group({
      classType: player,
      maxSize: 1,
      runChildUpdate: true
  })

  players.get();

  graphics = this.add.graphics();
  graphics.lineStyle(1, 0xffffff, 1);

  path.draw(graphics);

}//end of create

function update ()
{
    if (b.isDown) {
        ene = enemies.get();
        ene.run();
    }

    if (Phaser.Input.Keyboard.JustDown(t)){
        towerCanBePlaced = towerCanBePlaced ? false : true;
        
    }
    this.input.on('pointerdown', function (pointer) {
        if (towerCanBePlaced){
            this.add.image(pointer.x, pointer.y, 'tower');
            towerCanBePlaced = false;
        }
    }, this);



}//end of update