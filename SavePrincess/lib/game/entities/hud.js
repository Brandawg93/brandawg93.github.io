ig.module(
    'game.entities.hud'
)
.requires(
    'impact.entity'
)
.defines(function() {
    var change = true;
    var lives = 5;
    EntityHud = ig.Entity.extend({
        size: {x: 320, y: 20},
        animSheet: new ig.AnimationSheet( 'media/hud.png', 73, 20),
        zIndex: 5,
        collides: ig.Entity.COLLIDES.NEVER,
        gravityFactor: 0,
        init: function( x, y, settings ) {
            this.parent( x, y, settings );
            this.pos.x=ig.game.screen.x;
            this.pos.y=ig.game.screen.y;
            this.addAnim('idle', .07, [0]);
            this.addAnim('four', .07, [1]);
            this.addAnim('three', .07, [2]);
            this.addAnim('two', .07, [3]);
            this.addAnim('one', .07, [4]);
        },
        update: function(){
            this.pos.x=ig.game.screen.x + 1;
            this.pos.y=ig.game.screen.y + 1;
            
            //updates player's lives (var lives)
            var lives = ig.game.lives;
            if(lives == 4) {
                this.currentAnim = this.anims.four;
            } else if(lives == 3) {
                this.currentAnim = this.anims.three;
            } else if(lives == 2) {
                this.currentAnim = this.anims.two;
            } else if(lives == 1) {
                this.currentAnim = this.anims.one;
            }
            this.parent();
        },
    });
});
