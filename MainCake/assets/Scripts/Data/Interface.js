
var weChat = require('WeChat');

var shareInfo = {
    k: 0,
    length: 0,
    titleArray: [],
    imageArray: []
}
module.exports = {
    gameName: "MainCake",
    gameAppid: "wxd422602abf7e9691",
    secret: "043ccdcf34e10a13b4c4dfa609e18481",

    init: function () {
        console.log("初始化接口");
        var self = this;
        weChat.init({
            gameName: self.gameName,
            gameAppid: self.gameAppid,
            secret: self.secret,
        });
    },

    hitBox: function (string) {
        if (CC_WECHATGAME) {
            weChat.hitBox(string);
        } else {
            console.log(string);
        }
    },

    initShareInfo(titleArray, imageArray) {
        shareInfo.k = 0;
        shareInfo.length = titleArray.length;
        shareInfo.titleArray = titleArray;
        shareInfo.imageArray = imageArray;
        // console.log(shareInfo)
    },

    openShare() {
        if (CC_WECHATGAME) {
            weChat.openShare(shareInfo.titleArray, shareInfo.imageArray);
        } else {
            console.log("打开菜单栏的转发按钮");
        }
    },

    // 遍历分享信息数组
    getShareInfo: function () {
        var data = {
            title: shareInfo.titleArray[shareInfo.k],
            imageUrl: shareInfo.imageArray[shareInfo.k],
        }
        shareInfo.k++;
        shareInfo.k = shareInfo.k % shareInfo.length;

        return data;
    },

    // 主动分享
    share: function (res) {
        var data = this.getShareInfo();
        
        if (CC_WECHATGAME) {
            weChat.share({
                title: data.title,
                imageUrl: data.imageUrl,
                // type: res.type || -1,
            });
        } else {
            console.log("分享：" + data.title);
        }

    },
}