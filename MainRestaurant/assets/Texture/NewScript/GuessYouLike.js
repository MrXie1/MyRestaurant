const LOCAL_MINIGAME_LIST = 'localMiniGameList_test15';
const LOCAL_NEXTINDEX = 'localNextIndex_test15'
cc.Class({
    extends: cc.Component,

    properties: {
        iconImageArray: {
            default: [],
            type: cc.SpriteFrame,
        },
        currentMiniGameList: [],
        nextIndex: 0,
        moreGameList: [],
        settimeout: null,
        childIndex: -1,
    },


    start() {
        this.initData();
        this.initYouLike();
    },

    initData() {
        this.miniGameList = [
            "wxd5a257d6ee2b8f91",//飞机大作战
            "wx515f44394eab5985",//切水果
            "wxf49b0a26d9405058",//恋爱球球
            "wxea245f85c9673414",//俄罗斯方块
            "wx08beeb18dc512c2f",//消灭星星
            "wxc4e628aa7caa2c07",//飞刀
            "wxd9589cd7117d0873",//最囧
            "wx0af703a36035c60c",//2048六角消除数字方块//"wx40fb3563b8ac79b2",//2048
            // "wx6616ae605010e605",//欢乐球球
            "wx528f5a9cd16be88a"//贪吃蛇 "wxac5820bc06a3a893",//弹球弹一弹//
        ]

        let localMiniGameList = cc.sys.localStorage.getItem(LOCAL_MINIGAME_LIST)
        if (localMiniGameList) {
            let json_parse = JSON.parse(localMiniGameList)
            this.currentMiniGameList = json_parse;
        } else {
            this.currentMiniGameList = [0, 1, 2, 3];
        }

        let localNextIndex = cc.sys.localStorage.getItem(LOCAL_NEXTINDEX)
        if (localNextIndex) {
            this.nextIndex = parseInt(localNextIndex)
        } else {
            this.nextIndex = 4;
        }
    },

    initYouLike() {
        let self = this;
        for (let i = 0; i < this.node.childrenCount; i++) {
            let child = this.node.children[i];
            child.getComponent(cc.Sprite).spriteFrame = this.iconImageArray[this.currentMiniGameList[i]];
            if (child.hasEventListener('touchstart')) continue;
            child.on('touchstart', function () {
                self.childIndex = this.getSiblingIndex()
                if (self.settimeout)
                    clearTimeout(self.settimeout)
                self.settimeout = setTimeout(self.setTimeoutFun.bind(self), 2000)
                if (CC_WECHATGAME) {
                    if (wx.navigateToMiniProgram) {
                        wx.navigateToMiniProgram({
                            appId: self.miniGameList[self.currentMiniGameList[self.childIndex]],
                            path: '',
                        })
                    }
                }
            }, child)
        }
    },

    setTimeoutFun() {
        this.currentIndex = this.nextIndex % this.miniGameList.length;
        for (let i = 0; i < this.currentMiniGameList.length; i++) {
            if (this.currentMiniGameList.indexOf(this.currentIndex) >= 0) {
                this.nextIndex++;
                this.currentIndex = this.nextIndex % this.miniGameList.length;
            }
        }
        this.currentMiniGameList[this.childIndex] = this.currentIndex;
        this.initYouLike();
        cc.sys.localStorage.setItem(LOCAL_MINIGAME_LIST, JSON.stringify(this.currentMiniGameList))
        cc.sys.localStorage.setItem(LOCAL_NEXTINDEX, this.nextIndex.toString())
    },
});
