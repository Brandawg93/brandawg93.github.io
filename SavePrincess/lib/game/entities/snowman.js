ig.module(
    'game.entities.snowman'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntitySnowman = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/snowman.png', 16, 16),
        size: {x: 8, y: 16},
        offset: {x: 4, y: 0},
        flip: false,
        speed: 14,
        zIndex: 0,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        maxVel: {x: 100, y: 100},
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('walk', .07, [0]);
            if(this.pos.x > 2192 && this.pos.x + this.size.x < 2465 && this.pos.y > 128 && this.pos.y + this.size.y < 416) {
                this.size.y = 8;
            }
        },
        update: function() {
            var player = ig.game.getEntitiesByType( EntityPlayer )[0];
            var target = 0;
            if(player)
                target = player.pos.x;
            var xdir;
            var ydir = 10;
            
            //near an edge? return!
            if((!ig.game.collisionMap.getTile(
                this.pos.x + (this.flip ? + 4 : this.size.x - 4),
                    this.pos.y + this.size.y+1)
                )
            ) {
                this.flip = !this.flip;
            }

            if(Math.abs(target - this.pos.x) < 100) {
                if(target < this.pos.x)
                    this.flip = true;
                else
                    this.flip = false;


            }
            xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.currentAnim.flip.x = this.flip;
                        
            //water
            if(this.pos.x > 623 && this.pos.x < 945 && this.pos.y > 1376 && this.pos.y < 1489)
                this.kill();
            
            //topdown
            if(this.pos.x > 2192 && this.pos.x + this.size.x < 2465 && this.pos.y > 128 && this.pos.y + this.size.y < 416) {
                ydir = 0;
                this.gravityFactor = 0;
                if(player)
                    target = player.pos.y;
                if(Math.abs(target - this.pos.y) < 100) {
                    if(target < this.pos.y)
                        ydir = -1;
                    else
                        ydir = 1;
                }
            }
            
            this.vel.y = this.speed * ydir;
            this.parent();
        },
        check: function (other) {
            //jump on head
            if(this.pos.x > 2192 && this.pos.x + this.size.x < 2465 && this.pos.y > 128 && this.pos.y + this.size.y < 416) {
                other.receiveDamage(.1, this);
            } else {
                if (other.pos.y < this.pos.y - other.size.y + 1)
                    this.receiveDamage(10, this);
                else
                    other.receiveDamage(.1, this);
            }
        },
        handleMovementTrace: function(res) {
            this.parent(res);
            //collision with a wall? return!
            if(res.collision.x) {
                this.flip = !this.flip;
            }
        },
        kill: function (other) {
            this.parent();
            ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y, {colorOffset: 1});
        }
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
});