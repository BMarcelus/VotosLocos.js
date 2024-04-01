class Pickup {
  constructor(x,y) {
    this.x=x;
    this.y=y;
    this.dy = 0;
  }
  update() {
    this.dy = Math.cos(frameCount*Math.PI/20)*5;
    if(!this.scene)return;
    var player = this.scene.player;
    if(!player)return;
    var dx = player.x-this.x;
    var dy = player.y-this.y;
    var ds = Math.abs(dx)+Math.abs(dy);
    if(ds<20) {
      this.pickup(player);
    }
  }
  pickup() {
    SOUNDS.hit.play();
    this.shouldDelete = true;
  }
  draw() {
    canvas.save();
    canvas.translate(this.x,this.y+this.dy);
    if(this.drawable)this.drawable.draw();
    canvas.restore();
  }
}