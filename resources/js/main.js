/** Copyright 2021
* Este script esta desarrollado por: 
    Aarón Rojas Vera
    Alejandra Garcia Lopez 
    Rafael Ramirez Benites
* Visitenos en aaronrojas.great-site.net
---------------------------------------- */
// CLASES
class Dispositivo{
  constructor(ipPrivada, ipPublica, mac, anchoBanda, conectado){
      this.ipPrivada = ipPrivada;
      this.ipPublica = ipPublica;
      this.mac = mac;
      this.anchoBanda = anchoBanda;
      this.conectado = conectado;
  }
}
// CREACION DE OBJETOS
let dispositivo1 = new Dispositivo("192.168.1.1", "192.23.12.12", "24-88-90-0-ff-ab", 80, true);
let dispositivo2 = new Dispositivo("192.168.1.1", "192.36.14.12", "aa-cd-ef-0-aa-54", 50, true);
let dispositivo3 = new Dispositivo("192.168.1.1", "192.23.12.12", "25-48-b0-0-ff-ab", 80, true);
let dispositivo4 = new Dispositivo("192.168.1.1", "192.24.16.11", "32-a8-9f-0-ff-56", 50, false);
var emisor;
var receptor;
// VARIABLES
const largoSegmentacion = 4 * 8; //4Bytes - Valon en el q segmentara el mensaje
var enviando = true; // saber si el mensaje va de ida(true) o vuelta(false)
var msgNatural;
var msgEncriptado;
var msgTraducido;
var msgSegmentado;
var msgEmpaquetado;
var msgEntramado;
var msgTextArea; // mensaje que se mostrara en los text area
var msgReceptor; //mensaje que sera recibido por el receptor
/**
 * Convierte una cadena texto ASCII(text) a binario
 * @param {string} text Texto en ASCII
 * @return  {string}
 */
function textToBinary(text){
  text = unescape( encodeURIComponent( text ) );
  var chr, i = 0, l = text.length, binary = '';
  for( ; i < l; i ++ ){
      chr = text.charCodeAt( i ).toString( 2 );
      while( chr.length % 8 != 0 ){ 
        chr = '0' + chr; 
      }
      binary += chr;
  }
  return binary;
}
/**
 * Conierte un numero binario(binary) a texto en ASCII
 * @param {string} binary Texto en binario
 * @return  {string}
 */ 
