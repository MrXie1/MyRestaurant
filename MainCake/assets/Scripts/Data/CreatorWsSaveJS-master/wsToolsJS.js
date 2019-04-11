
var Mtils = require("MtilsJS");

var wsToolsJS = cc.Class({

    properties: {
        game_name: "",
        game_id: "",

        token_seed: "",

        msg_type_other: 10,
        msg_type_login: 11,
        msg_type_get: 12,
        msg_type_post: 13,
        msg_type_append: 14,
        msg_type_logout: 15,
        msg_type_unknow: 16,
        //发送消息最大长度
        msg_max_len: 2048,
    },
    ctor: function (game_name, game_id) {
        this.game_name = game_name;
        this.game_id = game_id;
    },

    SetTokenSeed: function (token_seed) {
        this.token_seed = token_seed
    },

    GetTokenSeed: function () {
        return this.token_seed
    },

    GetUtcStamp: function () {
        //秒
        var time_stamp_str = String(Date.parse(new Date()));
        var time_stamp = Number(time_stamp_str.substr(0, time_stamp_str.length - 3));
        return time_stamp;
    },

    GetUtcMillisecondStamp: function () {
        // 毫秒
        var time_stamp = new Date().getTime();
        return time_stamp;
    },

    CalMsgId: function (player_id) {
        var rand = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
        var player_id2 = Mtils.hex_md5(player_id).substr(0, 4);
        var msg_id = this.GetUtcStamp() + this.game_name.substr(0, 4) + player_id2 + rand;
        return msg_id;
    },

    CalLoginKey: function (msg_id) {
        //
        var buf = String(this.game_id) + String(msg_id) + String(this.game_id);
        var md5_val = Mtils.hex_md5(buf)
        var key = md5_val.substr(md5_val.length * 3 / 4, md5_val.length / 4);
        return key
    },

    CalTokenKey: function (msg_id) {
        var token_key;
        token_key = Mtils.hex_md5(this.token_seed + this.game_id + msg_id).substr(4, 8);
        return token_key;
    },

    CalPlayerEncryptId: function (player_id) {
        var player_encrypt_id = Mtils.hex_md5(player_id).substr(0, 12);
        return player_encrypt_id;
    },

    CalCheckKey: function (content) {
        var check_key;
        //console.log("CalCheckKey " + content);
        check_key = Mtils.hex_sha256(content);
        //console.log("hex_sha256 " + check_key);
        check_key = Mtils.hex_sha1(check_key);
        //console.log("hex_sha1 " + check_key);
        check_key = Mtils.hex_md5(check_key);

        return check_key.substr(8, 8);
    },



    //======对外调用=====
    GetLoginRequestStr: function (player_id) {
        // {
        //     //验证请求合法性
        //     "loginKey": "xxx",
        //     //游戏id：
        //     "gameId": "xxx",
        //     //记录区分不同的消息，
        //     "msgId": "xxx",
        //     "timeStamp": 1533275706,
        //     "msgType": "login",
        // }
        var msg_id = this.CalMsgId(player_id);
        // msg_id = "1534932909UnBlAAAA8538";
        var login_key = this.CalLoginKey(msg_id);
        var login_request =
        {
            "loginKey": login_key,
            "gameId": this.game_id,
            "msgId": msg_id,
            "timeStamp": this.GetUtcStamp(),
            "msgType": this.msg_type_login
        }
        return JSON.stringify(login_request);
    },

    GetGetValRequestStr: function (player_id, get_key) {
        if (this.token_seed.length < 4) {
            return "";
        }
        var msg_id = this.CalMsgId(player_id);
        var token_key = this.CalTokenKey(msg_id);
        var player_encrypt_id = this.CalPlayerEncryptId(player_id);
        var content = {
            "userId": player_encrypt_id,
            "dataKey": String(get_key),
        }

        var getVal_request =
        {
            "tokenKey": token_key,
            "gameId": this.game_id,
            "msgId": msg_id,
            "timeStamp": this.GetUtcStamp(),
            "msgType": this.msg_type_get,
            "content": content,
        }
        return JSON.stringify(getVal_request);
    },

    GetGetOpenidValRequestStr: function (player_id, get_key, openid) {
        if (this.token_seed.length < 4) {
            return "";
        }
        var msg_id = this.CalMsgId(player_id);
        var token_key = this.CalTokenKey(msg_id);
        var player_encrypt_id = this.CalPlayerEncryptId(player_id);
        var content = {
            "userId": player_encrypt_id,
            "openId": openid,
            "dataKey": String(get_key),
        }

        var getVal_request =
        {
            "tokenKey": token_key,
            "gameId": this.game_id,
            "msgId": msg_id,
            "timeStamp": this.GetUtcStamp(),
            "msgType": this.msg_type_get,
            "content": content,
        }
        return JSON.stringify(getVal_request);
    },


    GetPostValRequestStr: function (player_id, post_key, post_val) {
        if (this.token_seed.length < 4) {
            return "";
        }
        var msg_id = this.CalMsgId(player_id);
        var token_key = this.CalTokenKey(msg_id);
        var player_encrypt_id = this.CalPlayerEncryptId(player_id);
        var content = {
            "userId": player_encrypt_id,
            "dataKey": String(post_key),
            "dataVale": String(post_val)
        }
        var check_content = player_encrypt_id + String(post_key) + String(post_val);
        // console.log("GetPostValRequestStr content=" + check_content);
        // console.log("GetPostValRequestStr checkKey=" + this.CalCheckKey(check_content));
        var getVal_request =
        {
            "tokenKey": token_key,
            "gameId": this.game_id,
            "msgId": msg_id,
            "timeStamp": this.GetUtcStamp(),
            "msgType": this.msg_type_post,
            "content": content,
            "checkKey": this.CalCheckKey(check_content)
        }
        return JSON.stringify(getVal_request);
    },

    GetPostAppendValRequestStr: function (player_id, post_key, post_val) {
        if (this.token_seed.length < 4) {
            return "";
        }
        var msg_id = this.CalMsgId(player_id);
        var token_key = this.CalTokenKey(msg_id);
        var player_encrypt_id = this.CalPlayerEncryptId(player_id);
        var content = {
            "userId": player_encrypt_id,
            "dataKey": String(post_key),
            "dataVale": String(post_val)
        }
        var check_content = player_encrypt_id + String(post_key) + String(post_val);
        var getVal_request =
        {
            "tokenKey": token_key,
            "gameId": this.game_id,
            "msgId": msg_id,
            "timeStamp": this.GetUtcStamp(),
            "msgType": this.msg_type_append,
            "content": content,
            "checkKey": this.CalCheckKey(check_content)
        }
        return JSON.stringify(getVal_request);
    },

    GetPostShareAppendValRequestStr: function (player_id, share_player_id, post_key, post_val) {
        if (this.token_seed.length < 4) {
            return "";
        }
        var msg_id = this.CalMsgId(player_id);
        var token_key = this.CalTokenKey(msg_id);
        var player_encrypt_id = this.CalPlayerEncryptId(share_player_id);
        var content = {
            "userId": player_encrypt_id,
            "dataKey": String(post_key),
            "dataVale": String(post_val)
        }
        var check_content = player_encrypt_id + String(post_key) + String(post_val);
        var getVal_request =
        {
            "tokenKey": token_key,
            "gameId": this.game_id,
            "msgId": msg_id,
            "timeStamp": this.GetUtcStamp(),
            "msgType": this.msg_type_append,
            "content": content,
            "checkKey": this.CalCheckKey(check_content)
        }
        return JSON.stringify(getVal_request);
    },

    GetUserInfoJsonStr: function (openid, nickname, avatarUrl) {
        var content = {
            "openId": this.CalPlayerEncryptId(openid),
            "nickName": Mtils.base64_encode(nickname),
            "avatarUrl": Mtils.base64_encode(avatarUrl)
        }
        return JSON.stringify(content)
    }

});

module.exports = wsToolsJS;
