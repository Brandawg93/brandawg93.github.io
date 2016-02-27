ig.module(
    'game.entities.drawbridge'
)
.requires(
    'impact.entity'
)
.defines(function() {
    var rotate = false;
    var rotationDone = false;
    EntityDrawbridge = ig.Entity.extend({
        _wmScalable: true,
        size: {x: 208, y: 16},
        animSheet: new ig.AnimationSheet( 'media/drawbridge.png', 208, 16),
        type: ig.Entity.TYPE.B,
        maxVel: {x: 0, y: 0},
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NONE,
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', .07, [0]);
        },
        update: function() {
            var player = ig.game.getEntitiesByType( EntityPlayer )[0];
            var target = 0;
            if(player)
                target = player.pos.x;
            this.currentAnim.pivot.x = 208;
            this.currentAnim.pivot.y = 8;
            //rotate the drawbridge
            if(Math.abs(target - this.pos.x) < 100) {
                rotate = true;
                this.draw();
            }
            if(rotate && this.currentAnim.angle <= 1.5708)  {
                this.currentAnim.angle += Math.PI/9 * (ig.system.tick*2);
                if(this.currentAnim.angle >= 1.5708) {
                    rotationDone = true;
                }
            } else {
                this.currentAnim.pivot.x = 0;
                this.currentAnim.pivot.y = 8;
            }
            if(rotationDone) {
                this.pos.x += 208;
                this.pos.y -= 208;
                rotationDone = false;
            }
            this.parent();
        },
    });
});
