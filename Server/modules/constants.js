function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("usertimeout", 1000);
define("TCPIP", "127.0.0.1");
define("TCPPORT", 5000);
define("QUESTIONTIMELIMIT", 10000);
define("STARTQUIZLIVES", 1);
define("TIMELIMIT", 1000*60*3);