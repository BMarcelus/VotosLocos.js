const tagRegex = /<[^>]*>/g;
function preprocessText(text) {
  return text.replaceAll('|','').replaceAll(tagRegex,'')
}
class SimpleDialogue {
  constructor() {
    this.text= "";
    this.person = "";
    this.index= 0;
    this.impatience = 0;
    this.linewraps = [];
    this.textFont = "20px Arial";
    this.personFont = "25px Arial";
    this.maxLines = 3;
  }
  setText(obj,persist) {
    this.persist = persist;
    this.text = obj.text;
    this.person = obj.person;
    this.index = 0;//this.text.length;
    this.impatience = 0;
    this.done = false;
    if(obj.person) {
      this.talkSound = obj.person.talkSound;
      this.every = obj.person.every;
    } else {
      this.talkSound = null;
    }
    console.log(obj);
    this.updateLineWraps();
    this.currentLine = 0;
    this.currentLineOffset = 0;
    this.letterParser = null;
  }
  getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(preprocessText(currentLine + " " + word)).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}
  updateLineWraps() {
    canvas.font = this.textFont;
    this.lines = this.getLines(canvas, this.text, CE.width-CE.width/15);
  }
  reset() {
    this.index = 0;
  }
  processTag(tag) {
    // var args = tag.split(' ');
    // switch(args[0]) {
    //   case 'bam':

    //     break;
    // }
  }
  processChar(char) {
    if(char=="|") {

    }
  }
  increment() {
    
    var currentChar = this.lines[this.currentLine][this.index-this.currentLineOffset];
    this.currentChar = currentChar;
    if(currentChar == "<") {
      currentChar='';
      var c;
      while(this.index - this.currentLineOffset < this.lines[this.currentLine].length) {
        this.index += 1;
        c = this.lines[this.currentLine][this.index-this.currentLineOffset];
        if(c=='>') {
          this.processTag(currentChar);
          break;
        }
        currentChar += c;
      }
    }
    this.index += 1;
    if(this.index-this.currentLineOffset>this.lines[this.currentLine].length) {
      this.currentLineOffset += this.lines[this.currentLine].length;
      this.currentLine += 1;
    }
    this.processChar(this.currentChar);
    return currentChar;
  }
  update() {
    if(!this.lineCapReached) {
      if(this.index<this.text.length&&frameCount%2==0) {
        this.increment();
        if(this.talkSound) {
          if(this.every) {
            if((frameCount>>1)%this.every==0) {
              this.talkSound.play();
            }
          } else {
            this.talkSound.play();
          }
        }
      }
    } else {
    // if(this.index>=this.text.length) {
      this.impatience ++;
      // if(this.impatience>30&&this.scene.player.mx!=0) {
      //   this.done = true;
      // }
    }
  }
  progress() {
    if(this.lineCapReached) {
      if(this.lines.length>this.maxLines) {
        this.lines.shift();
        this.lines.shift();
        this.lines.shift();
        this.impatience = 0;
        this.index = 0;
        this.lineCapReached = false;
        return;
      }
    }
    if(this.index>=this.text.length) {
      this.done = true;
      if(this.callback)this.callback();
    } else {
      if(this.talkSound) {
        this.talkSound.play();
      }
      this.index = this.text.length;
    }

    
    // var currentIndex = 0;
    // for(var i=0;i<this.lines.length;i++) {
    //   var line = this.lines[i];
    //   if(this.index>currentIndex) {
    //     if(this.index-currentIndex<line.length){
    //       this.currentLine = i;
    //       this.currentLineOffset = 
    //     }
    //   }
    //   currentIndex += line.length;
    // }
  }
  draw() {
    if(this.text=='')return;
    // canvas.fillStyle = "#000000aa";
    canvas.fillStyle = "#000000";
    var h = CE.height*.25;
    var y = CE.height-h;
    var tagHeight = CE.height*.05;
    canvas.fillRect(0,y,CE.width,h);
    if(this.person) {
      canvas.fillRect(0,y-tagHeight,CE.width*.3,tagHeight);
    }
    canvas.fillStyle = "white";
    canvas.textBaseline = "top";
    canvas.font = this.personFont;
    canvas.textAlign = "left";
    if(this.person) {
      canvas.fillText(this.person.name, CE.width/50,y-tagHeight+CE.height*.02);
    }
    canvas.font = this.textFont;
    // var text = this.text.substring(0,this.index);

    var currentIndex = 0;
    var lineHeight = CE.height*.06;
    for(var i=0;i<this.lines.length&&i<this.maxLines;i++) {
      var line=this.lines[i];
      if(this.index>currentIndex) {
        var text = line;
        if(this.index-currentIndex<line.length){
          text = line.substring(0,this.index-currentIndex)
        }
        canvas.fillRichText(text, CE.width/30,y+lineHeight+i*lineHeight);
      }
      currentIndex += line.length;
    }
    this.lineCapReached = this.index>currentIndex;

    // this.lines.forEach((line,i)=>{
    //   if(this.index>currentIndex) {
    //     var text = line;
    //     if(this.index-currentIndex<line.length){
    //       text = line.substring(0,this.index-currentIndex)
    //     }
    //     canvas.fillText(text, CE.width/30,y+lineHeight/2+i*lineHeight);
    //   }
    //   currentIndex += line.length;
    // })
    // canvas.fillText(text1, CE.width/30,CE.height*.85);
    // canvas.fillText(text2, CE.width/30,CE.height*.9);
    
    if(this.impatience>60&&!this.persist&&frameCount%60<30) {
      var t = 'v';//.substring(0,this.impatience-60);
      canvas.textAlign = 'right';
      canvas.fillText(t, CE.width*.99,CE.height*.95);
    }
  }
}

