
var ENEMIES = {
    RussianBot: '',
    QAnonShamon: '',
    MagaHatMarge: '',
    InternetTroll: '',
    CyberNinja: '',
}

var Environments = {
    Street: {
        tileImage: 'backgroundTileStreetSidewalk'
    },
    OfficeInterior: {
        tileImage: 'backgroundTileOfficeInterior',
        backgroundColor: 'tan',
        minYOffset: 200,
        width: 1000
    },
    Grass: {
        tileImage: 'backgroundTileGrass',
        backgroundColor: "#322f35"
    },
}

var BlockWalkDoor = {};
var BusStop = {};

function randomEnemies() {
    return {};
}

var LouChalibre = {
    name: "Lou Chalibre",
    image: IMAGES.LouChalibre,
    talkSound: SOUNDS.LouTalk,
    every: 3,
}


ImageLoader.onComplete( () => {
    LouChalibre.talkSound = SOUNDS.LouTalk;
    LouChalibre.image = IMAGES.LouChalibre;
});

// SOUNDS.onComplete( () => {
//     LouChalibre.talkSound = SOUNDS.LouTalk;
// });
var rallyTables = [
    {
        fullName: 'Get Out The Vote!',
        acronymn: "GOTV",
        rallyTableFront: ImageLoader.loadImage('rallyTables/getOutTheVote.png'),
    }
]


function rallyScene(scene, x=0) {
    {
        var deskImage =  new ImageDrawable(IMAGES.rallyTableBaseBack, 0,0);
        deskImage.w *= 3;
        deskImage.h *= 3;
        deskImage.y = -deskImage.h+60;
        var deskBack = scene.addEntity(new EntityTwoPointFiveD(450+x,160-60,0,deskImage))
    }
    {
        var deskImage =  new ImageDrawable(randomFromList(IMAGES.rallyTables), 0,0);
        deskImage.w *= 3;
        deskImage.h *= 3;
        deskImage.y = -deskImage.h;
        var desk = scene.addEntity(new EntityTwoPointFiveD(450+x,160,0,deskImage))
    }
    var npc = scene.addEntity(new HighFiver(520+x,100))
    // npc.shouldStartDiaolgueOnProximity = true;
    npc.dx = -1
    npc.getInputs = e=>{}
    npc.beHappy();
    npc.name = "Clerk"
    npc.canHighFive = false;
    npc.lookingAt = scene.players[0]
    npc.interactablesRange = 200;
    npc.onAfterDialogue = e=> {
    }
    npc.dialogue = [
        {person: npc, text: "Hi!||| would you like to support our cause?", zoom:2},
        {options:[
            {text: 'yes', sequence:[
                {person: npc, text: "Okay cool!"},
                {onStart: dia => {
                    npc.isInteractable = false;
                    scene.showGo = true;
                }}
            ]},
            {text: 'no', sequence:[{
                person: npc, text: "oh. okay"
            }]},
        ]},
    ]
}

var GameSequence;

