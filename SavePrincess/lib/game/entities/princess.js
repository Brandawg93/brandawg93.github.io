ig.module(
    'game.entities.princess'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntityPrincess = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/princess.png', 16, 16),
        size: {x: 16, y: 8},
        flip: false,
        zIndex: 0,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        maxVel: {x: 0, y: 0},
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', .07, [0]);
        },
        update: function() {
            if(this.health < 10)
                this.health = 10;
            this.parent();
        },
    });
});