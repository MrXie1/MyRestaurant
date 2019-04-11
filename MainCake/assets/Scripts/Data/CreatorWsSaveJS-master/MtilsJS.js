
var pako = require('pakoJS');

module.exports = {
    /**
     * @author Rui.Zhang
     * @description 生成uuid, 该函数已扩展至Mtils对象中
     * @param {int} [len]   可选,生成uuid的长度,默认36位,建议20位以上
     * @param {int} [radix]   可选,生成的进制基数，8是8进制,10是10进制等等
     * @returns {String}, 生成的UUID
     **/
    uuid: function (len, radix) {
        var uuid;
        var chars, i, r, uuid;
        chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        uuid = [];
        i = void 0;
        radix = radix || chars.length;
        if (len) {
            i = 0;
            while (i < len) {
                uuid[i] = chars[0 | Math.random() * radix];
                i++;
            }
        } else {
            r = void 0;
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            i = 0;
            while (i < 36) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[i === 19 ? r & 0x3 | 0x8 : r];
                }
                i++;
            }
        }
        return uuid.join('');
    },

    /**
* @author Rui.Zhang
* @description 生成一个制定长度的随机数
* @param {String} [length]   可选,生成随机数的长度, 默认为5位
* @returns {Integer}, 生成的随机数
**/
    random: function (length) {
        var result, tmp, flag = true;
        if (length) {
            while (flag) {
                tmp = Math.random();
                if (tmp > 0.1) {
                    result = Math.floor(tmp * Math.pow(10, length));
                    flag = false;
                    return result;
                }
            }
        } else {
            while (flag) {
                tmp = Math.random();
                if (tmp > 0.1) {
                    result = Math.floor(tmp * Math.pow(10, 5));
                    flag = false;
                    return result;
                }
            }
        }
    },
    /**
 * @author Rui.Zhang
 * @description 对给定数据进行 hex_sha256 摘要计算
 * @param {String} str_data  待计算的数据
 * @returns {String}, hex_sha256 计算结果
 **/
    hex_sha256: function (str_data) {
        /* SHA256 logical functions */
        var rotateRight = function (n, x) {
            return ((x >>> n) | (x << (32 - n)));
        }
        var choice = function (x, y, z) {
            return ((x & y) ^ (~x & z));
        }
        var majority = function (x, y, z) {
            return ((x & y) ^ (x & z) ^ (y & z));
        }
        var sha256_Sigma0 = function (x) {
            return (rotateRight(2, x) ^ rotateRight(13, x) ^ rotateRight(22, x));
        }
        var sha256_Sigma1 = function (x) {
            return (rotateRight(6, x) ^ rotateRight(11, x) ^ rotateRight(25, x));
        }
        var sha256_sigma0 = function (x) {
            return (rotateRight(7, x) ^ rotateRight(18, x) ^ (x >>> 3));
        }
        var sha256_sigma1 = function (x) {
            return (rotateRight(17, x) ^ rotateRight(19, x) ^ (x >>> 10));
        }
        var sha256_expand = function (W, j) {
            return (W[j & 0x0f] += sha256_sigma1(W[(j + 14) & 0x0f]) + W[(j + 9) & 0x0f] +
                sha256_sigma0(W[(j + 1) & 0x0f]));
        }

        /* Hash constant words K: */
        var K256 = new Array(
            0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
            0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
            0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
            0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
            0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
            0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
            0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7,
            0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
            0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
            0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
            0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3,
            0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
            0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5,
            0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
            0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
            0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
        );

        /* global arrays */
        var ihash, count, buffer;
        var sha256_hex_digits = "0123456789abcdef";

        /* Add 32-bit integers with 16-bit operations (bug in some JS-interpreters:
         overflow) */
        var safe_add = function (x, y) {
            var lsw = (x & 0xffff) + (y & 0xffff);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xffff);
        }

        /* Initialise the SHA256 computation */
        var sha256_init = function () {
            ihash = new Array(8);
            count = new Array(2);
            buffer = new Array(64);
            count[0] = count[1] = 0;
            ihash[0] = 0x6a09e667;
            ihash[1] = 0xbb67ae85;
            ihash[2] = 0x3c6ef372;
            ihash[3] = 0xa54ff53a;
            ihash[4] = 0x510e527f;
            ihash[5] = 0x9b05688c;
            ihash[6] = 0x1f83d9ab;
            ihash[7] = 0x5be0cd19;
        }

        /* Transform a 512-bit message block */
        var sha256_transform = function () {
            var a, b, c, d, e, f, g, h, T1, T2;
            var W = new Array(16);

            /* Initialize registers with the previous intermediate value */
            a = ihash[0];
            b = ihash[1];
            c = ihash[2];
            d = ihash[3];
            e = ihash[4];
            f = ihash[5];
            g = ihash[6];
            h = ihash[7];

            /* make 32-bit words */
            for (var i = 0; i < 16; i++)
                W[i] = ((buffer[(i << 2) + 3]) | (buffer[(i << 2) + 2] << 8) | (buffer[(i << 2) + 1]
                    << 16) | (buffer[i << 2] << 24));

            for (var j = 0; j < 64; j++) {
                T1 = h + sha256_Sigma1(e) + choice(e, f, g) + K256[j];
                if (j < 16) T1 += W[j];
                else T1 += sha256_expand(W, j);
                T2 = sha256_Sigma0(a) + majority(a, b, c);
                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }

            /* Compute the current intermediate hash value */
            ihash[0] += a;
            ihash[1] += b;
            ihash[2] += c;
            ihash[3] += d;
            ihash[4] += e;
            ihash[5] += f;
            ihash[6] += g;
            ihash[7] += h;
        }

        /* Read the next chunk of data and update the SHA256 computation */
        var sha256_update = function (data, inputLen) {
            var i, index, curpos = 0;
            /* Compute number of bytes mod 64 */
            index = ((count[0] >> 3) & 0x3f);
            var remainder = (inputLen & 0x3f);

            /* Update number of bits */
            if ((count[0] += (inputLen << 3)) < (inputLen << 3)) count[1]++;
            count[1] += (inputLen >> 29);

            /* Transform as many times as possible */
            for (i = 0; i + 63 < inputLen; i += 64) {
                for (var j = index; j < 64; j++)
                    buffer[j] = data.charCodeAt(curpos++);
                sha256_transform();
                index = 0;
            }

            /* Buffer remaining input */
            for (var j = 0; j < remainder; j++)
                buffer[j] = data.charCodeAt(curpos++);
        }

        /* Finish the computation by operations such as padding */
        var sha256_final = function () {
            var index = ((count[0] >> 3) & 0x3f);
            buffer[index++] = 0x80;
            if (index <= 56) {
                for (var i = index; i < 56; i++)
                    buffer[i] = 0;
            } else {
                for (var i = index; i < 64; i++)
                    buffer[i] = 0;
                sha256_transform();
                for (var i = 0; i < 56; i++)
                    buffer[i] = 0;
            }
            buffer[56] = (count[1] >>> 24) & 0xff;
            buffer[57] = (count[1] >>> 16) & 0xff;
            buffer[58] = (count[1] >>> 8) & 0xff;
            buffer[59] = count[1] & 0xff;
            buffer[60] = (count[0] >>> 24) & 0xff;
            buffer[61] = (count[0] >>> 16) & 0xff;
            buffer[62] = (count[0] >>> 8) & 0xff;
            buffer[63] = count[0] & 0xff;
            sha256_transform();
        }

        /* Get the internal hash as a hex string */
        var sha256_encode_hex = function () {
            var output = new String();
            for (var i = 0; i < 8; i++) {
                for (var j = 28; j >= 0; j -= 4)
                    output += sha256_hex_digits.charAt((ihash[i] >>> j) & 0x0f);
            }
            return output;
        }

        sha256_init();
        sha256_update(str_data, str_data.length);
        sha256_final();
        return sha256_encode_hex();
    },


    /**
     * @author Rui.Zhang
     * @description 对给定数据进行 base64 解码
     * @param {String} str_data  待解码的数据
     * @returns {String}, base64 解码后的数据
     **/
    base64_decode: function (str_data) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        // private property
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        // private method for UTF-8 decoding
        var _utf8_decode = function (utftext) {
            var string = "";
            var i = 0;
            var c, c1, c2, c3;
            c = c1 = c2 = c3 = 0;
            while (i < utftext.length) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                } else if ((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i + 1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                } else {
                    c2 = utftext.charCodeAt(i + 1);
                    c3 = utftext.charCodeAt(i + 2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }

        str_data = str_data.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < str_data.length) {
            enc1 = _keyStr.indexOf(str_data.charAt(i++));
            enc2 = _keyStr.indexOf(str_data.charAt(i++));
            enc3 = _keyStr.indexOf(str_data.charAt(i++));
            enc4 = _keyStr.indexOf(str_data.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    },


    /**
     * @author Rui.Zhang
     * @description 对给定数据进行 base64 编码
     * @param {String} str_data  待编码的数据
     * @returns {String}, base64 编码后的数据
     **/
    base64_encode: function (str_data) {
        // private property
        var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        // private method for UTF-8 encoding
        var _utf8_encode = function (string) {
            string = string.replace(/\r\n/g, "\n");
            var utftext = "";
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                } else if ((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                } else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }
            return utftext;
        }


        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        str_data = _utf8_encode(str_data);
        while (i < str_data.length) {
            chr1 = str_data.charCodeAt(i++);
            chr2 = str_data.charCodeAt(i++);
            chr3 = str_data.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    },


    /**
     * @author Rui.Zhang
     * @description 对给定数据进行 sha1 摘要计算
     * @param {String} str_data  待计算的数据
     * @returns {String}, sha1 计算结果
     **/
    hex_sha1: function (str_data) {
        var hexcase = 0;
        /*   hex   output   format.   0   -   lowercase;   1   -   uppercase                 */
        var chrsz = 8;
        /*   bits   per   input   character.   8   -   ASCII;   16   -   Unicode             */

        /*
         *   Convert   an   array   of   big-endian   words   to   a   hex   string.
         */
        var binb2hex = function (binarray) {
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
            }
            return str;
        }

        /*
         *   Bitwise   rotate   a   32-bit   number   to   the   left.
         */
        var rol = function (num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }

        /*
         *   Calculate   the   SHA-1   of   an   array   of   big-endian   words,   and   a   bit   length
         */
        var core_sha1 = function (x, len) {
            /*   append   padding   */
            x[len >> 5] |= 0x80 << (24 - len % 32);
            x[((len + 64 >> 9) << 4) + 15] = len;

            var w = Array(80);
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            var e = -1009589776;

            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;
                var olde = e;

                for (var j = 0; j < 80; j++) {
                    if (j < 16) w[j] = x[i + j];
                    else w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                    var t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
                    e = d;
                    d = c;
                    c = rol(b, 30);
                    b = a;
                    a = t;
                }

                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
                e = safe_add(e, olde);
            }
            return Array(a, b, c, d, e);

        }

        /*
         *   Convert   an   8-bit   or   16-bit   string   to   an   array   of   big-endian   words
         *   In   8-bit   function,   characters   >255   have   their   hi-byte   silently   ignored.
         */
        var str2binb = function (str) {
            var bin = Array();
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < str.length * chrsz; i += chrsz)
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
            return bin;
        }

        /*
         *   Add   integers,   wrapping   at   2^32.   This   uses   16-bit   operations   internally
         *   to   work   around   bugs   in   some   JS   interpreters.
         */
        var safe_add = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        /*
         *   Perform   the   appropriate   triplet   combination   function   for   the   current
         *   iteration
         */
        var sha1_ft = function (t, b, c, d) {
            if (t < 20) return (b & c) | ((~b) & d);
            if (t < 40) return b ^ c ^ d;
            if (t < 60) return (b & c) | (b & d) | (c & d);
            return b ^ c ^ d;
        }

        /*
         *   Determine   the   appropriate   additive   constant   for   the   current   iteration
         */
        var sha1_kt = function (t) {
            return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514;
        }

        return binb2hex(core_sha1(str2binb(str_data), str_data.length * chrsz));
    },


    /**
     * @author Rui.Zhang
     * @description 对给定数据进行 md5 摘要计算
     * @param {String} str_data  待计算的数据
     * @returns {String}, md5 计算结果
     **/
    hex_md5: function (str_data) {
        var chrsz = 8;
        /* bits per input character. 8 - ASCII; 16 - Unicode      */
        var hexcase = 0;
        /* hex output format. 0 - lowercase; 1 - uppercase        */

        /*
         * Convert an array of little-endian words to a base-64 string
         */
        var binl2b64 = function (binarray) {
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i += 3) {
                var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16)
                    | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8)
                    | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
                    else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
                }
            }
            return str;
        }

        /*
         * These functions implement the four basic operations the algorithm uses.
         */
        var md5_cmn = function (q, a, b, x, s, t) {
            return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
        }
        var md5_ff = function (a, b, c, d, x, s, t) {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        }
        var md5_gg = function (a, b, c, d, x, s, t) {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        }
        var md5_hh = function (a, b, c, d, x, s, t) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t);
        }
        var md5_ii = function (a, b, c, d, x, s, t) {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        }

        /*
         * Convert an array of little-endian words to a base-64 string
         */
        var binl2b64 = function (binarray) {
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i += 3) {
                var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16)
                    | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8)
                    | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
                for (var j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
                    else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
                }
            }
            return str;
        }

        /*
         * Calculate the MD5 of an array of little-endian words, and a bit length
         */
        var core_md5 = function (x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;

            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;

            for (var i = 0; i < x.length; i += 16) {
                var olda = a;
                var oldb = b;
                var oldc = c;
                var oldd = d;

                a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

                a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

                a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

                a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
            }
            return Array(a, b, c, d);
        }


        /*
         * These functions implement the four basic operations the algorithm uses.
         */
        var md5_cmn = function (q, a, b, x, s, t) {
            return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
        }

        /*
         * Convert an array of little-endian words to a hex string.
         */
        var binl2hex = function (binarray) {
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                    hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
            }
            return str;
        }

        /*
         * Convert a string to an array of little-endian words
         * If chrsz is ASCII, characters >255 have their hi-byte silently ignored.
         */
        var str2binl = function (str) {
            var bin = Array();
            var mask = (1 << chrsz) - 1;
            for (var i = 0; i < str.length * chrsz; i += chrsz)
                bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
            return bin;
        }

        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        var safe_add = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        var bit_rol = function (num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }

        return binl2hex(core_md5(str2binl(str_data), str_data.length * chrsz));
    },

    /**
     * @author   https://github.com/nodeca/pako/blob/master/dist/pako.min.js
     * @description gzip Compression/Decompression for Strings
     * @param {String} origionDataString  待压缩的数据  不支持中文！！！
     * @returns {String}, deflateDataString 压缩结果,为二进制数据  
     **/
    // 
    pakozip: function (origionDataString) {
        // 用pako 压缩 返回的是二进制数据
        var deflateDataString = pako.deflate(origionDataString, { gzip: true, to: 'string' });
        // console.log("deflateDataString  len=" + deflateDataString.length + " " + (deflateDataString.length / origionDataString.length));
        return deflateDataString;
    },

    pakounzip: function (deflateDataString) {
        // 用pako 解压
        var inflateDataString = pako.inflate(deflateDataString, { gzip: true, to: 'string' });
        // console.log("inflateDataString  len=" + inflateDataString.length);
        // console.log(inflateDataString);
        return inflateDataString;
    },

    zipstr: function (origionDataString) {
        //使用pako 的GZIP 进行压缩 压缩成二进制数据，二进制数据转base64 变成字符串
        var base64strEn = this.base64_encode(this.pakozip(origionDataString))

        // console.log("base64strEn  len=" + base64strEn.length + " " + (base64strEn.length / origionDataString.length));
        // console.log(base64strEn);
        return base64strEn;
    },

    unzipstr: function (base64strEn) {
        // base64字符串 转成二进制数据 ，再用pakounzip解压
        var base64strDe = this.base64_decode(base64strEn)
        // console.log("base64strDe  len=" + base64strDe.length);
        // console.log(base64strDe);
        // deflateDataString=base64strDe;
        var inflateDataString = this.pakounzip(base64strDe)
        return inflateDataString
    },
    
    DateStr: function () {

        var myDate = new Date();
        var year = myDate.getFullYear();    //获取完整的年份(4位,1970-????)
        var month = myDate.getMonth() + 1;       //获取当前月份(1-12)
        var day = myDate.getDate();        //获取当前日(1-31)
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        var date_str = year + "" + month + "" + day;
        // console.log(" date_str   ", date_str);
        return date_str;
    }
}


/**
* @author Rui.Zhang
* @class 前端开发辅助工具类
* @date 2016-09-04 22:32:09
* @description Mtils 是 My Utils 的简写, 本工具提供前台常用的文本处理、 表单处理、 数据校验、 数据安全等函数。<br />
* @description 除了基本的函数封装外, 本工具还对原生的对象进行一定的扩展, 更方便使用。
* @site https://github.com/MisterChangRay/Mtils2
* @since version 2.0.0
*/
