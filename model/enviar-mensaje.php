<?php
    if(isset($_POST)){
        if(isset($_POST['accion']) && $_POST['accion'] == 'encriptar'){
            $mensaje = $_POST['mensaje'];

            $mensaje_encriptado = base64_encode($mensaje);
            $mensaje_binario = textToBinary($mensaje_encriptado);
            $respuesta = array(
                'respuesta' => 'exito',
                'msgEncriptado' => $mensaje_encriptado,
                'msgBinario' => $mensaje_binario
            );
            die(json_encode($respuesta));
        }
        if(isset($_POST['accion']) && $_POST['accion'] == 'desencriptar'){
            $mensaje = $_POST['mensaje'];

            $mensaje_desencriptado = base64_decode($mensaje);
            $respuesta = array(
                'respuesta' => 'exito',
                'msgNatural' => $mensaje_desencriptado
            );
            die(json_encode($respuesta));
        }
    }

    function textToBinary($texto) 
    { 
        if(!empty($texto)){
            $len = strlen($texto); 
            $binary = ''; 
            for($i = 0; $i < $len; $i++  ) 
            { 
                $binary .= strlen(decbin(ord($texto[$i]))) < 8 ? str_pad(decbin(ord($texto[$i])), 8, 0, STR_PAD_LEFT) : decbin(ord($texto[$i])); 
            } 
            return $binary; 
        }
        
    }
?>