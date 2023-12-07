var canvas = document.getElementById('ahorcado');
var ctx = canvas.getContext("2d");

var app = {
    palabras: [],
    maxIntentos: 4,
    palabraSeleccionada: "",
    palabraMostrada: [],
    letrasAdivinadas: [],
    intentos: 0,
    muñecoImg: new Image(),
    categoriaSeleccionada: null,
    imagenesErrores: [
        "public/img/error1.png",
        "public/img/error2.png",
        "public/img/error3.png",
        "public/img/error4.png",
    ],
    juegoEnProgreso: false,
    categoriaActual: null,  

    reiniciarConCategoriaActual: function () {
this.categoriaActual = this.categoriaSeleccionada;
var comboCategoria = document.getElementById("categorias");
comboCategoria.value = this.categoriaActual;


this.categoriaSeleccionada = comboCategoria.value;

this.palabraSeleccionada = "";
this.palabraMostrada = [];
this.letrasAdivinadas = [];
this.intentos = 0;
this.juegoEnProgreso = false;

var erroresContainer = document.getElementById("errores");
erroresContainer.innerHTML = "";

ctx.clearRect(0, 0, canvas.width, canvas.height);

this.borrarPlacas();
this.mostrarPlacas();
this.habilitarJuego();
this.muñecoImg.onload = () => {
    this.actualizarPantalla();
    this.dibujarEscenario();
};

this.actualizarPantalla();
this.dibujarEscenario();
this.elegirPalabra();
this.habilitarJuego(); // Ensure the game is enabled


var reintentarBtn = document.getElementById("reiniciar-perdedor-btn");
reintentarBtn.style.display = "none";
},


reiniciarJuego: function () {
// Reset game state
this.palabras = [];
this.maxIntentos = 4;
this.categoriaSeleccionada = "animales";
this.muñecoImg.src = "public/img/muñeco.png";

this.categoriaSeleccionada = this.categoriaActual;

this.reiniciarConCategoriaActual();


},



    

    dibujarEscenario: function () {
        var anchoParte = this.muñecoImg.width / 4;
        var x = 0;
        var y = 0;

        ctx.drawImage(this.muñecoImg, this.intentos * anchoParte, y, anchoParte, this.muñecoImg.height, 100, 1000, canvas.width, canvas.height);
    },

    habilitarJuego: function () {
        var tecladoVirtual = document.getElementById("teclado");
        tecladoVirtual.style.pointerEvents = "auto";
        this.juegoEnProgreso = true;
    },

    elegirPalabra: function () {
        var tecladoVirtual = document.getElementById("teclado");
        tecladoVirtual.style.pointerEvents = "none";

        if (!this.categoriaSeleccionada) {
            return;
        }

        var palabrasPorCategoria = {
            animales_deserticos: ["coyote", "vibora", "armadillo", "escorpion", "lagarto", "camello", "murcielago", "tortuga", "jerbo", "escarabajo"],
            objetos_de_vaquero: ["sombrero", "espuelas", "revolver", "lazo", "montura", "chaleco", "botas", "cinturon", "pañuelo", "fundas"],
            desierto: ["sahara", "atacama", "gobi", "karakum", "arabia", "kalahari", "sonora", "mojave", "thar", "colorado"]
        };

        this.palabras = palabrasPorCategoria[this.categoriaSeleccionada];
        this.palabraSeleccionada = this.palabras[Math.floor(Math.random() * this.palabras.length)];
        this.palabraMostrada = Array(this.palabraSeleccionada.length).fill("_");
        this.letrasAdivinadas = [];
        this.intentos = 0;
        this.muñecoImg.src = "public/img/muñeco.png";

        this.muñecoImg.onload = function () {
            app.actualizarPantalla();
            app.dibujarEscenario();
        };
        this.actualizarPantalla();
        this.dibujarEscenario();
        this.habilitarJuego();
    },

    comprobarLetra: function (letra) {
        if (!this.juegoEnProgreso) {
            return;
        }

        var letraCorrecta = this.palabraSeleccionada.includes(letra);

        if (letraCorrecta) {
            for (var i = 0; i < this.palabraSeleccionada.length; i++) {
                if (this.palabraSeleccionada[i] === letra) {
                    this.palabraMostrada[i] = letra;
                }
            }
        } else {
            this.letrasAdivinadas.push(letra);
            this.intentos++;
        }

        this.actualizarPantalla();
        this.dibujarEscenario();

        if (!letraCorrecta) {
            this.marcarLetraIncorrectaYBorrarPlacas();
        }
        if (this.palabraMostrada.join("") === this.palabraSeleccionada) {
            this.juegoEnProgreso = false;
            document.getElementById("ganador").style.display = "flex";
            document.getElementById("reiniciar-ganador-btn").addEventListener("click", function () {
                app.reiniciarJuego();
                document.getElementById("ganador").style.display = "none";
            });
        } else if (this.intentos >= this.maxIntentos) {
            this.juegoEnProgreso = false;
            document.getElementById("perdedor").style.display = "flex";
            document.getElementById("reiniciar-perdedor-btn").addEventListener("click", function () {
                app.reiniciarJuego();
                document.getElementById("perdedor").style.display = "none";
            });
        }
    },

   

 
    actualizarPantalla: function () {
document.getElementById("palabra").textContent = this.palabraMostrada.join(" ");
document.getElementById("letras").textContent = "Letras ocupadas: " + this.letrasAdivinadas.join(", ");


var teclas = document.querySelectorAll(".tecla");
for (var i = 0; i < teclas.length; i++) {
    var letra = teclas[i].getAttribute("data-letra");

    if (this.letrasAdivinadas.includes(letra)) {
        if (this.palabraSeleccionada.includes(letra)) {
            if (!this.letrasAdivinadas.includes(letra)) {
                teclas[i].style.color = "green";
            }
        } else {
            teclas[i].style.color = "red";
        }
        teclas[i].classList.add("tecla-inactiva", "roja");
    } else {
        teclas[i].style.color = "";
        teclas[i].classList.remove("tecla-inactiva", "roja");
    }
}
},



    mostrarImagenError: function () {
        var erroresContainer = document.getElementById("errores");

        if (this.intentos === 4) {
            erroresContainer.innerHTML = "";
            erroresContainer.innerHTML += `<img src="${this.imagenesErrores[3]}" alt="Error 4" width="100" height="200" style="position: absolute; top: 200px; left: 575px; z-index: 1;">`;
        } else {
            erroresContainer.innerHTML += `<img src="${this.imagenesErrores[this.intentos - 1]}" alt="Error ${this.intentos}" width="100" height="200" style="position: absolute; top: 200px; left: 575px; z-index: 1;">`;
        }

        document.getElementById("teclado").style.zIndex = 2;

        this.borrarPlaca();
    },

  

mostrarBotonReintentar: function () {
var reintentarBtn = document.getElementById("reiniciar-perdedor-btn");

// Verifica si se han alcanzado los 4 intentos y muestra el botón de reintentar
if (this.intentos === this.maxIntentos) {
    reintentarBtn.style.display = "block";
} else {
    reintentarBtn.style.display = "none";
}
},
mostrarPlacas: function () {
var placasContainer = document.getElementById("placas-container");
var numIntentosRestantes = this.maxIntentos - this.intentos;

// Borra todas las placas existentes antes de mostrar las nuevas
placasContainer.innerHTML = "";

var tamanoMaximo = 50;
var tamanoPlaca = Math.min(tamanoMaximo, tamanoMaximo / this.maxIntentos * numIntentosRestantes);

for (var i = 0; i < numIntentosRestantes; i++) {
    var placa = document.createElement("img");
    placa.src = "public/img/placa.png";
    placa.alt = "Placa";
    placa.className = "placa-img";
    placa.style.width = tamanoPlaca + "px";
    placa.style.height = tamanoPlaca + "px";

    placasContainer.appendChild(placa);
}


},

disminuirPlacas: function () {
var placasContainer = document.getElementById("placas-container");
var placas = placasContainer.querySelectorAll('.placa-img');

if (placas.length > 0) {
    // Borra la última placa
    placasContainer.removeChild(placas[placas.length - 1]);
}

// Verifica si se han alcanzado los 4 intentos y muestra el botón de reintentar
if (this.intentos === this.maxIntentos) {
    this.mostrarBotonReintentar();
}
},

mostrarPerdedor: function () {
this.juegoEnProgreso = false;
document.getElementById("perdedor").style.display = "flex";
document.getElementById("reiniciar-perdedor-btn").addEventListener("click", function () {
    app.reiniciarJuego();
    document.getElementById("perdedor").style.display = "none";
});
},




marcarLetraIncorrectaYBorrarPlacas: function () {
if (this.intentos < this.maxIntentos) {
    this.disminuirPlacas();
}

if (this.intentos <= this.imagenesErrores.length) {
    this.muñecoImg.src = this.imagenesErrores[this.intentos - 1];
    this.mostrarImagenError();

    var primeraLetraIncorrecta = this.letrasAdivinadas.find(letra => !this.palabraSeleccionada.includes(letra));
    if (primeraLetraIncorrecta) {
        this.borrarPlacasConLetraRoja();
        this.marcarLetraIncorrectaEnRojo(primeraLetraIncorrecta);
    }
} else if (this.intentos === this.maxIntentos) {
    this.muñecoImg.src = this.imagenesErrores[this.maxIntentos - 1];
    this.mostrarImagenError();
    this.mostrarPerdedor(); // Agrega esta línea para mostrar el div de perdedor
}
},


    marcarLetraIncorrectaEnRojo: function (letra) {
        var teclas = document.querySelectorAll(".tecla");
        for (var i = 0; i < teclas.length; i++) {
            var tecla = teclas[i];
            if (tecla.getAttribute("data-letra") === letra) {
                tecla.style.color = "red";
                tecla.classList.add("tecla-inactiva", "roja");
            }
        }
    },
};
document.getElementById("reiniciar-ganador-btn").addEventListener("click", function () {
document.getElementById("ganador").style.display = "none";
app.mostrarPlacas(); 
});

