//Prueba con otro algoritmo de encriptación

var aes256 = require('aes256');
 
var key = 'ElTiempoEsOro,HayQueAprovecharlo';
//var plaintext = 'my plaintext message';
 
var cipher = aes256.createCipher(key);
 
var encrypted = cipher.encrypt(plaintext);
var decrypted = cipher.decrypt(encrypted);