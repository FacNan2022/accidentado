; (function () {
    'use strict'

    var palabras = [
        'DIRECCION',
        'PRIORIDAD',
        'DESCANSO',
        'ALGORITMO',
        'PROGRAMA',
        'CAPACITAR',
        'CONECTAR',
        'EQUILIBRIO',
        'CREAR',
        'PASION'
    ]

    // variable para almacenar la configuracion actual
    var juego = null
    // para ver si ya se ha enviado alguna alerta
    var finalizado = false


    var $html = {
        auto: document.getElementById('auto'),
        explosion: document.getElementById('explosion'),
        acertada: document.querySelector('.correcta'),
        incorrecta: document.querySelector('.incorrecto'),
        bandera: document.getElementById('bandera')
    }

    function dibujar(juego) {
        // Actualizar la imagen del hombre
        var $elemento
        
        $elemento = $html.auto
      
   
        var estado = juego.estado
        if (estado === 15) {
            estado = juego.previo
        }
        $elemento.src = './imagen/estado-correcto/0' + estado + '.png'
       
        //letras correctas 
        var palabra = juego.palabra
        var acertada = juego.acertada
        $elemento = $html.acertada
        // borramos los elementos anteriores
        $elemento.innerHTML = ''
        for (let letra of palabra) {
            let $span = document.createElement('span')
            let $txt = document.createTextNode('')
            if (acertada.has(letra)) {
                $txt.nodeValue = letra
            }
            $span.setAttribute('class', 'letra acertada')
            $span.appendChild($txt)
            $elemento.appendChild($span)
        }

        // Creamos las letras erradas
        var incorrecta = juego.incorrecta
        $elemento = $html.incorrecta
        // Borramos los elementos anteriores
        $elemento.innerHTML = ''
        for (let letra of incorrecta) {
            let $span = document.createElement('span')
            let $txt = document.createTextNode(letra)
            $span.setAttribute('class', 'letra incorrecta')
            $span.appendChild($txt)
            $elemento.appendChild($span)
        }
    }

    function adivinar(juego, letra) {
        var estado = juego.estado
        // Si ya se ha perdido, o ganado, no hay que hacer nada
        if (estado === 1 || estado === 15) {
            return
        }

        var adivinado = juego.acertada
        var errado = juego.incorrecta
        // Si ya hemos adivinado o errado la letra, no hay que hacer nada
        if (adivinado.has(letra) || errado.has(letra)) {
            return
        }

        var palabra = juego.palabra
        var letras = juego.letras
        // Si es letra de la palbra
        if (letras.has(letra)) {
            // agregamos a la lista de letras adivinadas
            adivinado.add(letra)
            //Actualizar el Estado
            juego.estado--
            // actualizamos las letras restantes
            juego.restante--
            

            // Si ya se ha ganado, debemos indicarlo
            if (juego.restante === 0) {
                juego.previo = juego.estado
                juego.estado = 1
            }
        } else {
            // Si no es letra de la palabra, acercamos al auto a la explosion
            juego.estado++
            // Agregamos la letra, a la lista de letras erradas
            errado.add(letra)
        }
    }

    window.onkeypress = function adivinarLetra(e) {
        var $explosion
        var letra = e.key
        var $elemento
        
        $elemento = $html.auto
        letra = letra.toUpperCase()
        if (/[^A-ZÑ]/.test(letra)) {
            return
        }
        adivinar(juego, letra)
        var estado = juego.estado
     $explosion= $html.explosion
        if (estado === 1 && !finalizado) {
            setTimeout(alertaGanado, 1000)
            finalizado = true
        } else if (estado === 14 && !finalizado) {
            let palabra = juego.palabra
            let fn = alertaPerdido.bind(undefined, palabra)
            setTimeout(fn, 1000)
            $explosion.src='https://i.gifer.com/origin/d7/d7ac4f38b77abe73165d85edf2cbdb9e_w200.gif'
            document.getElementById('explosion').style.visibility="visible";
            finalizado = true
          
        }
        dibujar(juego)
    }

    window.iniciarJuego = function iniciarJuego(){
        document.getElementById('presentacion').style.visibility= "hidden";
        document.querySelector('.botonesInicio').style.display = "none";
        document.querySelector('.juego').style.visibility = "visible";
    }

    window.agregarPalabra = function agregarPalabra(){
        let dato = document.getElementById("texto").value ;
        document.getElementById("texto").style.visibility = "visible";
        palabras.push(dato);
        document.getElementById("texto").value = '';
        console.log(palabras)
    }

    window.nuevaJugada = function nuevaJugada() {
        var palabra = palabraAleatoria()
        juego = {}
        juego.palabra = palabra
        juego.estado = 7
        juego.incorrecta = 7
        juego.acertada = new Set()
        juego.incorrecta = new Set()
        finalizado = false

        var letras = new Set()
        for (let letra of palabra) {
            letras.add(letra)
        }
        juego.letras = letras
        juego.restante = letras.size
        document.getElementById('explosion').style.visibility="hidden";

        dibujar(juego)
        console.log(juego)
    }


    window.desistir = function desistir() {
        var palabra = juego.palabra
        var $elemento = $html.auto
        var $explosion =  $html.explosion
        swal({
            title:'Lo siento, perdiste... la palabra era: ' + palabra,
            icon:'https://i.gifer.com/JEq9.gif',
            button: 'cerrar',
            dangerMode:true
        });
    $elemento.src ='./imagen/estado-correcto/014.png'
    $explosion.src='https://i.gifer.com/origin/d7/d7ac4f38b77abe73165d85edf2cbdb9e_w200.gif'
    document.getElementById('explosion').style.visibility= "visible";
    }
    function palabraAleatoria() {
        var index = ~~(Math.random() * palabras.length)
        return palabras[index]
    }
    var $bandera
    $bandera=$html.bandera


    function alertaGanado() {
        swal({
            icon:'https://www.gifsanimados.org/data/media/1477/coche-de-carreras-imagen-animada-0012.gif',
            title:'¡¡¡Felicidades, ganaste!!!',
            button: 'cerrar',
            dangerMode:true
        });
        $elemento.src='accidentado/014.png'
        $explosion.src='https://i.gifer.com/origin/d7/d7ac4f38b77abe73165d85edf2cbdb9e_w200.gif'
    }
    

    function alertaPerdido(palabra) {
        swal({
            title:'Lo siento, perdiste... la palabra era: ' + palabra,
            icon:'https://i.gifer.com/JEq9.gif',
            button: 'cerrar',
            dangerMode:true
        });
    }

    nuevaJugada()

}())