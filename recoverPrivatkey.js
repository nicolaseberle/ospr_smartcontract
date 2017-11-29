var keythereum = require("keythereum");
var datadir = "/home/super/.ethereum/rinkeby";
var address= "0x7eff122b94897ea5b0e2a9abf47b86337fafebdc";
const password = "1234";

var keyObject = keythereum.importFromFile(address, datadir);
var privateKey = keythereum.recover(password, keyObject);
console.log(privateKey);