window.addEventListener('load', function() {
    
GameSequence = [
    {
        name: "opening cutscene",
        music: SOUNDS.norteno,
        DialogueData: [
            {person: LouChalibre, text: "The time to <color red>vote</color> is <wiggle>approaching!"},
            {person: LouChalibre, text: "Are you ready to cast your ballot?"},
        ],
        continueOnDialogueFinish: true,
    },
    {
        name: "Level 1",
        Goal: "Get to The Registrar Office!",
        DialogueData: [
            {person: LouChalibre, text: "You're not registered to vote? Today is the last day!"},
            {person: LouChalibre, text: "Hurry! you better get to the Registrar Office!"},
            {person: LouChalibre, text: "Before its <wiggle>too||o|||o|||||o|||o|| l|||a|||t|||e!"},
        ],
        npcTexts: [
            "You haven't registered to vote yet? Cmon lets go!",
            "You're not registered yet? Its the last day!",
            "Lets get you to the registrar office!",
            "Oh the last day is today?, I need to register to vote too!",
            "The registrar office? Lets go!",
        ],
        spawnRandom: [
            [HighFiver, 10]
        ],
        levelData: {},
        // encounters: [
        //     {
        //         name: "First combat",
        //         Goal: "Defeat the enemies!",
        //         enemies: [
        //             ENEMIES.RussianBot,
        //             ENEMIES.QAnonShamon,
        //             ENEMIES.MagaHatMarge,
        //         ]
        //     },
        //     {
        //         name: "Registrar Office"
        //     }
        // ]
    },
    {
        name: "First combat",
        Goal: "Defeat the enemies!",
        music: SOUNDS.cumbia,
        DialogueData: [
            {music: SOUNDS.cumbia},
            {person: LouChalibre, text: "<bam>Uh Oh!"},
            {person: LouChalibre, text: "Watch out for the bots!"},
            {person: LouChalibre, text: "Press the [Attack] button to teach 'em a lesson"},
        ],
        spawnRandom: [
            [Bot, 4],
            [Putin, 1],
        ]
    },
    {
        name: "1-2",
        DialogueData: [], //give ballot cutscene
        spawnRandom: [
            // [KnockableDoor, 10],
            [Bot, 8],
            [Ninja, 3],
            // [Bot, 10],
        ]
    },
    {
        name: "Registrar Office Reached",
        Goal: "Enter the Registrar Office",
        music: SOUNDS.norteno,
        environment: Environments.Street,
        DialogueData: [
            {person: LouChalibre, text: "you made it to the Registrar office!"},
            // {text: "<color red> you received a ballot!"},
        ], //give ballot cutscene
        dontShowGo: true,
        onLoad: (scene) => {
            var office = scene.addEntity(
                new ImageDrawable(
                    ImageLoader.loadImage("RegistrarOffice.png",null, (img) => {
                        office.reInit();
                        office.w *= 4
                        office.h *= 4
                        window.office=office;
                        office.y=-office.h - 80
                        // scene.addEntity(new ItemPickup('Ballot', IMAGES.ballotItem, 600,100,64,64))
                        scene.addEntity(new EnterableDoor(office.x+office.w/2+30,-100,0));
                        scene.defaultZoom = 0.5
                        scene.cameraLerpSpeed = 40
                        // scene.camera.zoom = 0.5
                        scene.camera.offsetY = -200
                    }), 350,0))
            
        }
        
    },
    {
        name: 'Registrar Office Interior',
        Goal: "Get your ballot!",
        music: SOUNDS.cumbia,
        environment: Environments.OfficeInterior,
        spawnRandom: [
            [Ninja, 3]
        ],
        onLoad: (scene) => {
            scene.minY += 200
        }
    },
    {
        name: 'Registrar Office Interior',
        Goal: "Get your ballot!",
        music: SOUNDS.norteno,
        environment: Environments.OfficeInterior,
        onLoad: (scene) => {
            scene.minY += 200
            var deskImage =  new ImageDrawable(IMAGES.deskFront, 0,0);
            deskImage.w *= 3;
            deskImage.h *= 3;
            deskImage.y = -deskImage.h;
            var desk = scene.addEntity(new EntityTwoPointFiveD(450,160,0,deskImage))
            var npc = scene.addEntity(new HighFiver(500,100))
            // npc.shouldStartDiaolgueOnProximity = true;
            npc.dx = -1
            npc.getInputs = e=>{}
            npc.beHappy();
            npc.name = "Clerk"
            npc.canHighFive = false;
            npc.lookingAt = scene.players[0]
            npc.dialogue = [
                {person: npc, text: "Hi!||| are you here to receive your ballot?", zoom:2},
                {options:[
                    {text: 'yes', sequence:[
                        {person: npc, text: "Wow you were just in time, we were just about to close!"},
                        {person: npc, text: "Well, here you go!"},
                        {onStart: dia => {
                            npc.isInteractable = false;
                            var ballot = scene.addEntity(new ItemPickup('Ballot', IMAGES.ballotItem, 500,250,64,64))
                            // npc.shouldStartDiaolgueOnProximity = false;
                            ballot.afterPickup = e=>{
                                scene.showGo = true;
                            }
                        }}
                    ]},
                    {text: 'no', sequence:[{
                        person: npc, text: "oh. okay"
                    }]},
                ]},
            ]
            npc.onAfterDialogue = e=> {
            //     var ballot = scene.addEntity(new ItemPickup('Ballot', IMAGES.ballotItem, 500,250,64,64))
            //     ballot.afterPickup = e=>{
            //         scene.showGo = true;
            //     }
            }

            // scene.maxY -= 100
        }
    },
    {
        name: "Low Rider Transition",
        DialogueData: [
            {person: LouChalibre, text: "Hey bud, We're heading to the community rally"},
            {person: LouChalibre, text: "Need a ride?"},
            
        ],
        dontShowGo: true,
        onLoad: (scene) => {
            // var lowRider = scene.addEntity(new ImageDrawable(IMAGES.lowRider, 250,-100))
            // lowRider.w *= 3;
            // lowRider.h *= 3;
            var lowRider = scene.addEntity(new LowRider(150,-100))


            var door = scene.addEntity(new EnterableDoor(lowRider.x+250,lowRider.y+250,0));
            door.afterDialogue = () => {
                scene.loadNextLevel();
                player.hidden = false;
            }
            door.onInteract = player => {
                player.hidden = true;
                player.scene.dialogueController.speakerImage = null;
                player.x = lowRider.x + 300
                var dialogue = [
                    {onStart: () => {
                        lowRider.bouncing = true;
                        lowRider.update = () => {
                            lowRider.x += 10;
                            player.x += 10;
                            lowRider.frontOffset = Math.sin(frameCount * Math.PI/25);
                            lowRider.frontOffset = lowRider.frontOffset*lowRider.frontOffset*3;
                        }
                    }, waitFor: 120}
                ]
                player.scene.playDialogue(
                    dialogue, true, door.afterDialogue
                )
            }
        },
        // night: true,
    },
    {
        name: "Go to Community Rally",
        Goal: "Enter the Community Rally",
        environment: Environments.Street,
        levelData: {},
        width: 1000,
        spawnRandom: [
            [HighFiver, 5],
            [TrashCan, 1],
        ],
        onLoad: (scene) => {
            var office = scene.addEntity(new ImageDrawable(IMAGES.rallyBackgroundEntrance, 0,0))
            
            office.w *= 4
            office.h *= 2
            window.office=office;
            office.y=-office.h - 100
            // scene.addEntity(new ItemPickup('Ballot', IMAGES.ballotItem, 600,100,64,64))
            scene.addEntity(new EnterableDoor(office.x+office.w/2+30,-100,0));
            // scene.defaultZoom = 0.8
            // scene.cameraLerpSpeed = 40
            // // scene.camera.zoom = 0.5
            // scene.camera.offsetY = 0
        }
        
    },
    {
        name: "Community Rally - 1",
        Goal: "Join the cause",
        environment: Environments.Grass,
        levelData: {},
        width: 2000,
        spawnRandom: [
            // [HighFiver, 5],
            [TrashCan, 2],
        ],
        onLoad: (scene) => {
            rallyScene(scene,-100);
            rallyScene(scene, 400);
            rallyScene(scene, 900);
            for(var i=0;i<5;i++) {
                var x = Math.random()*2000;
                var y = 1000;
                scene.addEntity(new HighFiver(x,y))
            }
        }
    },
    {
        name: "Community Rally Fight",
        environment: Environments.Grass,
        music: SOUNDS.cumbia,
        spawnRandom: [
            // [Troll, 4],
            [TrashCan, 2],
        ],
        width: 5000,
        onLoad: (scene) => {
            rallyScene(scene,-100);
            rallyScene(scene, 400);
            rallyScene(scene, 900);


            rallyScene(scene,-100+3000);
            rallyScene(scene, 400+3000);
            rallyScene(scene, 900+3000);
            for(var i=0;i<5;i++) {
                var x = Math.random()*2000;
                var y = 1000;
                scene.addEntity(new HighFiver(x,y))
            }

            for(var i=0;i<5;i++) {
                var x = Math.random()*1000+2000;
                var y = 1000;
                scene.addEntity(new Troll(x,y))
            }
            for(var i=0;i<5;i++) {
                var x = Math.random()*500+2500;
                var y = 1000;
                scene.addEntity(new Bot(x,y))
            }
        }
    },
    {
        name: "Community Rally - 3",
        Goal: "Join the cause",
        music: SOUNDS.norteno,
        environment: Environments.Grass,
        levelData: {},
        spawnRandom: [
            [HighFiver, 5],
            [TrashCan, 5],
            [Bot, 4],
            [Ninja, 4],
            [Troll, 1],
        ],
        onLoad: (scene) => {
            rallyScene(scene);
        }
    },
    {
        name: "Community Rally - 4",
        environment: Environments.Grass,
        music: SOUNDS.cumbia,
        spawnRandom: [
            [Bot, 4],
            [Ninja, 4],
            [Troll, 1],
            [TrashCan, 5],
        ]
    },
    {
        name: "Community Rally - 5",
        Goal: "Join the cause",
        music: SOUNDS.norteno,
        environment: Environments.Grass,
        levelData: {},
        spawnRandom: [
            [HighFiver, 5],
            [TrashCan, 5],
        ],
        onLoad: (scene) => {
            rallyScene(scene);
        }
    },
    // {
    //     name: "Community Rally",
    //     Goal: "Talk to 5 tables",
    //     levelData: {},
    //     encounters: [
    //         {
    //             name :'table 1',
    //             DialogueData: [],
    //         },
    //         {
    //             name :'enemyEncounter',
    //             enemies: [
    //                 ENEMIES.InternetTroll,
    //                 ENEMIES.RussianBot,
    //             ]
    //         },
    //         {
    //             name :'table 2',
    //             DialogueData: [],
    //         },
    //         {
    //             name :'enemyEncounter',
    //             enemies: [
    //                 ENEMIES.RussianBot,
    //                 ENEMIES.CyberNinja,
    //             ]
    //         },{
    //             name :'table 3',
    //             DialogueData: [],
    //         },
    //         {
    //             name :'enemyEncounter',
    //             enemies: [
    //                 ENEMIES.InternetTroll,
    //                 ENEMIES.CyberNinja,
    //             ]
    //         },{
    //             name :'table 4',
    //             DialogueData: [],
    //         },
    //         {
    //             name :'enemyEncounter',
    //             enemies: [
    //                 ENEMIES.InternetTroll,
    //                 ENEMIES.RussianBot,
    //                 ENEMIES.CyberNinja,
    //                 ENEMIES.QAnonShamon,
    //                 ENEMIES.MagaHatMarge,
    //             ]
    //         },{
    //             name :'table 5',
    //             DialogueData: [],
    //         },
    //     ]
    // },
    {
        name :"Community Rally complete",
        environment: Environments.Grass,
        DialogueData: [
            {person: LouChalibre, text: "Its time for the march!"},
        
        ],
        continueOnDialogueFinish: true,
    },
    {
        name: "Rally March Transition",
        environment: Environments.Grass,
        notBlocking: true,
        music: SOUNDS.marchMusic,
        DialogueData: [
            {text: "wooo yeahh"},
            {waitFor: 620},
        ],
        // continueOnDialogueFinish: true,
        onLoad: scene => {
            scene.showGo = true;
            var w = scene.level.width/2;
            var h = scene.maxY - scene.minY;
            var is = 5;
            var js = 6;
            for(var i=0;i<is;i++) {
                for(var j=0;j<js;j++ ){
                    var x = w * (i+j/js)/is;
                    var y = scene.minY + j*h/js;
                    if(i==2&&j==3) {
                        scene.player.x = x;
                        scene.player.y = y;
                        continue;
                    };
                    var npc = scene.addEntity(new HighFiver(x,y))
                    npc.shouldSceneCollide = false;
                    npc.getInputs = ()=>{}
                    npc.mx = 0.5;
                    npc.speed = 2;
                }
            }
            scene.player.model.endAnim();
            scene.player.mx = 0.5;
            scene.player.speed = 2;
            scene.player.inputBlocked = true;
        }
    },
    {
        name: "Rally March Transition-2",
        notBlocking: true,
        DialogueData: [
            {waitFor: 620},
        ],
        // continueOnDialogueFinish: true,
        onLoad: scene => {
            var w = scene.level.width/2;
            var h = (scene.maxY - scene.minY)*.8;
            var sy = scene.minY + 100;
            var is = 5;
            var js = 5;
            scene.showGo = true;
            for(var i=0;i<is;i++) {
                for(var j=0;j<js;j++ ){
                    var x = w * (i+j/js)/is;
                    var y = sy + j*h/js;
                    if(i==2&&j==3) {
                        scene.player.x = x;
                        scene.player.y = y;
                        continue;
                    };
                    var npc = scene.addEntity(new HighFiver(x,y))
                    npc.shouldSceneCollide = false;
                    npc.getInputs = ()=>{}
                    npc.mx = 0.5;
                    npc.speed = 2;
                }
            }
            scene.player.model.endAnim();
            scene.player.mx = 0.5;
            scene.player.speed = 2;
            scene.player.inputBlocked = true;
        }
    },
    {
        name :"Block Walking Introduction",
        musicOff: true,
        // music: SOUNDS.norteno,
        debugStartWithThisOne: true,
        environment: Environments.Street,
        width: 5000,
        DialogueData: [
            {person: LouChalibre, text: 'Lets get the word out!'},
            {person: LouChalibre, text: 'Knock on some doors to spread the word!'},
        ],
        onLoad: scene =>{
            // scene.minY = 0;
            for(var i=0;i<12;i++) {
                scene.addEntity(new KnockableHouse((i+0.5)*400, scene.minY))
            }
            for(var i=0;i<4;i++) {
                scene.addEntity(new Ninja((i+0.5)*50+2000, 500))
            }
            for(var i=0;i<4;i++) {
                scene.addEntity(new Bot((i+0.5)*50+2000, 200))
            }
            for(var i=0;i<8;i++) {
                scene.addEntity(new Troll((i+0.5)*50+3000, 500))
            }
            for(var i=0;i<8;i++) {
                scene.addEntity(new Troll((i+0.5)*50+3000, 200))
            }
            
        }

    },
    {
        name :"Block Walking",
        Goal :"Knock on 10 doors",
        ecnouters: [
            BlockWalkDoor,
            randomEnemies(),
            BlockWalkDoor,
            randomEnemies(),
            BlockWalkDoor,
            randomEnemies(),
            BlockWalkDoor,
            randomEnemies(),
            BlockWalkDoor,
            randomEnemies(),
            BlockWalkDoor,
            randomEnemies(),
            BlockWalkDoor,
            randomEnemies(),
            BlockWalkDoor,
            randomEnemies(),
            BlockWalkDoor,
            randomEnemies(),
            BlockWalkDoor,
            BusStop,
        ]
    },
    {
        name: "Bus Transition"
    },
    {
        name: "To The Polling Station",
        Goal: "Get to the Polling Station!",
        encounters: [
            BusStop, 
            {name: "blockade"},
            {name: "enemy swarm"},
            {name: "polling station"},
        ]
    },
    {
        name: "Boss cutscene"
    },
    {
        name: "Boss Fight"
    },
    {
        name: "Vote Cutscene"
    }

]

})