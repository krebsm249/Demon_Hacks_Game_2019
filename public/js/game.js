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
var enemyArray = [];
var towerArray = [];

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

    var projectile = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,
  
        initialize:
  
        function projectile (scene)
        {
            Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'fireball');
  
            this.speed = 4
            this.dmg = 50;
        },
  
        fire: function (x, y, x2, y2, target)
        {
            this.target_x = x2;
            this.target_y = y2;
            this.target = target;

            this.angle = Phaser.Math.Angle.Between(x,y,x2,y2);
            
            this.dx = Math.cos(this.angle);
            this.dy = Math.sin(this.angle);

            this.angle = (this.angle) * Phaser.Math.RAD_TO_DEG;

            this.setPosition(x, y);
      
            this.setActive(true);
            this.setVisible(true);
        },
  
        update: function ()
        {
            this.angle = Phaser.Math.Angle.Between(this.x,this.y,this.target.x,this.target.y);
            
            this.dx = Math.cos(this.angle);
            this.dy = Math.sin(this.angle);

            this.angle = (this.angle) * Phaser.Math.RAD_TO_DEG;

            this.x += this.dx * (this.speed);
            this.y += this.dy * (this.speed);

            var dx = this.x - this.target.x;
            var dy = this.y - this.target.y;
            distanceToTarget = Math.sqrt(dx*dx+dy*dy);

            if (distanceToTarget <= 10) {
                this.setActive(false);
                this.setVisible(false);
                this.target.dealDmg(this.dmg);
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
            this.hp = 100;
            this.gold = 5;
        },

        setHp: function(hp) { this.hp = 100;},
        dealDmg: function(dmg) { this.hp -= dmg; },

        run: function() {
            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
            tweeners.add({
                targets: this.follower,
                t: 1,
                ease: 'Sine.easeInOut',
                duration: 20000,
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

            if (this.hp<=0) {
                this.setActive(false);
                this.setVisible(false);
                player.gold += this.gold;
                var index = enemyArray.indexOf(this);
                if (index > -1) {
                    enemyArray.splice(index,1);
                }
            }
        }
    });

    var tower = new Phaser.Class({
        Extends: Phaser.GameObjects.Sprite,

        initialize: function(scene) {
            Phaser.GameObjects.Sprite.call(this,scene,-100,-100,'tower');
            this.setScale(2,2);
            this.setActive(true);
            this.setVisible(true);
            this.damage = 0;
            this.cost = 0;
            this.towerIsPlaced = false;
            this.id = Math.floor(Math.random()*10000);
            this.fireCounter = 0;
            this.range = 200;
            this.attack_speed = 60;
            this.canFire = true;

            this.projectiles = thisvar.add.group({
                classType: projectile,
                maxSize: 100,
                runChildUpdate: true
              });
        },

        setDamage: function(newDamage) {self.damage = newDamage;},
        setCost: function(newCost) {self.cost = newCost;},

        update: function(){
            if (towerCanBePlaced && !this.towerIsPlaced) {
                thisvar.input.on('pointermove', function(pointer){
                    if (towerCanBePlaced && !this.towerIsPlaced) {
                        this.setPosition(pointer.x,pointer.y);
                    }
                }, this);
                var dx = this.x - player.x;
                var dy = this.y - player.y;
                withinDistanceOfPlayer = Math.sqrt(dx*dx+dy*dy);
                if (withinDistanceOfPlayer >= 100){
                    this.tint = .9 * 0xffffff;
                } else {
                    this.tint = 0xffffff;
                }
            }
            thisvar.input.on('pointerdown', function (pointer) {
                if (towerCanBePlaced && !this.towerIsPlaced){
                    var dx = this.x - player.x;
                    var dy = this.y - player.y;
                    withinDistanceOfPlayer = Math.sqrt(dx*dx+dy*dy);
                    if (withinDistanceOfPlayer < 100) {
                        this.setPosition(pointer.x,pointer.y);
                        towerCanBePlaced = false;
                        this.towerIsPlaced = true;
                    }
                }
            }, this);


            if (this.towerIsPlaced) {
                player.gold -= 10;
                towerPos_X = this.x;
                towerPos_Y = this.y;
                thisProjectiles = this.projectiles;
                thisFireCounter = this.fireCounter;
                thisAttckSpeed = this.attack_speed;
                thisRange = this.range;

                enemyArray.forEach(function (enem) {
                    var dx = towerPos_X - enem.x;
                    var dy = towerPos_Y - enem.y;
                    distance = Math.sqrt(dx*dx+dy*dy);
                    if (distance<=thisRange){
                        if (thisFireCounter==0) {
                            proj = thisProjectiles.get();
                            if (proj) {
                                proj.fire(towerPos_X, towerPos_Y, enem.x, enem.y, enem);
                            }
                        }
                    }
                });
                this.fireCounter++;
                if (this.fireCounter >= thisAttckSpeed) {
                    this.fireCounter = 0;
                }
            }
        }

    });

    var player = new Phaser.Class({

        Extends: Phaser.GameObjects.Sprite,

        initialize: function(scene) {
            Phaser.GameObjects.Sprite.call(this,scene,100,100,'player');
            this.setScale(2,2);
            this.setActive(true);
            this.setVisible(true);
            this.gold = 10;
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

  towers = this.add.group({
    classType: tower,
    maxSize: 100,
    runChildUpdate: true
  })

  player = players.get();

  graphics = this.add.graphics();
  graphics.lineStyle(1, 0xffffff, 1);

  path.draw(graphics);

  ene= enemies.get();
  ene.run();
  enemyArray.push(ene);

}//end of create

function update ()
{
    if (b.isDown) {
        ene = enemies.get();
        ene.run();
        enemyArray.push(ene);
    }

    if (Phaser.Input.Keyboard.JustDown(t)){
        towerCanBePlaced = towerCanBePlaced ? false : true;
        towers.get();
    }
    
}//end of update