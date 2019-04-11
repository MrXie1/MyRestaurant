//ws://echo.websocket.org
//ws://echo.websocket.org  ws://xxx.xxx.xx.xxx:4000/   ws://ws.websocket.com:2346/




var WXTools = require("wsToolsJS");
var Mtils = require("MtilsJS");
var kVersion = "0.3.2"



var GAEM_NAME = "MainRestaurant"
var GAME_ID = "wx023b4a098d056b51"

const kReleaseUrl = "wss://www.7cgames.cn:8700/"
const kDebugUrl = "ws://192.168.0.108:8700/"
const kDevUrl = "ws://192.168.0.108:8702/"


const kKeyArchive = "ws_archive"
const kKeyFriendHelp = "ws_friend_help"
const kKeyGetUtcStr = "ws_get_utc_str"
const kKeyGetConfig = "ws_get_config"
const kKeyGetUserInfo = "ws_get_user_info"
const kKeyPostUserInfo = "ws_post_user_info"

var websocketJS = cc.Class({

    properties: {

        send_count: 0,
        recv_count: 0,
        player_id: "",
        ws_url: "",
        wxTool: 0,

        sendGetCallback: null,
        sendGetArchiveCallback: null,
        sendGetUtcCallback: null,
        sendGetConfigCallback: null,
        sendGetOnlineGameListCallback: null,
        sendGetUserInfoCallback: null,

        sendPostCallback: null,
        sendPostArchiveCallback: null,
        sendPostConfigCallback: null,
        sendPostUserInfoCallback: null,

        sendAppendCallback: null,
        sendAppendArchiveCallback: null,
        sendAppendFriendHelpCallback: null,

        loginCallback: null,
        onCloseCallback: null,
        errorMsgCallback: null,
    },

    // LIFE-CYCLE CALLBACKS:
    ctor: function () {
        this.wxTool = new WXTools(GAEM_NAME, GAME_ID);
    },

    //=================对外调用 start =================//

    initWebsocketBindFun: function (parameter) {

        if (parameter.runMode == 0) {
            this.ws_url = kReleaseUrl
        } else if (parameter.runMode == 1) {
            this.ws_url = kDebugUrl
        } else {
            this.ws_url = kDevUrl
        }

        this.player_id = parameter.playerId;
        this.loginCallback = parameter.loginFun
        this.onCloseCallback = parameter.onCloseFun

        this.initWebsocket();

    },

    SetGameID: function (game_name, game_id) {
        this.wxTool = new WXTools(game_name, game_id);
    },

    ////获取存档数据
    SendGetGameArchiveBindFun: function (parameter) {
        this.SendGetRequestBindFun({
            key_word: kKeyArchive,
            sendGetFun: parameter.sendGetFun
        })
        // wsJS.SendGetGameArchiveBindFun({
        //     sendGetFun: function (data, json) {
        //         console.log("SendGetGameArchiveBindFun  callback :" + data);
        //         console.log(json);
        //     }
        // })
    },

    ////向存档发送dataStr数据
    SendPostGameArchiveBindFun: function (parameter) {
        this.SendPostRequestBindFun({
            key_word: kKeyArchive,
            val_word: String(parameter.valWord),
            sendPostFun: parameter.sendPostFun
        })
        // wsJS.SendPostGameArchiveBindFun({
        //     valWord: dataStr,
        //     sendPostFun: function (data, json) {
        //         console.log("SendPostGameArchiveBindFun  callback :" + data);
        //         console.log(json);
        //     }
        // })
    },

    //追加发送存档数据  
    SendAppendGameArchiveBindFun: function (parameter) {
        this.SendAppendRequestBindFun({
            key_word: kKeyArchive,
            val_word: String(parameter.valWord),
            sendGetFun: parameter.sendGetFun
        })
        // wsJS.SendAppendGameArchiveBindFun({
        //     valWord: dataStr,
        //     sendAppendFun: function (data, json) {
        //         console.log("SendAppendGameArchiveBindFun  callback :" + data);
        //         console.log(json);
        //     }
        // })

    },

    //////清除存储的存档数据
    SendClearGameArchiveBindFun: function (parameter) {
        this.SendPostRequestBindFun({
            key_word: kKeyArchive,
            val_word: "",
            sendPostFun: parameter.sendPostFun
        })
        // wsJS.SendClearGameArchiveBindFun({
        //     sendPostFun: function (data, json) {
        //         console.log("SendClearGameArchiveBindFun  callback :" + data);
        //         console.log(json);
        //     }
        // })
    },

    // 、、发送个人openid nickname avatarUrl 信息
    SendPostUserInfoBindFun: function (parameter) {

        var valWord = this.wxTool.GetUserInfoJsonStr(parameter.OpenId, parameter.NickName, parameter.AvatarUrl)
        this.SendPostRequestBindFun({
            key_word: kKeyPostUserInfo,
            val_word: valWord,
            sendPostFun: parameter.sendPostFun
        })
        // wsJS.SendPostUserInfoBindFun({
        // OpenId:openid,
        // NickName:nickname,
        // AvatarUrl:avatarUrl,
        //     sendPostFun: function (data, json) {
        //         console.log("SendPostGameArchiveBindFun  callback :" + data);
        //         console.log(json);
        //     }
        // })
    },

    SendGetUserInfoByOpenIdBindFun: function (parameter) {
        var encryptOpenid = this.wxTool.CalPlayerEncryptId(parameter.openId)
        this.SendGetRequestBindFun({
            key_word: kKeyGetUserInfo,
            open_id: (encryptOpenid),
            sendGetFun: parameter.sendGetFun
        })
        // console.log(" GetUserInfoByOpenId=>" + encryptOpenid);
        // wsJS.SendGetUserInfoByOpenIdBindFun({
        //     openId: openid,
        //     sendGetFun: function (data, json) {
        //         console.log("SendGetUserInfoBindFun  callback :" + data);
        //         console.log(json);
        //     }
        // })
    },

    ////获取自己的好友帮助数据
    SendGetFriendHelpBindFun: function (parameter) {
        this.SendGetRequestBindFun({
            key_word: kKeyFriendHelp,
            sendGetFun: parameter.sendGetFun
        })
        // wsJS.SendGetFriendHelpBindFun({
        //     sendGetFun: function (data, json) {
        //         console.log("SendGetFriendHelpBindFun  callback :" + data);
        //         console.log(json);
        //     }
        // })
    },

    //修改自己的好友帮助数据
    SendPostFriendHelpBindFun: function (parameter) {
        this.SendPostRequestBindFun({
            key_word: kKeyFriendHelp,
            val_word: String(parameter.valWord),
            sendPostFun: parameter.sendPostFun
        })
        // wsJS.SendPostFriendHelpBindFun({
        //     valWord: dataStr,
        //     sendPostFun: function (data, json) {
        //         console.log("SendPostFriendHelpBindFun  callback :" + data);
        //         console.log(json);
        //     }
        // })
    },

    //清空自己的好友帮助数据 
    SendClearFriendHelpBindFun: function (parameter) {
        this.SendPostRequestBindFun({
            key_word: kKeyFriendHelp,
            val_word: "",
            sendPostFun: parameter.sendPostFun
        })
        // wsJS.SendClearFriendHelpBindFun({
        //     sendPostFun: function (data, json) {
        //         console.log("SendClearFriendHelpBindFun  callback :" + data);
        //         console.log(json);
        //     }
        // })
    },

    //好友B增加分享者A的分享信息  
    SendAppenFriendHelpBindFun: function (parameter) {
        this.SendAppendShareBindFun({
            shareUserId: parameter.shareUserId,
            key_word: kKeyFriendHelp,
            val_word: String(parameter.valWord),
            sendAppendFun: parameter.sendAppendFun
        })
        // wsJS.SendAppenFriendHelpBindFun({
        //     shareUserId: share_user_id,
        //     valWord: dataStr,
        //     sendAppendFun: function (data, json) {
        //         console.log("SendAppenFriendHelpBindFun  callback :" + data);
        //         console.log(json);
        //     }
        // })
    },

    //获取服务器utc时间
    SendGetServerUtcBindFun: function (parameter) {
        this.SendGetRequestBindFun({
            key_word: kKeyGetUtcStr,
            sendGetFun: parameter.sendGetFun
        })
        // wsJS.SendGetServerUtcBindFun({
        //     sendGetFun: function (data, json) {
        //         console.log("SendGetServerUtcBindFun  callback :" + data);
        //         console.log(json);
        //     }
        // }
    },


    //微信小游戏子游戏配置选项
    //获取配置信息
    SendGetConfigBindFun: function (parameter) {
        this.SendGetRequestBindFun({
            key_word: kKeyGetConfig,
            sendGetFun: parameter.sendGetFun
        })
        // wsJS.SendGetConfigBindFun({
        //     sendGetFun: function (data, json) {
        //         console.log("SendGetConfigBindFun  callback :" + data);
        //     }
        // })
    },



    //=================对外调用 end =================//

    //================websocket
    initWebsocket: function () {
        var self = this;

        if (this._wsiSendBinary) {
            return;
        }

        this._wsiSendBinary = new WebSocket(this.ws_url);
        this._wsiSendBinary.binaryType = "arraybuffer";

        console.log("pre initWebsocket url=" + this.ws_url + " user=" + this.player_id);

        this._wsiSendBinary.onopen = function (evt) {
            console.log("  websocket onopen   ");
            var login_request = self.wxTool.GetLoginRequestStr(self.player_id);
            console.log(" send login_request = " + login_request);
            self.sendWebSocketBinary(login_request);
        };

        this._wsiSendBinary.onmessage = function (evt) {
            var binary = new Uint16Array(evt.data);
            var str = '';
            for (var i = 0; i < binary.length; i++) {
                if (binary[i] === 0) {
                    str += " ";
                } else {
                    var hexChar = '0x' + binary[i].toString('16').toUpperCase();
                    str += String.fromCharCode(hexChar);
                }
            }
            self.receiveWebSocketMsg(str)
        };

        this._wsiSendBinary.onerror = function (evt) {
            console.log("wsiSendBinary onerror " + evt);
        };

        this._wsiSendBinary.onclose = function (evt) {
            console.log("wsiSendBinary onclose callback " + evt.reason);
            self.onCloseCallback(evt.reason);
            // After close, it's no longer possible to use it again, 
            // if you want to send another request, you need to create a new websocket instance
            self._wsiSendBinary = null;
        };
    },

    sendWebSocketBinary: function (senderText) {
        if (!this._wsiSendBinary) {
            return;
        }
        if (this._wsiSendBinary.readyState === WebSocket.OPEN) {
            var buf = senderText;// "Hello WebSocket中文,\0 I'm\0 a\0 binary\0 message\0.";
            if (buf.length > this.wxTool.msg_max_len) {
                console.log(" error length> " + this.wxTool.msg_max_len);
                return;
            }
            var arrData = new Uint16Array(buf.length);
            for (var i = 0; i < buf.length; i++) {
                arrData[i] = buf.charCodeAt(i);
            }

            this._wsiSendBinary.send(arrData.buffer);
            ++this.send_count;
        } else {
            var warningStr = "send binary websocket instance wasn't ready...";
            console.log(" wsiSendBinary  error " + warningStr);
            var self = this
            setTimeout(function () {
                self.sendWebSocketBinary(senderText);
            }.bind(this), 0.5 * 1000);
        }
    },

    receiveWebSocketMsg: function (msg) {
        msg = msg.trim();
        if ((msg[0] == "{") && (msg[msg.length - 1] == "}")) {
            var obj = JSON.parse(msg);
            if (obj["status"] >= 0) {
                if (obj["msgType"] == this.wxTool.msg_type_login) {
                    var token_seed = obj["msg"];
                    console.log("login success, get vrsion:" + obj["request"]);
                    this.wxTool.SetTokenSeed(token_seed);
                    // login success
                    if (this.loginCallback) {
                        this.loginCallback()
                    }
                } else if (obj["msgType"] == this.wxTool.msg_type_get) {
                    // console.log("recv get: " + obj["request"] + " ," + obj["msg"]);
                    //get success   context= obj["msg"]
                    if (obj["request"] == kKeyArchive) {
                        if (this.sendGetArchiveCallback) {
                            this.sendGetArchiveCallback(obj["msg"], msg)
                        }
                    } else if (obj["request"] == kKeyGetUtcStr) {
                        if (this.sendGetUtcCallback) {
                            this.sendGetUtcCallback(obj["msg"], msg)
                        }
                    } else if (obj["request"] == kKeyGetConfig) {
                        if (this.sendGetConfigCallback) {
                            this.sendGetConfigCallback(obj["msg"], msg)
                        }
                    } else if (obj["request"] == kKeyGetUserInfo) {
                        if (this.sendGetUserInfoCallback) {
                            var data = JSON.parse(obj["msg"]);
                            if (data["avatarUrl"] != "nullptr") {
                                data["avatarUrl"] = Mtils.base64_decode(data["avatarUrl"])
                            }
                            if (data["nickName"] != "nullptr") {
                                data["nickName"] = Mtils.base64_decode(data["nickName"])
                            }
                            this.sendGetUserInfoCallback(data, msg)
                        }
                    } else {
                        if (this.sendGetCallback) {
                            this.sendGetCallback(obj["msg"], msg)
                        }
                    }
                } else if (obj["msgType"] == this.wxTool.msg_type_post) {
                    if (obj["request"] == kKeyArchive) {
                        if (this.sendPostArchiveCallback) {
                            this.sendPostArchiveCallback(obj["msg"], msg)
                        }
                    } else if (obj["request"] == kKeyPostUserInfo) {
                        if (this.sendPostUserInfoCallback) {
                            this.sendPostUserInfoCallback(obj["msg"], msg)
                        }
                    } else {
                        if (this.sendPostCallback) {
                            this.sendPostCallback(obj["msg"], msg)
                        }
                    }

                } else if (obj["msgType"] == this.wxTool.msg_type_append) {
                    // console.log("recv post: " + obj["request"] + " ," + obj["msg"]);
                    //append success
                    if (obj["request"] == kKeyArchive) {
                        if (this.sendAppendArchiveCallback) {
                            this.sendAppendArchiveCallback(obj["msg"], msg)
                        }
                    } else if (obj["request"] == kKeyFriendHelp) {
                        if (this.sendAppendFriendHelpCallback) {
                            this.sendAppendFriendHelpCallback(obj["msg"], msg)
                        }
                    } else {
                        if (this.sendAppendCallback) {
                            this.sendAppendCallback(obj["msg"], msg)
                        }
                    }
                } else {
                    console.log("recv unkon type : " + obj["msgType"] + " ," + obj["msg"]);
                    //unkon type
                    //            code
                    //
                }
            } else {
                //error msg   
                //            code
                // this.errorMsgCallback(msg)
                console.log("recv error msg: status=" + obj["status"] + ",msg=" + obj["msg"]);
            }
            // console.log("recv json :" + msg);
        } else {
            console.log("recv Msg not json:" + msg);
        }
        ++this.recv_count;
    },

    closeWebSocket: function () {
        if (!this._wsiSendBinary) {
            return;
        }

        if (this._wsiSendBinary.readyState === WebSocket.CLOSED) {
            return;
        } else if (this._wsiSendBinary.readyState === WebSocket.OPEN) {
            //https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes
            var reason = "Normal Closure"
            var code = 1000
            console.log("pre websocket close ");
            this._wsiSendBinary.close(code, reason);
        }
    },

    SendGetRequest: function (key_word) {
        //Archive  ws_archive
        var msg_key = String(key_word);
        if (msg_key.length > 0) {
            //console.log(" pre send  lab = " + msg_key)
            if (msg_key.indexOf("ws_") == 0) {
                var send_msg = this.wxTool.GetGetValRequestStr(this.player_id, msg_key);
                //   console.log(" pre send  GetValRequest = " + send_msg);
            }
            this.sendWebSocketBinary(send_msg);
        }
    },

    SendGetRequestBindFun: function (parameter) {
        //Archive  ws_archive
        var msg_key = String(parameter.key_word);
        if (msg_key.length > 0) {
            //console.log(" pre send  lab = " + msg_key)
            if (msg_key == kKeyGetUserInfo) {
                var send_msg = this.wxTool.GetGetOpenidValRequestStr(this.player_id, msg_key, parameter.open_id);
                console.log("GetGetOpenidValRequestStr :" + send_msg);
            } else if (msg_key.indexOf("ws_") == 0) {
                var send_msg = this.wxTool.GetGetValRequestStr(this.player_id, msg_key);
            } else {
                console.log("msg_key error  " + msg_key);
            }
            this.sendWebSocketBinary(send_msg);
            if (msg_key == kKeyArchive) {
                this.sendGetArchiveCallback = parameter.sendGetFun
            } else if (msg_key == kKeyGetUtcStr) {
                this.sendGetUtcCallback = parameter.sendGetFun
            } else if (msg_key == kKeyGetConfig) {
                this.sendGetConfigCallback = parameter.sendGetFun
            } else if (msg_key == kKeyGetUserInfo) {
                this.sendGetUserInfoCallback = parameter.sendGetFun
            } else {
                this.sendGetCallback = parameter.sendGetFun
            }
        }
    },

    SendPostRequest: function (key_word, val_word) {
        //Archive  ws_archive
        var msg_key = String(key_word);
        var msg_val = String(val_word);
        if (msg_key.length > 0) {
            if (msg_key.indexOf("ws_") == 0) {
                var send_msg = this.wxTool.GetPostValRequestStr(this.player_id, msg_key, msg_val);
                // console.log(" pre send  GetValRequest = " + send_msg);
            }
            this.sendWebSocketBinary(send_msg);
        }
    },

    SendPostRequestBindFun: function (parameter) {
        // 
        var msg_key = String(parameter.key_word);
        var msg_val = String(parameter.val_word);
        if (msg_key.length > 0) {

            if (msg_key.indexOf("ws_") == 0) {
                var send_msg = this.wxTool.GetPostValRequestStr(this.player_id, msg_key, msg_val);
                // console.log(" pre send  GetValRequest = " + send_msg);
            }
            this.sendWebSocketBinary(send_msg);
            if (msg_key == kKeyArchive) {
                this.sendPostArchiveCallback = parameter.sendPostFun
            } else if (msg_key == kKeyPostUserInfo) {
                this.sendPostUserInfoCallback = parameter.sendPostFun
            } else {
                this.sendPostCallback = parameter.sendPostFun
            }
        }
    },

    SendAppendRequest: function (key_word, val_word) {
        // 
        var msg_key = String(key_word);
        var msg_val = String(val_word);
        if (msg_key.length > 0) {
            console.log(" pre send  lab = " + msg_key);
            if (msg_key.indexOf("ws_") == 0) {
                var send_msg = this.wxTool.GetPostAppendValRequestStr(this.player_id, msg_key, msg_val);
                console.log(" pre send  GetValRequest = " + send_msg);
            }
            this.sendWebSocketBinary(send_msg);
        }
    },

    SendAppendRequestBindFun: function (parameter) {
        // 
        var msg_key = String(parameter.key_word);
        var msg_val = String(parameter.val_word);
        if (msg_key.length > 0) {
            // console.log(" pre send  lab = " + msg_key);
            if (msg_key.indexOf("ws_") == 0) {
                var send_msg = this.wxTool.GetPostAppendValRequestStr(this.player_id, msg_key, msg_val);
                // console.log(" pre send  GetValRequest = " + send_msg);
            }
            this.sendWebSocketBinary(send_msg);
            // this.sendAppendCallback = parameter.sendAppendFun

            if (msg_key == kKeyArchive) {
                this.sendAppendArchiveCallback = parameter.sendAppendFun
            } else {
                this.sendAppendCallback = parameter.sendAppendFun
            }
        }
    },

    SendShareAppendRequest: function (share_user_id, val_word) {
        var msg_key = "ws_friend_help";
        var msg_val = String(val_word);
        if (msg_key.length > 0) {
            console.log(" pre send  lab = " + msg_key);
            if (msg_key.indexOf("ws_") == 0) {
                var send_msg = this.wxTool.GetPostShareAppendValRequestStr(this.player_id, share_user_id, msg_key, msg_val);
                console.log(" pre send  GetValRequest = " + send_msg);
            }
            this.sendWebSocketBinary(send_msg);
        }
    },

    SendAppendShareBindFun: function (parameter) {

        var msg_key = "ws_friend_help";
        var msg_val = String(parameter.val_word);
        var share_user_id = String(parameter.shareUserId)
        if (msg_key.length > 0) {
            console.log(" pre send  lab = " + msg_key);
            if (msg_key.indexOf("ws_") == 0) {
                var send_msg = this.wxTool.GetPostShareAppendValRequestStr(this.player_id, share_user_id, msg_key, msg_val);
                console.log(" pre send  GetValRequest = " + send_msg);
            }
            this.sendWebSocketBinary(send_msg);
            this.sendAppendFriendHelpCallback = parameter.sendAppendFun
        }
    }
});
module.exports = websocketJS;
