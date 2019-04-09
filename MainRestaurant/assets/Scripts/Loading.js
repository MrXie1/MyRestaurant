
cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0.5,
        progressBarView: {
            type: cc.ProgressBar,
            default: null
        },
        loadLabel: cc.Label,
        tip: {
            type: cc.String,
            default: []
        },
        tipLabel: cc.Label,
        count: 0
    },

    //当我们将脚本添加到节点 `node`上面的时候
    onLoad: function () {
        this.progressBarView.progress = 0;
        cc.director.preloadScene("Game0", function () {
            cc.log("Next scene preloaded");
        });
        this.schedule(function(){
            this.updateText()
        },2)
    },

    update: function (dt) {
        var progress = this.progressBarView.progress;
        progress += dt * this.speed;

        this.progressBarView.progress = progress;
        this.loadLabel.string = '加载中('+ Math.floor(100*progress) +'%)'
        if (progress >= 1) {
            this.speed = 0;
            // console.log(progress)
            cc.director.loadScene("Game0")
        }
    },

    updateText() {
        var index = this.count;
        this.tipLabel.string = this.tip[index];
        this.count++;
    }
});