document.getElementById("reiniciar-perdedor-btn").addEventListener("click", function () {
document.getElementById("perdedor").style.display = "none";
app.mostrarPlacas(); 
});




document.addEventListener("DOMContentLoaded", () => {
    app.mostrarPlacas();
});

document.body.addEventListener("click", () => {
    app.borrarPlaca();
});

var comboCategoria = document.getElementById("categorias");
comboCategoria.addEventListener("change", function () {
    app.categoriaSeleccionada = comboCategoria.value;
    app.elegirPalabra();
});

app.elegirPalabra();

document.addEventListener("keydown", function (event) {
    var letra = event.key.toLowerCase();
    if (/[a-z]/.test(letra) && app.letrasAdivinadas.indexOf(letra) === -1) {
        app.comprobarLetra(letra);
    }
});

var tecladoVirtual = document.getElementById("teclado");
tecladoVirtual.addEventListener("click", function (event) {
    if (event.target.classList.contains("tecla") && !event.target.classList.contains("tecla-inactiva")) {
        var letra = event.target.getAttribute("data-letra");
        app.comprobarLetra(letra);
    }
});

// Nuevas líneas para ocultar las ventanas emergentes
var reiniciarGanadorBtn = document.getElementById("reiniciar-ganador-btn");
var reiniciarPerdedorBtn = document.getElementById("reiniciar-perdedor-btn");

reiniciarGanadorBtn.addEventListener("click", function () {
    app.reiniciarJuego();
    document.getElementById("ganador").style.display = "none";
});

reiniciarPerdedorBtn.addEventListener("click", function () {
    app.reiniciarJuego();
    document.getElementById("perdedor").style.display = "none";
});


