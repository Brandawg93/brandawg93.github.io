ig.module(
    'game.entities.swing'
)
.requires(
    'impact.entity'
)
.defines(function() {
    var spawned = false;
    var flip = false;
    var velocity = .1;
    EntitySwing = ig.Entity.extend({
        size: {x:4, y: 16},
        partitions: 7,
        friction: {x: 100, y: 100},
        animSheet: new ig.AnimationSheet( 'media/swing.png', 4, 16),
        gravityFactor: 0,
        init: function(x, y, settings) {
            this.parent(x, y, settings);
            this.addAnim('idle', .07, [0]);
        },
        update: function() {
            if(!spawned) {
                for(var i = 0; i < this.partitions; i++) {
                    var lastPartition = ig.game.getEntitiesByType(  EntitySwing )[i];
                    if(lastPartition) {
                        var partition = ig.game.spawnEntity(EntitySwing, lastPartition.pos.x, lastPartition.pos.y + lastPartition.size.y);
                        partition.gravityFactor = 1;
                        partition.currentAnim.pivot.y = 0;
                    }
                }
                    spawned = true;
            } else {
                for(var i = 0; i <= this.partitions; i++) {
                    var lastPartition = ig.game.getEntitiesByType(  EntitySwing )[i-1];
                    var partition = ig.game.getEntitiesByType(  EntitySwing )[i];
                    if(lastPartition) {
                        if(partition.currentAnim.angle > 1.5 || partition.currentAnim.angle < -1.5) {
                            flip = !flip;
                        }
                        if(flip) {
                            
                            partition.currentAnim.angle += Math.PI/9 * (ig.system.tick * i * velocity);
                        } else {
                            partition.currentAnim.angle -= Math.PI/9 * (ig.system.tick * i * velocity);
                        }
                        partition.pos.x = lastPartition.pos.x + (Math.sin(lastPartition.currentAnim.angle * -1) * this.size.y);
                        partition.pos.y = lastPartition.pos.y + (Math.cos(lastPartition.currentAnim.angle * -1) * this.size.y);
                    }
                }
            }
            this.parent();
        },
        handleMovementTrace: function(res) {
            if(res.collision.x || res.collision.y) {
                
            }
        },
    });
});