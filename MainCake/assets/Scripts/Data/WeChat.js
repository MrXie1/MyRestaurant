

module.exports = {

    init: function (data) {
        this.gameName = data.gameName;
        this.gameAppid = data.gameAppid;
        this.secret = data.secret;
        console.log(this.gameName);
    },

    openShare(titleArray, imageUrlArray) {
        if(!wx.showShareMenu) return;
        //显示微信菜单中的”转发“按钮，如果是群则获取群id
        wx.showShareMenu({
            withShareTicket: true
        });

        var num = titleArray.length;
        var key = 0;

        //微信菜单中的”转发“按钮的回调函数
        wx.onShareAppMessage(function () {
            var k = (key++) % num;
            return {
                title: titleArray[k],
                imageUrl: imageUrlArray[k],
            }
        });
    },

    share: function (data) {
        if (!wx.shareAppMessage) return;

        var self = this;
        console.log("微信主动分享");
        wx.shareAppMessage({
            title: data.title,
            imageUrl: data.imageUrl,
            // query: 'openid=' + self.playerOpenid + '&type=' + data.type,
        });
        // this.type = data.type;
        console.log(data);
    },

    // 提示
    hitBox: function (string) {
        wx.showToast({
            title: string,
            icon: 'none',
            duration: 2000,
        });
    },
}