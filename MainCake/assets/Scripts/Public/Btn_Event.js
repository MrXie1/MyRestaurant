var global = require('Globals');

cc.Class({
    extends: cc.Component,

    properties: {
        btn_sign: cc.Node,
        btn_save: cc.Node,
        btn_share: cc.Node,
        btn_set: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    sign() {
        cc.director.emit('clickSound');
    },

    save() {
        cc.director.emit('clickSound');
    },

    share() {
        global.Interface.share();
        cc.director.emit('clickSound');
    },

    set() {
        cc.director.emit('clickSound');
    },
    // update (dt) {},
});