function binaryToText(binary){
  var i = 0, l = binary.length, chr, text = '';
  for( ; i < l; i += 8 ){
      chr = parseInt( binary.substr( i, 8 ), 2 ).toString( 16 );
      text += '%' + ( ( chr.length % 2 == 0 ) ? chr : '0' + chr );
  }
  return decodeURIComponent( text );
}
//-------------
// DISPOSITIVOS
//-------------
$('#form-dispositivos').on('submit', function(e){
  e.preventDefault();
  if(enviando){
    var datos = $(this).serializeArray();
    emisor = eval(datos[0].value);
    receptor = eval(datos[1].value);
    if(emisor.mac != receptor.mac){
      $('#btn-capa7').prop('disabled', false);
      $('#btn-simular').prop('disabled', true);
      $('#btn-capa7').focus();
    }else{
      alert("Los dispositivos son los mismos");
    }
  }
});
//----------------------------
// CAPA DE APLICACION (Nro. 7)
//----------------------------
$('#form-capa7').on('submit', function(e){
  e.preventDefault();
  if(enviando){
    msgSegmentado = new Array();
    msgEmpaquetado = new Array();
    msgEntramado = new Array();
    msgTextArea = new Array();
    msgReceptor = new Array();
    var datos = $(this).serializeArray();
    $.ajax({
      url: 'model/enviar-mensaje.php',
      type: 'POST',
      dataType: 'json',
      data: datos,
      success: function(data){
        if(data.respuesta == 'exito'){
          msgEncriptado = data.msgEncriptado;
          msgTraducido = data.msgBinario;
          $('#msg-encriptado').val(msgEncriptado);
          $('#msg-traducido').val(msgTraducido);
          $('#siguiente-capa6').prop('disabled', false);
          $('#siguiente-capa6').focus();
        }
      }
    });
  }
});
//------------------------------
// CAPA DE PRESENTACION (Nro. 6)
//------------------------------
$('#form-capa6').on('submit', function(e){
  e.preventDefault();
  if(enviando){
    if(emisor.conectado && receptor.conectado){
      $('#conexion').val("true");
      $('#siguiente-capa5').prop('disabled', false);
      $('#siguiente-capa5').focus();
    }else{
      $('#conexion').val("false");
    }
  }else{
    var datos = {
      'accion': 'desencriptar',
      'mensaje': $('#msg-encriptado').val()
    };
    $.ajax({
      url: 'model/enviar-mensaje.php',
      type: 'POST',
      dataType: 'json',
      data: datos,
      success: function(data){
        if(data.respuesta == 'exito'){
          $('#mensaje').val(data.msgNatural);
          $('#siguiente-capa7').focus();
          enviando = true;
        }
      }
    });
  }
});
//------------------------
// CAPA DE SESION (Nro. 5)
//------------------------
$('#form-capa5').on('submit', function(e){
  e.preventDefault();
  if(enviando){
    segmentarMensaje();
    let msg = formatoMsgTextArea(msgTextArea);
    $('#msg-segmentado').val(msg);
    $('#siguiente-capa4').prop('disabled', false);
    $('#siguiente-capa4').focus();
  }else{
    destraducirMensaje();
    desencriptarMensaje();
    $('#siguiente-capa6').focus();
  }
});
function destraducirMensaje() {
  let msg = formatoMsgTextArea(msgReceptor, true);
  $('#msg-traducido').val(msg);
}
function desencriptarMensaje() {
  let msg = $('#msg-traducido').val();
  $('#msg-encriptado').val(binaryToText(msg));
}
/**
 * Segmenta el msg traducido y lo almacena en @msgSegmentado
 * Da un formato a los segmentos para mostrarlo en el text area, 
    * y lo almacena en @msgTextArea
 */
function segmentarMensaje() {
  let indiceInicioSegmento = 0, cantidadSegmentos = msgTraducido.length / largoSegmentacion;
  for (let i = 0; i < cantidadSegmentos; i++) {
      let segmento = decimalToBinary(i);
      let msgSegmento = `[${segmento}]${msgTraducido.substr(indiceInicioSegmento, largoSegmentacion)}`;
      msgTextArea.push(msgSegmento);
      segmento += msgTraducido.substr(indiceInicioSegmento, largoSegmentacion);
      indiceInicioSegmento += largoSegmentacion ;
      msgSegmentado.push(segmento);
  }
}
/**
 * Convertir numero decimal(decimal) a numero binario
 * @param {int} decimal numero decimal
 * @return  {string}
 */
function decimalToBinary(decimal){//0 : 00000000, 1: 00000001
  var binary = decimal.toString(2);
  var largo = Math.ceil(binary.length / 8) * 8;
  binary = binary.padStart(largo, '0');
  return binary;
}
/**
 * Da formato a un msg para ser mostrado en un text area
 * @param {Array} msg msg en un array
 * @param {boolean} msgJunto si el msg ira todo junto o con un salto de linea
 * @return  {string}
 */
function formatoMsgTextArea(msg, msgJunto = false) {
  let newMsg = '';
  if(!msgJunto){
    msg.forEach(e => {  
      newMsg += e + '\n'; 
    });
  }else{
    msg.forEach(e => { 
      newMsg += e; 
    });
  }
  return newMsg;
}
//----------------------------
// CAPA DE TRANSPORTE (Nro. 4)
//----------------------------
$('#form-capa4').on('submit', function(e){
  e.preventDefault();
  if(enviando){
    var ipEmisor, ipReceptor;
    /**
     * Identifica si el emisor y receptor se encuentran en la misma red
        * segun eso, agrega la ip privadaa para ambos 
        * o sus respectivas ip publicas
    */ 
    if(emisor.ipPublica == receptor.ipPublica){
      ipEmisor = emisor.ipPrivada;
      ipReceptor = receptor.ipPrivada;
    }else{
      ipEmisor = emisor.ipPublica;
      ipReceptor = receptor.ipPublica;
    }
    empaquetarMensaje(ipEmisor, ipReceptor);
    formatoMsgEmpaquetado(ipEmisor, ipReceptor);
    let msg = formatoMsgTextArea(msgTextArea);
    $('#msg-empaquetado').val(msg);
    $('#siguiente-capa3').prop('disabled', false);
    $('#siguiente-capa3').focus();
  }else{
    if(emisor.conectado && receptor.conectado){
      $('#conexion').val("true");
      $('#siguiente-capa5').focus();
    }else{
      $('#conexion').val("false");
    }
  }
});
/**
 * Empaquetamos el msg segmentado y lo almacena en @msgEmpaquetado
 * @param {string} ipEmisor Direccion ip de emisor
 * @param {string} ipReceptor Direccion ip del receptor
 */
