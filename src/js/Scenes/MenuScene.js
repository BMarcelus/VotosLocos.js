class MenuScene extends Scene {
  constructor() {
    super();
    this.useTouchAsMouse = true;
    MusicHandler.playMusic(SOUNDS.norteno);
    for(var i=0;i<10;i++) {
      var x = CE.width*Math.random();
      var y = CE.height*Math.random()/4;
      var cloud = this.addEntity(new ImageDrawable(IMAGES.cloud, x,y))
      cloud.vx = Math.random();
      cloud.update = function() {
        this.x += this.vx;
        if(this.x-this.w>CE.width) this.x=-this.w*2;
      }
    }
    this.addEntity(new DrawableText("VOTOS LOCOS", 0.5,0.3,0.8,0.3,0.2))
      .setTrueCoords(false)
      // .center()
      .color(255,255,255)
    this.addSelectableButton(new ButtonUI("PLAY", 0.5,0.7, 0.4,0.1,0.05,e=>{
      // console.log('pressed');
      MainDriver.setScene(new CharacterCustomizerScene());
      // MainDriver.setScene(new GameSceneBasic());
    })).center().color(250,250,250).setSelected();
    this.addSelectableButton(new ButtonUI("OPTIONS", 0.5,0.8, 0.4,0.1,0.05,e=>{
      MainDriver.setScene(new OptionsScene(this));
      // MainDriver.setScene(new GameSceneBasic());
    })).center().color(250,250,250);
    this.buttonsDown.push(
      [Buttons.pause, b=>this.driver.setScene(new OptionsScene(this))],
      [Buttons.start, b=>this.driver.setScene(new CharacterCustomizerScene())],
      [Buttons.cheatForward, b=>this.driver.setScene(new CharacterCustomizerScene())],
    )

    
  }
}