class WaitForEnemyClear {
  constructor(scene) {
    this.scene = scene;
  }
  progress() {}
  update() {
    if(this.scene.enemyCount <=0)this.done=true;
  }
}

class WaitForFrames {
  constructor(frames) {
    this.frames = frames;
  }
  progress() {}
  update() {
    this.frames--;
    if(this.frames<0) {
      this.done = true;
    }
  }
}

class WaitForProximity {
  constructor(e1,e2,r) {
    this.e1=e1;
    this.e2=e2;
    this.r=r;
    this.done = false;
  }
  progress() {}
  update() {
    var dx = this.e1.x-this.e2.x;
    var dy = this.e1.y-this.e2.y;
    var r = Math.sqrt(dx*dx+dy*dy) 
    if(r<=this.r) {
      this.done = true;
    }
  }
}

class DialogueController {
  constructor(sequence, gameScene) {
    this.gameScene = gameScene;
    this.sequence = sequence;
    this.index = 0;
    this.done = false;
    this.current = null;
    this.simpleDialogue = new SimpleDialogue();
    this.simpleDialogue.scene = this.gameScene;
    if(sequence)
    this.processData(this.sequence[0]);
    this.lastSpeaker = null;
    this.conditions = [];
  }
  add(sequence) {
    this.setSequence(sequence);
  }
  setSequence(sequence, callback) {
    this.callback = callback;
    this.conditions = [];
    this.persist = false;
    this.simpleDialogue.text = '';
    this.done = false;
    this.current = null;
    this.sequence = sequence;
    this.index = 0;
    this.processData(this.sequence[0]);
  }
  processData(event) {
    if(event.setCondition) {
      this.conditions.push([event.setCondition, event.conditionTarget]);
    }
    if(event.fourthWall !=undefined) {
      this.fourthWall = event.fourthWall;
    }
    if(event.text) {
      this.simpleDialogue.setText(event, event.persist)
      this.current = this.simpleDialogue;
      if(event.person&&event.person.obj&&!event.doNotTarget) {
        this.gameScene.camera.target = event.person.obj;
        event.person.obj.isTalking = true;
        this.lastSpeaker = event.person.obj;
        if(event.zoom)this.gameScene.camera.targetZoom = event.zoom;
        // this.gameScene.camera.zoom = 2;
      }
      if(event.person) {
        this.speakerImage = event.person.image;
      }
      if(event.doNotWait) {
        this.simpleDialogue.progress();
        this.next();
      }
    }
    if(event.speakerImage) {
      this.speakerImage = event.speakerImage;
    }
    if(event.persist) {
      this.persist = true;
    }
    if(event.sceneTransition) {
      MainDriver.setScene(new event.scene());
    }
    if(event.screenShake) {
      this.gameScene.screenShake = event.screenShake;
    }
    if(event.sound) {
      event.sound.play();
    }
    if(event.spawn) {
      var x = (event.tx+0.5) * this.gameScene.level.cellWidth;
      var y = (event.ty+0.5) * this.gameScene.level.cellHeight;
      var e = this.gameScene.addEntity(new event.spawn(x,y));
      if(event.target) {
        this.gameScene.camera.target = e;
      }
    } else if(event.target) {
      this.gameScene.camera.target = event.target;
    }
    if(event.waitForProximity) {
      var e1 = this.gameScene.specialActors[event.e1];
      var e2 = this.gameScene.specialActors[event.e2];
      this.current = new WaitForProximity(e1,e2,event.r);
    }
    var entity;
    if(event.entity) {
      entity = this.gameScene.specialActors[event.entity];
    } else if(event.person&&event.person.obj) {
      entity = event.person.obj
    }
    if(event.set) {
      // var e = (event.person && event.person.obj)||this.gameScene.specialActors[event.entity];
      Object.assign(entity, event.set);
    }
    if(event.doA) {
      entity[event.doA]();
    }
    if(event.particles) {
      var num = event.particles.num;
      var color = event.particles.color;
      var w = 10;
      var h = 10;
      var life = 40;
      var grav = 0.4;
      for(var i=0;i<num;i++) {
        var vx = (Math.random()-0.5)*5;
        var vy = (Math.random()-0.5)*5-7;
        this.gameScene.addEntity(new Particle(entity.x+vx,entity.y+vy,w,h,color,vx,vy,life,grav));
      }
    }
    if(event.waitFor) {
      this.current = new WaitForFrames(event.waitFor);
    }
    if(event.nextLevel) {
      this.gameScene.loadNextLevel();
    }
    if(event.music) {
      MusicHandler.playMusic(event.music);
    }
    if(event.musicStop) {
      MusicHandler.stop();
    }
    if(event.fadeToBlack) {
      this.current = {update(){},draw(){},progress(){}};
      MainDriver.fadeToBlack(event.fadeToBlack, e=>{
        if(this.current)
          this.current.done = true;
        this.next()
      });
    }
    if(event.fadeIn) {
      this.current = {update(){},draw(){},progress(){}};
      MainDriver.fadeIn(event.fadeIn, e=>{
        if(this.current)
          this.current.done = true;
        this.next()
      });
    }
    if(event.waitForEnemyClear) {
      this.current = new WaitForEnemyClear(this.gameScene);
    }
    if(this.current == null) {
      this.next();
    }
    if(event.pausesOnClickOff!=undefined) {
      MainDriver.pausesOnClickOff = event.pausesOnClickOff;
      setTimeout(console.clear.bind(console),0);
      setTimeout(console.log.bind(console, "Hello this is the console. This is where you can type commands"),0);
    }
  }
  processCondition(con) {
    if(con.pxG) {
      if(this.gameScene.player.x>con.pxG)return true;
    }
    return false;
  }
  update() {
    for(var i=0;i<this.conditions.length;i++) {
      var con = this.conditions[i];
      if(this.processCondition(con[0])) {
        this.setSequence(GetDialogueData(this.gameScene, con[1]));
      }
    }
    if(this.current) {
      this.current.update();
      if(getButtonDown(Buttons.Confirm) || mouse.down) {
        this.current.progress();
      }
      if(this.current.done) {
        this.next()
      }
    }
    // if(this.index >= this.sequence.length) {
    //   this.done = true;
    //   return;
    // }
    // var current = this.sequence[this.index];
    // this.current = current;
    // current.update();
    // if(getButtonDown(Buttons.A)) {
    //   current.progress();
    // }
    // if(current.done) {
    //   this.next();
    // }
  }
  next() {
    if(this.lastSpeaker) {
      this.lastSpeaker.isTalking = false;
    }
    this.index += 1;
    if(this.index >= this.sequence.length) {
      this.done = true;
      if(this.callback)this.callback();
    } else {
      this.processData(this.sequence[this.index]);
    }
  }
  draw() {
    if(this.done&&!this.persist)return;
    // if(this.current&&this.current.draw)
      // this.current.draw();
      if(this.speakerImage) {
        canvas.drawImage(this.speakerImage, CE.width*.5, CE.height*.2,this.speakerImage.width*2,this.speakerImage.height*2);
      }
    this.simpleDialogue.draw();
  }
}