var global = require("Globals");

cc.Class({
    extends: cc.Component,

    properties: {
        shareTitleArray: {
            default: [],
            type: cc.String,
        },
        shareImageArray: {
            default: [],
            type: cc.SpriteFrame,
        },
    },

    onLoad () {
        var imageUrlArray = this.shareImageArray.map(image=> {
            return image._textureFilename;
        });

        global.Interface.init();

        // 初始化分享题目与图片
        global.Interface.initShareInfo(this.shareTitleArray, imageUrlArray);
        global.Interface.openShare();
    },

    start () {

    },

    // update (dt) {},
});