function empaquetarMensaje(ipEmisor, ipReceptor) {
  msgSegmentado.forEach(e => {
    let paquete = ipToBinary(ipEmisor) + ipToBinary(ipReceptor) + e;
    msgEmpaquetado.push(paquete);
  });
}
/**
 * Da un formato a los segmentos para mostrarlo en el text area, 
    * y lo almacena en @msgTextArea
 * @param {string} ipEmisor Direccion ip de emisor
 * @param {string} ipReceptor Direccion ip del receptor
 */
function formatoMsgEmpaquetado(ipEmisor, ipReceptor) {
  for (let i = 0; i < msgTextArea.length; i++) {
    const e = msgTextArea[i];
    let msgPaquete = `[${ipToBinaryShow(ipToBinary(ipEmisor))}/${ipToBinaryShow(ipToBinary(ipReceptor))}]${e}`;
    msgTextArea[i] = msgPaquete;
  }
}
/**
 * Convertimos la ip(255.255.255.255) a un binario y sin los puntos
 * @param {string} ip IP del dispositivo
 * @return  {string}
 */
function ipToBinary(ip) {
  var binary = '';
  var octetos = ip.split('.');
  octetos.forEach(e => {
    binary += decimalToBinary(parseInt(e));
  });
  return binary;
}
/**
 * Damos un formato a la IP con una separacion de octetos
 * @param {string} ipBinary IP en binario
 * @return  {string}
 */
function ipToBinaryShow(ipBinary) {
  var newIP = '';
  for (let i = 0; i < ipBinary.length; i+=8) {
    const octeto = ipBinary.substr(i,8);
    newIP += octeto;
    if(i + 8 < ipBinary.length){
      newIP += '.';
    }
  }
  return newIP;
}
//---------------------
// CAPA DE RED (Nro. 3)
//---------------------
$('#form-capa3').on('submit', function(e){
  e.preventDefault();
  if(enviando){
    entramarMensaje();
    formatoMsgEntramado();
    let msg = formatoMsgTextArea(msgTextArea);
    $('#msg-entramado').val(msg);
    $('#siguiente-capa2').prop('disabled', false);
    $('#siguiente-capa2').focus();
  }else{
    dessegmentarMensaje();
    let msg = formatoMsgTextArea(msgTextArea);
    $('#msg-segmentado').val(msg);
    $('#siguiente-capa4').focus();
  }
});
function dessegmentarMensaje() {
  for (let i = 0; i < msgReceptor.length; i++) {
    let numOrden = msgReceptor[i].substr(0, 8);
    msgReceptor[i] = msgReceptor[i].substr(8);
    let msgSegmento = `[${binaryToDecimal(numOrden)}]${msgReceptor[i]}`;
    msgTextArea[i] = msgSegmento;
  }
}
function binaryToDecimal(binary){
  var decimal = parseInt(binary, 2);
  return decimal;
}
/**
 * Entramamos el msg empaquetado y lo almacena en @msgEntramado
 */
function entramarMensaje() {
  msgEmpaquetado.forEach(e => {
    let trama = macToBinary(emisor.mac) + macToBinary(receptor.mac) + e;
    msgEntramado.push(trama);
  });
}
/**
 * Da un formato a las tramas para mostrarlo en el text area, 
    * y lo almacena en @msgTextArea
 */
