ig.module( 
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
    'game.levels.splash',
    'game.levels.level1',
    'game.levels.level2',
    'game.levels.level3',
    'game.levels.end',
    'game.levels.gameover'
)
.defines(function(){
    var tileWidth = 16;
MyGame = ig.Game.extend({
    
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	lives: 5,
	gravity: 300,
	init: function() {
		// Initialize your game here; bind keys etc.
        this.loadLevel( LevelSplash );
        //Bind keys
        ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
        ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
        ig.input.bind(ig.KEY.SPACE, 'jump');
        ig.input.bind(ig.KEY.C, 'shoot');
        ig.input.bind(ig.KEY.R, 'release');
        ig.input.bind(ig.KEY.F, 'fly');
        ig.input.bind(ig.KEY.UP_ARROW, 'up');
        ig.input.bind(ig.KEY.DOWN_ARROW, 'down');
        this.screen.y = 1000;
	},
	
	update: function() {
        // screen follows the player
        var player = this.getEntitiesByType( EntityPlayer )[0];
        if( player ) {
            //splash screens
            if(player.pos.x < 330 && player.pos.y < 250) {
                this.screen.x = 0;
                this.screen.y = 0;
            } else {
                this.screen.x = player.pos.x - ig.system.width/2;
                this.screen.y = player.pos.y - ig.system.height/2;
            }
            //level 2
            if(player.pos.x > 3000 && this.screen.x < 3057) {
                this.screen.x = 3056;
            } else if(player.pos.x > 3000 && this.screen.x + ig.system.width > 3775) {
                this.screen.x = 3776 - ig.system.width;
            }
            if(player.pos.x > 3000 && this.screen.y < 657) {
                this.screen.y = 656;
            } else if(player.pos.x > 3000 && this.screen.y + ig.system.height > 1279) {
                this.screen.y = 1280 - ig.system.height;
            }
        }
        //stop screen at edges
        if(this.screen.x < 0) {
            this.screen.x = 0;
        }

		// Update all entities and backgroundMaps
		this.parent();
	},	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		
		var x = ig.system.width/2,
			y = ig.system.height/2;
	},
    gameOver: function() {
        this.loadLevel( LevelGameover );
    }
});

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
