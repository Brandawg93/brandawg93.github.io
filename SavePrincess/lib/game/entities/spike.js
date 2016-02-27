ig.module(
    'game.entities.spike'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntitySpike = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/spike.png', 16, 16),
        size: {x: 16, y: 15},
        offset: {x: 0, y: 1},
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.PASSIVE,
        maxVel: {x: 0, y: 0},
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', .07, [0]);
        },
        update: function() {
            this.parent();
        },
        check: function (other) {
            other.receiveDamage(10, this);
        }
    });
});