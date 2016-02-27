ig.module(
    'game.entities.player'
)
.requires(
    'impact.entity'
)
.defines(function() {
    var lastInput = 'right';
    var numOfJumps = 0;
    var water = false;
    var topDown = false;
    var slam = false;
    EntityPlayer = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/player2.png', 16, 16),
        size: {x: 8, y: 13},
        offset: {x: 4, y: 2},
        flip: false,
        invincible: true, 
        invincibleDelay: 2, 
        invincibleTimer:null,
        //startPosition: null,
        maxVel: {x: 100, y: 100},
        //friction 600 is normal
        friction: {x: 100, y: 0},
        accelGround: 400,
        accelAir: 200,
        jump: 200,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.NONE,
        collides: ig.Entity.COLLIDES.ACTIVE,
        zIndex: 1,
        init: function( x, y, settings ) {
            this.startPosition = {x:x, y:y};
            this.parent( x, y, settings );
            //Add the animations
            this.addAnim ( 'idle', 1, [0] );
            this.addAnim ( 'run', 0.07, [0,1,2,3,4,5]);
            this.addAnim ( 'jump', 1, [8]);
            this.addAnim ( 'fall', 0.4, [6,7]);
            this.addAnim ( 'climb', 0.1, [0, 8]);
            this.addAnim ( 'shoot', 1, [9]);
            this.invincibleTimer = new ig.Timer();
            this.makeInvincible();
        },
        update: function () {
            var x = Math.random().map( 0, 1, this.pos.x, this.pos.x + this.size.x );
            var y = Math.random().map( 0, 1, 16, 16 + this.size.y );
            //move left or right
            var accel = this.standing ? this.accelGround : this.accelAir;
                        
            if( ig.input.state('left') ) {
                this.accel.x = -accel;
                this.flip = true;
            } else if(ig.input.state('right')) {
                this.accel.x = accel;
                this.flip = false;
            } else {
                this.accel.x = 0;
            }
            //jump
            if(this.standing && ig.input.pressed('jump') && this.gravityFactor == 1 && !water && !topDown) {
                this.vel.y = -this.jump;
            }
            
            //double jump
            if(this.accelAir && ig.input.pressed('jump') && this.gravityFactor == 1 && !water && !topDown) {
                if(numOfJumps == 0) {
                    this.vel.y = -this.jump;
                    numOfJumps += 1;
                }
            }
            if(this.standing) {
                this.maxVel.y = 100;
                numOfJumps = 0;
            }
            
            //shoot
            if(ig.input.pressed('shoot') && !water) {
                ig.game.spawnEntity(EntityBullet, this.pos.x, this.pos.y, {flip:this.flip});
            }
            
            //fly
            if(ig.input.state('fly') && !topDown) {
                this.vel.y += -this.jump;
            }
            
            //water
            if(this.pos.x > 623 && this.pos.x < 945 && this.pos.y > 1376 && this.pos.y < 1489) {
                water = true;
                this.gravityFactor = .01;
                this.maxVel.y = 15;
                this.maxVel.x = 10;
                if(ig.input.state('up')) {
                    this.vel.y -= 1;
                }
                else if(ig.input.state('down')) {
                    this.vel.y += 1;
                }
            } else {
                water = false;
                this.gravityFactor = 1;
                this.maxVel.y = 100;
                this.maxVel.x = 100;
            }
            
            //slam!
            if(this.accelAir && numOfJumps == 1) {
                if(ig.input.state('down')) {
                    slam = true;
                    this.maxVel.y = 1500;
                    this.accel.y = 1500;
                }
            }
            //slam animation
            if(slam && this.standing) {
                ig.game.spawnEntity(EntitySlamExplosion, this.pos.x, this.pos.y, {colorOffset: 1});
                slam = false;
            }
            
            this.currentAnim.flip.x = this.flip;
            
            if(this.invincibleTimer.delta() > this.invincibleDelay) {
                this.invincible = false;
                this.currentAnim.alpha = 1;
            }
            
            //top down level
            if(this.pos.x > 2192 && this.pos.x + this.size.x < 2465 && this.pos.y > 128 && this.pos.y + this.size.y < 416) {
                topDown = true;
                this.gravityFactor = 0;
                this.friction.y = 100;
                if(ig.input.state('up')) {
                    this.accel.y = -accel;
                }
                if(ig.input.state('down')) {
                    this.accel.y = accel;
                }
                if(this.vel.y != 0) {
                    this.currentAnim = this.anims.run;
                }
                else if(this.vel.x > 0) {
                    this.currentAnim = this.anims.run;
                    this.flip = false;
                }
                else if(this.vel.x < 0) {
                    this.currentAnim = this.anims.run;
                    this.flip = true;
                } else if(ig.input.state('shoot')) {
                    this.currentAnim = this.anims.shoot;
                }
                else {
                    this.currentAnim = this.anims.idle;
                }
                                
            } else {
            //animations
            if(this.vel.y < 0)
                this.currentAnim = this.anims.jump;
            else if(this.vel.y > 0)
                this.currentAnim = this.anims.fall;
            else if(this.vel.x != 0)
                this.currentAnim = this.anims.run;
            else if(ig.input.state('shoot'))
                this.currentAnim = this.anims.shoot;
            else
                this.currentAnim = this.anims.idle;
            }
            
            this.parent();
        },
        makeInvincible: function() {
            this.invincible = true;
            this.invincibleTimer.reset();
        },
        receiveDamage: function(amount, from) {
            if(this.invincible)
                return;
            this.parent(amount, from);
        },
        draw: function() {
            if(this.invincible)
                this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1;
            this.parent();
        },
        handleMovementTrace: function(res) {
            //climb
            if(res.collision.x) {
                // IF COLLIDING WITH A WALL DO THIS
                if(ig.input.state('up')) {
                    this.currentAnim = this.anims.climb;
                    if(ig.input.state('left')) {
                        this.currentAnim.flip.x = true;
                    }
                    else {
                        this.currentAnim.flip.x = false;
                    }
                    this.gravityFactor = 0;
                    this.friction.y = 600;
                    this.accel.y = -400;
                } else if(ig.input.state('down')) {
                    this.accel.y = 400;
                    this.friction.y = 600;
                    this.gravityFactor = 0;
                } else {
                    this.accel.y = 0;
                }
            } else {
                this.accel.y = 0;
                this.friction.y = 0;
                this.gravityFactor = 1;
            }
            this.parent(res); 
        },
        kill: function() {
            this.parent();
                var x = this.startPosition.x;
                var y = this.startPosition.y;
            ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {callBack: this.onDeath(x, y)});
        },
        onDeath: function(x, y) {
            ig.game.lives --;
            if(ig.game.lives <= 0) {
                ig.game.gameOver();
            } else {
                setTimeout(function() {
                    ig.game.spawnEntity(EntityPlayer, x, y)
                }, 1000);
            }
        },
    });
    EntityDeathExplosion = ig.Entity.extend({
        lifetime: 1,
        callBack: null,
        particles: 25,
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            for(var i = 0; i < this.particles; i++)
                ig.game.spawnEntity(EntityDeathExplosionParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
            this.idleTimer = new ig.Timer();
        },
        update: function() {
            if(this.idleTimer.delta() > this.lifetime) {
                this.kill();
                if(this.callBack)
                    this.callBack();
                return;
            }
        }
    });
    EntityDeathExplosionParticle = ig.Entity.extend({
        size: {x: 2, y: 2},
        maxVel: {x: 160, y: 200},
        lifetime: 2,
        fadetime: 1, 
        bounciness: 0,
        vel: {x: 100, y: 30},
        collides: ig.Entity.COLLIDES.LITE,
        colorOffset: 0,
        totalColors: 7,
        animSheet: new ig.AnimationSheet('media/blood.png', 2, 2),
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors + 1));
            this.addAnim('idle', .2, [frameID]);
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
            if(this.pos.x > 2192 && this.pos.x + this.size.x < 2465 && this.pos.y > 128 && this.pos.y + this.size.y < 416) {
                this.gravityFactor = 0;
            }
        },
        update: function() {
            if(this.idleTimer.delta() > this.lifetime) {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(this.lifetime - this.fadetime, this.lifetime, 1, 0);
            this.parent();
        },
    });
    EntitySlamExplosion = ig.Entity.extend({
        lifetime: 1,
        callBack: null,
        particles: 25,
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            for(var i = 0; i < this.particles; i++)
                ig.game.spawnEntity(EntitySlamExplosionParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
            this.idleTimer = new ig.Timer();
        },
        update: function() {
            if(this.idleTimer.delta() > this.lifetime) {
                this.kill();
                if(this.callBack)
                    this.callBack();
                return;
            }
        }
    });
    EntitySlamExplosionParticle = ig.Entity.extend({
        size: {x: 2, y: 2},
        maxVel: {x: 160, y: 200},
        lifetime: 2,
        fadetime: 1, 
        bounciness: 0,
        vel: {x: 100, y: 30},
        collides: ig.Entity.COLLIDES.LITE,
        checkAgainst: ig.Entity.TYPE.B,
        colorOffset: 0,
        totalColors: 7,
        animSheet: new ig.AnimationSheet('media/blood.png', 2, 2),
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            var frameID = Math.round(Math.random()*this.totalColors) + (this.colorOffset * (this.totalColors + 1));
            this.addAnim('idle', .2, [frameID]);
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
        },
        update: function() {
            if(this.idleTimer.delta() > this.lifetime) {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(this.lifetime - this.fadetime, this.lifetime, 1, 0);
            this.parent();
        },
        check: function (other) {
            other.receiveDamage(1, this);
            this.kill();
        },
    });
    EntityBullet = ig.Entity.extend({
        size: {x: 5, y:3 },
        animSheet: new ig.AnimationSheet( 'media/bullet.png', 7, 7),
        //change this later
        maxVel: {x: 200, y: 200},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        init: function(x, y, settings) {
            this.parent(x + (settings.flip ? -4 : 8), y + 8, settings);
            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.vel.y = -100;
            this.addAnim( 'idle', 0.2, [0]);
        },
        handleMovementTrace: function(res) {
            this.parent(res);
            if(res.collision.x || res.collision.y) {
                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {colorOffset: 1});
                this.kill();
            }
        },
        check: function(other) {
            other.receiveDamage(3, this);
            this.kill();
        },
    });
});