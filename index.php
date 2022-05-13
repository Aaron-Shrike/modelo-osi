<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simulador del Modelo OSI</title>
  <link rel="preconnect" href="https://fonts.gstatic.com">
  <link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@400;700&family=Roboto+Slab:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossorigin="anonymous" />
  <link rel="stylesheet" href="resources/css/style.css">
</head>
<body>
  <header class="header">
    <div id="particles-js"></div>
    <div class="contenido-header">
      <h1>Modelo OSI</h1>
      <a href="informacion.html" class="boton btn-transparente">Ver más</a>
      <a href="index.php#simulador-modelo-osi" class="boton">Simulador</a>
    </div>
  </header>
  <div id="simulador-modelo-osi" class="contenido">
    <section class="dispositivos">
      <div class="container">
        <h2>Dispositivos</h2>
        <div class="capa">
          <form action="" id="form-dispositivos">
            <label for="emisor">Emisor</label>
            <select name="emisor" id="emisor">
              <option value="dispositivo1">IP: 192.23.12.12, MAC: 24-88-90-0-ff-ab (Conectado)</option>
              <option value="dispositivo2">IP: 192.36.14.12, MAC: aa-cd-ef-0-aa-54 (Conectado)</option>
              <option value="dispositivo3">IP: 192.23.12.12, MAC: 25-48-b0-0-ff-ab (Conectado)</option>
              <option value="dispositivo4">IP: 192.24.16.11, MAC: 32-a8-9f-0-ff-56 (Desconectado)</option>
            </select>
            <label for="receptor">Receptor</label>
            <select name="receptor" id="receptor">
            <option value="dispositivo1">IP: 192.23.12.12, MAC: 24-88-90-0-ff-ab (Conectado)</option>
              <option value="dispositivo2">IP: 192.36.14.12, MAC: aa-cd-ef-0-aa-54 (Conectado)</option>
              <option value="dispositivo3">IP: 192.23.12.12, MAC: 25-48-b0-0-ff-ab (Conectado)</option>
              <option value="dispositivo4">IP: 192.24.16.11, MAC: 32-a8-9f-0-ff-56 (Desconectado)</option>
            </select>
            <input type="submit" class="boton btn-grande" value="Simular" id="btn-simular">
          </form>
        </div>
      </div>
    </section>
    <main class="simulador">
      <div class="container capas">
        <h2>Simulador</h2>
        <div class="capa">
          <h3>Capa de Aplicación</h3>
          <form id="form-capa7">
            <label for="mensaje">Mensaje</label>
            <textarea name="mensaje" id="mensaje" cols="30" rows="10"></textarea>
            <input type="hidden" name="accion" value="encriptar">
            <input type="submit" class="boton btn-grande" value="Enviar" id="btn-capa7" disabled>
          </form>
        </div>
        <div class="capa">
          <h3>Capa de Presentación</h3>
          <form id="form-capa6">
            <div class="form-datos">
              <div class="form-box">
                <label for="msg-encriptado">Mensaje encriptado</label>
                <textarea name="msg-encriptado" id="msg-encriptado" cols="30" rows="10"></textarea>
              </div>
              <div class="form-box">
                <label for="msg-traducido">Mensaje traducido</label>
                <textarea name="msg-traducido" id="msg-traducido" cols="30" rows="10"></textarea>
              </div>
            </div>
            <input type="submit" class="boton" value="Siguiente Capa" id="siguiente-capa6" disabled>
          </form>
        </div>
        <div class="capa">
          <h3>Capa de Sesión</h3>
          <form id="form-capa5">
            <label for="conexion">Existe conexión</label>
            <input type="text" name="conexion" id="conexion" disabled>
            <i class="fas fa-check"></i>
            <input type="submit" class="boton" value="Siguiente Capa" id="siguiente-capa5" disabled>
          </form>
        </div>
        <div class="capa">
          <h3>Capa de Transporte</h3>
          <form id="form-capa4">
            <label for="msg-segmentado">Mensaje segmentado</label>
            <textarea name="msg-segmentado" id="msg-segmentado" cols="30" rows="10"></textarea>
            <input type="submit" class="boton" value="Siguiente Capa" id="siguiente-capa4" disabled>
          </form>
        </div>
        <div class="capa">
          <h3>Capa de Red</h3>
          <form id="form-capa3">
            <label for="msg-empaquetado">Mensaje empaquetado</label>
            <textarea name="msg-empaquetado" id="msg-empaquetado" cols="30" rows="10"></textarea>
            <input type="submit" class="boton" value="Siguiente Capa" id="siguiente-capa3" disabled>
          </form>
        </div>
        <div class="capa">
          <h3>Capa de Enlace de Datos</h3>
          <form id="form-capa2">
            <label for="msg-entramado">Mensaje entramado</label>
            <textarea name="msg-entramado" id="msg-entramado" cols="30" rows="10"></textarea>
            <input type="submit" class="boton" value="Siguiente Capa" id="siguiente-capa2" disabled>
          </form>
        </div>
        <div class="capa">
          <h3>Capa de Física</h3>
          <form id="form-capa1">
            <label for="msg-binario">Mensaje convertido</label>
            <textarea name="msg-binario" id="msg-binario" cols="30" rows="10"></textarea>
            <input type="submit" class="boton" value="Siguiente" id="siguiente-capa1" disabled>
          </form>
        </div>
        <div class="capa">
          <div class="campo">
            <h3>Envío de datos</h3>
            <div class="grupo">
              <input type="button" class="boton btn-mini btn-transparente" value="Finalizar" id="btn-finalizar" disabled>
              <input type="button" value="Siguiente" class="boton" id="siguiente-envio-datos" disabled>
            </div>
          </div>
          <div class="envio-datos">
            <div class="dispositivo">
                <p>Emisor</p>
            </div>
            <div class="recorrido">
                <div class="contenedor-voltaje">
                </div>
            </div>
            <div class="dispositivo">
                <p>Receptor</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  <footer>
  </footer>
  <script src="resources/js/jquery.min.js"></script>
  <script src="resources/js/particles.min.js"></script>
  <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js" integrity="sha512-894YE6QWD5I59HgZOGReFYm4dnWc1Qt5NtvYSaNcOP+u1T9qYdvdihz0PPSiiqn/+/3e7Jo4EaG7TubfWGUrMQ==" crossorigin="anonymous"></script> -->
  <script src="resources/js/plugins.js"></script>
  <script src="resources/js/main.js"></script>
</body>
</html>