var global = require('Globals');

cc.Class({
    extends: cc.Component,

    properties: {
        audio: {
            default: [],
            type: cc.AudioClip,
        }
    },

    onLoad() {
        this.clickSound();
        this.tool1Sound();
        this.tool2Sound();
        this.tool3Sound();
        this.winSound();
        this.failSound();
        this.boomSound();
        this.goodSound();
        this.coolSound();
        this.greatSound();
    },

    clickSound () {
        cc.director.on('clickSound', function (event){
            if(this.audio){
                this.play(this.audio[0]);
            }
        }.bind(this))
    },

    tool1Sound() {
        cc.director.on('tool1Sound', function (event){
            if(this.audio){
                this.play(this.audio[1]);
            }
        }.bind(this))
    },

    tool2Sound() {
        cc.director.on('tool2Sound', function (event){
            if(this.audio){
                this.play(this.audio[2]);
            }
        }.bind(this))
    },

    tool3Sound() {
        cc.director.on('tool3Sound', function (event){
            if(this.audio){
                this.play(this.audio[3]);
            }
        }.bind(this))
    },

    winSound() {
        cc.director.on('winSound', function (event){
            if(this.audio){
                this.play(this.audio[4]);
            }
        }.bind(this))
    },

    failSound() {
        cc.director.on('failSound', function (event){
            if(this.audio){
                this.play(this.audio[5]);
            }
        }.bind(this))
    },

    boomSound() {
        cc.director.on('boomSound', function (event){
            if(this.audio){
                this.play(this.audio[6]);
            }
        }.bind(this))
    },
    
    goodSound() {
        cc.director.on('goodSound', function (event){
            if(this.audio){
                this.play(this.audio[7]);
            }
        }.bind(this))
    },

    coolSound() {
        cc.director.on('coolSound', function (event){
            if(this.audio){
                this.play(this.audio[8]);
            }
        }.bind(this))
    },

    greatSound() {
        cc.director.on('greatSound', function (event){
            if(this.audio){
                this.play(this.audio[9]);
            }
        }.bind(this))
    },

    // play (audio) {
    //     var sound = global.LocalStorage.get("sound");

    //     if(sound == 1) {
    //         cc.audioEngine.play(audio, false, 1);
    //     }
    // },

    // update (dt) {},
});
