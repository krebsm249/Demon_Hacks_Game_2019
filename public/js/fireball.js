export class fireball{
    static fireball(){
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
    
  });}}
