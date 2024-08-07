class AdditiveScene extends Scene {
    constructor(prevScene) {
        super();
        this.prevScene = prevScene;
        this.isAdditiveScene = true;
        this.drawsPrevscene = prevScene!=null;
        this.drawsPanel = true;
        this.updatesPrevious = false;
        this.panelColor = "#333e";
        this.timeOut = 2;
    }
    update() {
        if(this.updatesPrevious)this.prevScene.update();
        if(this.timeOut>0) {
            this.timeOut -= 1;
            return;
        }
        if(getButtonDown(Buttons.pause)) {
            this.back();
        }
        super.update();
    }
    back() {
        this.driver.setScene(this.prevScene);
    }
    draw(canvas) {
        if(this.drawsPrevscene) {
            this.prevScene.draw(canvas);
        }
        if(this.drawsPanel) {
            canvas.fillStyle = this.panelColor;
            canvas.fillRect(0,0,CE.width,CE.height);
        }
        super.draw(canvas);
    }
}