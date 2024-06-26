class ItemPickup extends ImageDrawable {
    constructor(itemName, image, x,y,w,h) {
        super(image, x,y,w,h);
        this.z=0;
        this.itemName = itemName;
        this.image = image;
    }
    onPickup() {
        this.shouldDelete = true;
        this.scene.playDialogue(
            [
                {text: "<color red>you got a " + this.itemName, zoom: 2},
                // {person: this, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in congue erat. Suspendisse nunc ligula, sollicitudin sit amet varius ut, laoreet nec eros. Sed nec leo rutrum, volutpat felis a, varius tellus. Vivamus eu facilisis quam. Nam laoreet sodales commodo. Nunc in semper odio. Ut auctor eros volutpat urna feugiat, tempus auctor urna bibendum. Cras sodales justo non volutpat vestibulum. Morbi vitae tincidunt odio. Curabitur gravida magna non dignissim mollis. Etiam blandit mauris ut sapien venenatis, quis ultrices diam tristique. Proin metus arcu, sagittis ac laoreet at, bibendum non odio."}
                // {person: this, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in congue erat. Suspendisse nunc ligula, sollicitudin sit amet varius ut, laoreet nec eros. Sed nec leo rutrum, volutpat felis a, varius tellus. Vivamus eu facilisis quam. Nam laoreet sodales commodo. Nunc in semper odio. Ut auctor eros volutpat urna feugiat, tempus auctor urna bibendum. Cras sodales justo non volutpat vestibulum. Morbi vitae tincidunt odio. Curabitur gravida magna non dignissim mollis. Etiam blandit mauris ut sapien venenatis, quis ultrices diam tristique. Proin metus arcu, sagittis ac laoreet at, bibendum non odio."}
            ],true, this.afterPickup
        )
        var i = this.scene.items.indexOf(this);
        if(i>=0)
            this.scene.items.splice(i,1);
    }
    update() {
        this.scene.players.forEach(p => {
            var dx = p.x - (this.x + this.w/2);
            var dy = p.y - (this.y + this.h/2);
            var adx = Math.abs(dx);
            var ady = Math.abs(dy);
            if(adx<this.w/2 && ady < this.h/2) {
                this.onPickup();
            }
        })
    }
    setScene(scene) {
        this.scene=scene;
        this.scene.items.push(this);
    }
    draw(canvas) {
        if(this.hidden)return;
        if(!this.image)return;
        canvas.drawImage(this.image,this.x,this.y-this.h+this.z,this.w,this.h);
      }
}