function formatoMsgEntramado() {
  for (let i = 0; i < msgTextArea.length; i++) {
    const e = msgTextArea[i];
    let msgTrama = `[${macToBinaryShow(macToBinary(emisor.mac))}/${macToBinaryShow(macToBinary(receptor.mac))}]${e}`;
    msgTextArea[i] = msgTrama;
  }
}
/**
 * Convertimos la mac(ff-ff-ff-ff-ff-ff) a un binario y sin los guiones
 * @param {string} mac MAC del dispositivo
 * @return  {string}
 */
function macToBinary(mac) {
  var binary = '';
  var octetos = mac.split('-');
  octetos.forEach(e => {
    binary += decimalToBinary(parseInt(e,16));
  });
  return binary;
}
/**
 * Damos un formato a la MAC con una separacion de octetos
 * @param {string} macBinary MAC en binario
 * @return  {string}
 */
function macToBinaryShow(macBinary) {
  var newMAC = '';
  for (let i = 0; i < macBinary.length; i+=8) {
    const octeto = macBinary.substr(i,8);
    newMAC += octeto;
    if(i + 8 < macBinary.length){
      newMAC += '-';
    }
  }
  return newMAC;
}
//---------------------------------
// CAPA DE ENLACE DE DATOS (Nro. 2)
//---------------------------------
$('#form-capa2').on('submit', function(e){
  e.preventDefault();
  if(enviando){
    let msg = formatoMsgTextArea(msgEntramado, true);
    $('#msg-binario').val(msg);
    $('#siguiente-capa1').prop('disabled', false);
    $('#siguiente-capa1').focus();
  }else{
    desempaquetarMensaje();
    let msg = formatoMsgTextArea(msgTextArea);
    $('#msg-empaquetado').val(msg);
    $('#siguiente-capa3').focus();
  }
});
function desempaquetarMensaje() {
  let ipOrigen = msgReceptor[0].substr(0, 32);
  let ipDestino = msgReceptor[0].substr(32, 32);

  for (let i = 0; i < msgReceptor.length; i++) {
    msgReceptor[i] = msgReceptor[i].substr(64);
  }
  
  for (let i = 0; i < msgReceptor.length; i++) {
    const e = msgReceptor[i];
    let msgPaquete = `[${ipToBinaryShow(ipOrigen)}/${ipToBinaryShow(ipDestino)}]${e}`;
    msgTextArea[i] = msgPaquete;
  }
}
//------------------------
// CAPA DE FISICA (Nro. 1)
//------------------------
var contenedorVoltajes = document.querySelector('.contenedor-voltaje');
document.querySelector('#siguiente-capa1').addEventListener('click', function (e) {
  e.preventDefault();
  if(enviando){
    var mensajeVoltaje = document.querySelector('#msg-binario').value;
    crearVoltajes(mensajeVoltaje);
    $('#btn-finalizar').focus();
    $('#btn-finalizar').prop('disabled', false);
  }else{
    desentramarMensaje();
    let msg = formatoMsgTextArea(msgTextArea);
    $('#msg-entramado').val(msg);
    $('#siguiente-capa2').focus();
  }
});
function desentramarMensaje() {
  let macOrigen = msgReceptor[0].substr(0, 48);
  let macDestino = msgReceptor[0].substr(48, 48);

  for (let i = 0; i < msgReceptor.length; i++) {
    msgReceptor[i] = msgReceptor[i].substr(96);
  }
  
  for (let i = 0; i < msgReceptor.length; i++) {
    const e = msgReceptor[i];
    let msgTrama = `[${macToBinaryShow(macOrigen)}/${macToBinaryShow(macDestino)}]${e}`;
    msgTextArea[i] = msgTrama;
  }
}
function crearVoltajes(msg) {
  var cantVoltajeMax = 13 * 8;//13bytes
  if(msg.length < cantVoltajeMax){
    cantVoltajeMax = msg.length;
  }
  insertarSeparadorVolaje();
  if(msg[0] == '0'){
    insertarSeparadorVolaje();
  }
  for (let i = 0; i < cantVoltajeMax; i++) {
    const e = msg[i];
    
    if(e == '0'){
      insertarVolaje0();
      if(e == msg[i-1]){
        insertarVolaje0();
        insertarVolaje0();
      }
      insertarSeparadorVolaje();
    }else{
      if(e == msg[i+1] || e == msg[i-1]){
        if(msg[i-1] == '0' && e == msg[i+1]){
          insertarVolajeRight1();
        }
        if(e == msg[i+1] && e == msg[i-1]){
          insertarVolajeCenter1();
        }
        if(msg[i+1] == '0'){
          insertarVolajeLeft1();
          insertarSeparadorVolaje();
        }
      }else{
        insertarVolaje1();
        insertarSeparadorVolaje();
      }
    }
  }
  if(msg[cantVoltajeMax-1] == '0'){
      insertarSeparadorVolaje();
  }
  contenedorVoltajes.style.width = "max-content";
  contenedorVoltajes.style.transform = "translateX(-100%)";
  var tiempo = ((cantVoltajeMax * 60) / 1200) * 20000;
  console.log(tiempo);
  animarVoltajes(tiempo);
  eliminarVoltajes(tiempo);
}
function eliminarVoltajes(tiempo = 0) {
  setTimeout(() => {
    var voltajes = document.querySelectorAll('.voltaje');
    voltajes.forEach(e => {
      contenedorVoltajes.removeChild(e);
    });
  }, tiempo);
}
function insertarSeparadorVolaje() {
  var voltaje = document.createElement("div");
  voltaje.classList.add('voltaje', 'cuadrado-voltaje');
  contenedorVoltajes.insertAdjacentElement("afterbegin", voltaje);
}
function insertarVolaje1() {
  var voltaje = document.createElement("div");
  voltaje.classList.add('voltaje', 'vol1');
  contenedorVoltajes.insertAdjacentElement("afterbegin", voltaje);
}
function insertarVolajeLeft1() {
  var voltaje = document.createElement("div");
  voltaje.classList.add('voltaje', 'vol1', 'vol1-left');
  contenedorVoltajes.insertAdjacentElement("afterbegin", voltaje);
}
function insertarVolajeRight1() {
  var voltaje = document.createElement("div");
  voltaje.classList.add('voltaje', 'vol1', 'vol1-right');
  contenedorVoltajes.insertAdjacentElement("afterbegin", voltaje);
}
function insertarVolajeCenter1() {
  var voltaje = document.createElement("div");
  voltaje.classList.add('voltaje', 'vol1', 'vol1-center');
  contenedorVoltajes.insertAdjacentElement("afterbegin", voltaje);
}
function insertarVolaje0() {
  var voltaje = document.createElement("div");
  voltaje.classList.add('voltaje', 'vol0');
  contenedorVoltajes.insertAdjacentElement("afterbegin", voltaje);
}
var animacionVoltajes;
function animarVoltajes(tiempo) {
  animacionVoltajes = contenedorVoltajes.animate([
    { transform: 'translateX(-100%)' },
    { transform: 'translateX(100%)' }
    ], {
    duration: tiempo,
    easing: "linear"
  });
}
function limpiarTextAreas() {
  $('#mensaje').val('');
  $('#msg-encriptado').val('');
  $('#msg-traducido').val('');
  $('#conexion').val('');
  $('#msg-segmentado').val('');
  $('#msg-empaquetado').val('');
  $('#msg-entramado').val('');
  $('#msg-binario').val('');
}
//------------------------
// ENVIO DE DATOS (Nro. 0)
//------------------------
$('#btn-finalizar').on('click', function(e){
  e.preventDefault();
  limpiarTextAreas();
  animacionVoltajes.pause();
  eliminarVoltajes();
  $('#siguiente-envio-datos').prop('disabled', false);
});
$('#siguiente-envio-datos').on('click', function(e){
  e.preventDefault();
  msgReceptor = msgEntramado;
  enviando = false;
  let msg = formatoMsgTextArea(msgReceptor, true);
  $('#msg-binario').val(msg);
  $('#siguiente-capa1').focus();
});

