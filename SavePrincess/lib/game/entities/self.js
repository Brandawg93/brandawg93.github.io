ig.module(
    'game.entities.self'
)
.requires(
    'impact.entity'
)
.defines(function() {
    EntitySelf = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/self.png', 16, 16),
        size: {x: 8, y: 14},
        offset: {x: 4, y: 2},
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            //Add the animations
            this.addAnim ( 'idle', .2, [0, 1, 2, 3, 4] );
        },
        update: function() {
            this.parent();
        },
    });
});