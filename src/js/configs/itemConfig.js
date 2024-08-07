var ITEMS = {};
function drawImage(canvas) {
    var s = this.scale || 1;
    var w = this.image.width*s;
    var h = this.image.height*s;
    canvas.drawImage(this.image,-w/2,-h/2,w,h);
}
function createItemDrop(x,y,item, count) {
    var drop = new ItemPickup(item.name, item.image, x,y);
    drop.setItemType(item, count);
    return drop
}
window.addEventListener('load', function() {
    IMAGES.thrownFlag = ImageLoader.loadImage('Items/flag.png')
    ITEMS.flag = {
        damage: 10,
        name: 'Flags',
        throwable: true,
        frameCount:0,
        image: IMAGES.thrownFlag,
        drawShape(canvas, speed=1){
            var sx = 1;
            var sy = 1;
            if(this.vx<0) sx=-1;

            var f = Math.floor(this.frameCount*speed/4);
            if(f%4>1)sy=-1;
            canvas.scale(sx,sy)
            var frame = f%2;
            var w = 32*2;
            var h = 32*2;
            canvas.drawImage(IMAGES.thrownFlag, 32*frame,0,32,32,-w/2,-h/2,w,h);
        }
    }
    ITEMS.taco = {
        name: 'Tacos',
        throwable: false,
        onUse: player => {
            player.heal(15)
        },
        image: IMAGES.taco = ImageLoader.loadImage('Items/Taco3.png'),
        drawShape: drawImage
    }
    ITEMS.sodaBottle = {
        name: 'Soda Bottles',
        damage: 10,
        throwable: true,
        image: IMAGES.sodaBottle = ImageLoader.loadImage('Items/sodaBottle.png'),
        drawShape: (canvas, speed=1) => {
            var w = 32*2;
            var h = 32*2;
            canvas.rotate(frameCount*speed*Math.PI/5)
            canvas.drawImage(IMAGES.sodaBottle,-w/2,-h/2,w,h);
        }
    }
    ITEMS.shuriken = {
        name: 'Ninja Stars',
        damage: 10,
        throwable: true,
        image: IMAGES.shuriken = ImageLoader.loadImage('Items/shuriken3-2.png'),
        drawShape(canvas, speed=1){
            var w = 32*2;
            var h = 32*2;
            var sx = 1;
            var sy = 1;
            if(this.vx<0) sx=-1;
            // var f = Math.floor(this.frameCount*speed/4);
            // if(f%4>1)sy=-1;
            canvas.scale(sx,sy)
            canvas.rotate(frameCount*Math.PI/10*speed)
            canvas.drawImage(IMAGES.shuriken,-w/2,-h/2,w,h);
        }
    }
    ITEMS.kunai = {
        name: 'Kunai',
        throwable: true,
        damage: 10,
        image: IMAGES.kunai = ImageLoader.loadImage('Items/kunai.png'),
        drawShape(canvas, speed=1) {
            var w = 32*2;
            var h = 32*2;
            var sx = 1;
            var sy = 1;
            if(this.vx<0) sx=-1;
            // var f = Math.floor(this.frameCount*speed/4);
            // if(f%4>1)sy=-1;
            canvas.scale(sx,sy)
            canvas.drawImage(IMAGES.kunai,-w/2,-h/2,w,h);
        }
    }
    ITEMS.ballot = {
        name: "Ballot",
        throwable: true,
        damage: 0,
        image: IMAGES.ballotItem,
        onThrow: (proj, thrower) => {
            proj.vx = 0;
            proj.vz = -20;
            proj.grav = 1;
            proj.dt = Math.PI/10;
            proj.shouldUpdateInDialogue=true;
            proj.y-=20
            proj.life = 50;
        },
        drawShape: drawImage
    }
})