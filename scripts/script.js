// Inicialización de la aplicación
class AplicacionInicio {
    constructor() {
        this.velocidadPlanetas = 1;
        this.estrellasCapturadas = 0;
        this.juegoActivo = false;
        this.inicializarApp();
    }

    inicializarApp() {
        this.crearSistemaSolar();
        this.crearConstelaciones();
        this.crearCometas();
        this.crearAsteroides();
        this.configurarControles();
        this.configurarAstronauta();
        this.configurarJuego();
        this.configurarEfectosEspeciales();
    }

    // ===== SISTEMA SOLAR INTERACTIVO =====
    crearSistemaSolar() {
        const planetas = document.querySelectorAll('.planeta');
        
        planetas.forEach(planeta => {
            // Efecto hover con información
            planeta.addEventListener('mouseenter', (e) => {
                this.mostrarInfoPlaneta(e.target);
            });
            
            planeta.addEventListener('mouseleave', () => {
                this.ocultarInfoPlaneta();
            });

            // Efecto al hacer clic
            planeta.addEventListener('click', (e) => {
                this.activarEfectoPlaneta(e.target);
            });
        });

        // Animación continua de planetas
        this.animarPlanetas();
    }

    animarPlanetas() {
        const orbitas = document.querySelectorAll('.orbita');
        
        orbitas.forEach(orbita => {
            const velocidadBase = parseFloat(getComputedStyle(orbita).animationDuration);
            orbita.style.animationDuration = `${velocidadBase / this.velocidadPlanetas}s`;
        });

        // Lunas también se mueven
        const lunas = document.querySelectorAll('.luna');
        lunas.forEach(luna => {
            luna.style.animationDuration = `${2 / this.velocidadPlanetas}s`;
        });
    }

    mostrarInfoPlaneta(planeta) {
        const nombre = planeta.dataset.planeta;
        const info = {
            mercurio: 'El planeta más cercano al Sol',
            venus: 'Conocido como el planeta gemelo de la Tierra',
            tierra: 'Nuestro hogar en el universo',
            marte: 'El planeta rojo, futuro de la humanidad'
        };

        // Crear tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-planeta';
        tooltip.textContent = `${nombre.charAt(0).toUpperCase() + nombre.slice(1)}: ${info[nombre]}`;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px;
            border-radius: 10px;
            font-size: 0.9rem;
            z-index: 1000;
            pointer-events: none;
            transform: translate(-50%, -100%);
            white-space: nowrap;
        `;

        const rect = planeta.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;

        document.body.appendChild(tooltip);
        planeta.tooltip = tooltip;
    }

    ocultarInfoPlaneta() {
        const tooltips = document.querySelectorAll('.tooltip-planeta');
        tooltips.forEach(tooltip => tooltip.remove());
    }

    activarEfectoPlaneta(planeta) {
        // Efecto visual al hacer clic
        const explosion = document.createElement('div');
        explosion.className = 'explosion-estrella';
        explosion.style.left = planeta.offsetLeft + 'px';
        explosion.style.top = planeta.offsetTop + 'px';
        document.getElementById('efectos-especiales').appendChild(explosion);

        setTimeout(() => {
            explosion.remove();
        }, 600);
    }

    // ===== CONSTELACIONES DINÁMICAS =====
    crearConstelaciones() {
        const constelaciones = [
            { nombre: 'osa mayor', estrellas: [[20, 20], [40, 30], [60, 20], [80, 40], [60, 60], [40, 50], [20, 60]] },
            { nombre: 'casiopea', estrellas: [[80, 20], [70, 40], [80, 60], [90, 40]] },
            { nombre: 'orion', estrellas: [[30, 70], [50, 80], [70, 70], [60, 90], [40, 90]] }
        ];

        const contenedor = document.getElementById('constelaciones');

        constelaciones.forEach((constelacion, index) => {
            const grupo = document.createElement('div');
            grupo.className = 'constelacion';
            grupo.dataset.nombre = constelacion.nombre;

            // Posicionar aleatoriamente
            const left = Math.random() * 80 + 10;
            const top = Math.random() * 80 + 10;
            grupo.style.left = `${left}%`;
            grupo.style.top = `${top}%`;

            // Crear estrellas
            constelacion.estrellas.forEach((estrella, i) => {
                const estrellaElem = document.createElement('div');
                estrellaElem.className = 'estrella';
                estrellaElem.style.left = `${estrella[0]}%`;
                estrellaElem.style.top = `${estrella[1]}%`;
                estrellaElem.style.animationDelay = `${i * 0.5}s`;
                grupo.appendChild(estrellaElem);
            });

            // Conectar estrellas con líneas
            for (let i = 0; i < constelacion.estrellas.length - 1; i++) {
                const linea = this.crearLinea(
                    constelacion.estrellas[i],
                    constelacion.estrellas[i + 1]
                );
                grupo.appendChild(linea);
            }

            // Efecto interactivo
            grupo.addEventListener('click', () => {
                this.activarConstelacion(grupo);
            });

            contenedor.appendChild(grupo);
        });
    }

    crearLinea(puntoA, puntoB) {
        const linea = document.createElement('div');
        linea.className = 'linea';

        const dx = puntoB[0] - puntoA[0];
        const dy = puntoB[1] - puntoA[1];
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

        linea.style.width = `${length}%`;
        linea.style.left = `${puntoA[0]}%`;
        linea.style.top = `${puntoA[1]}%`;
        linea.style.transform = `rotate(${angle}deg)`;

        return linea;
    }

    activarConstelacion(constelacion) {
        const estrellas = constelacion.querySelectorAll('.estrella');
        
        estrellas.forEach((estrella, index) => {
            setTimeout(() => {
                estrella.style.animation = 'brilloConstelacion 0.3s infinite alternate';
                setTimeout(() => {
                    estrella.style.animation = '';
                }, 1000);
            }, index * 100);
        });

        // Sonido o efecto adicional podría ir aquí
    }

    // ===== COMETAS Y ASTEROIDES =====
    crearCometas() {
        setInterval(() => {
            this.lanzarCometa();
        }, 3000);
    }

    lanzarCometa() {
        const cometa = document.createElement('div');
        cometa.className = 'cometa';
        
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        
        cometa.style.left = `${startX}%`;
        cometa.style.top = `${startY}%`;

        document.getElementById('cometas').appendChild(cometa);

        // Animación
        const animation = cometa.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`, opacity: 0 }
        ], {
            duration: 2000,
            easing: 'ease-out'
        });

        animation.onfinish = () => {
            cometa.remove();
        };
    }

    crearAsteroides() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.crearAsteroide();
            }, i * 500);
        }
    }

    crearAsteroide() {
        const asteroide = document.createElement('div');
        asteroide.className = 'asteroide';
        
        asteroide.style.left = `${Math.random() * 100}%`;
        asteroide.style.top = `${Math.random() * 100}%`;

        document.getElementById('asteroides').appendChild(asteroide);
    }

    // ===== CONTROLES INTERACTIVOS =====
    configurarControles() {
        document.getElementById('acelerar-planetas').addEventListener('click', () => {
            this.velocidadPlanetas *= 2;
            if (this.velocidadPlanetas > 8) this.velocidadPlanetas = 1;
            this.animarPlanetas();
        });

        document.getElementById('lanzar-cometa').addEventListener('click', () => {
            this.lanzarCometaEspecial();
        });

        document.getElementById('activar-llamaradas').addEventListener('click', () => {
            this.activarLlamaradasSolares();
        });
    }

    lanzarCometaEspecial() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.lanzarCometa();
            }, i * 200);
        }
    }

    activarLlamaradasSolares() {
        const sol = document.querySelector('.sol');
        const llamarada = document.createElement('div');
        llamarada.className = 'llamarada-solar';
        llamarada.style.left = '50%';
        llamarada.style.top = '50%';
        llamarada.style.transform = 'translate(-50%, -50%)';

        document.getElementById('efectos-especiales').appendChild(llamarada);

        setTimeout(() => {
            llamarada.remove();
        }, 1000);
    }

    // ===== ASTRONAUTA INTERACTIVO =====
    configurarAstronauta() {
        const astronauta = document.getElementById('astronauta-interactivo');
        
        astronauta.addEventListener('click', () => {
            this.hacerAstronautaOla();
        });

        astronauta.addEventListener('mouseenter', () => {
            astronauta.style.transform = 'scale(1.1)';
        });

        astronauta.addEventListener('mouseleave', () => {
            astronauta.style.transform = 'scale(1)';
        });
    }

    hacerAstronautaOla() {
        const astronauta = document.getElementById('astronauta-interactivo');
        const brazos = astronauta.querySelector('.brazos');
        
        brazos.style.animation = 'moverBrazos 0.5s ease-in-out 3 alternate';
        
        setTimeout(() => {
            brazos.style.animation = 'moverBrazos 2s ease-in-out infinite alternate';
        }, 1500);
    }

    // ===== MINI JUEGO INTERACTIVO =====
    configurarJuego() {
        const btnJugar = document.getElementById('iniciar-juego');
        const areaJuego = document.getElementById('area-juego');

        btnJugar.addEventListener('click', () => {
            this.iniciarJuego();
        });

        // Permitir que las estrellas sean clickeables
        areaJuego.addEventListener('click', (e) => {
            if (e.target.classList.contains('estrella-fugaz')) {
                this.capturarEstrella(e.target);
            }
        });
    }

    iniciarJuego() {
        if (this.juegoActivo) return;
        
        this.juegoActivo = true;
        this.estrellasCapturadas = 0;
        document.getElementById('contador-estrellas').textContent = '0';
        
        const areaJuego = document.getElementById('area-juego');
        areaJuego.innerHTML = '';

        // Crear estrellas fugaces
        this.intervaloJuego = setInterval(() => {
            if (this.estrellasCapturadas >= 20) {
                this.finalizarJuego();
                return;
            }

            this.crearEstrellaFugaz();
        }, 800);

        // Tiempo límite
        setTimeout(() => {
            if (this.juegoActivo) {
                this.finalizarJuego();
            }
        }, 30000);
    }

    crearEstrellaFugaz() {
        const estrella = document.createElement('div');
        estrella.className = 'estrella-fugaz';
        
        const areaJuego = document.getElementById('area-juego');
        const rect = areaJuego.getBoundingClientRect();
        
        estrella.style.left = `${Math.random() * 90}%`;
        estrella.style.top = `${Math.random() * 90}%`;

        areaJuego.appendChild(estrella);

        // Desaparecer después de un tiempo
        setTimeout(() => {
            if (estrella.parentNode) {
                estrella.remove();
            }
        }, 2000);
    }

    capturarEstrella(estrella) {
        this.estrellasCapturadas++;
        document.getElementById('contador-estrellas').textContent = this.estrellasCapturadas;
        
        // Efecto visual
        estrella.style.background = '#FFD700';
        estrella.style.transform = 'scale(2)';
        estrella.style.opacity = '0';
        
        setTimeout(() => {
            estrella.remove();
        }, 300);

        // Efecto de sonido visual
        this.crearEfectoCaptura(estrella);
    }

    crearEfectoCaptura(elemento) {
        const efecto = document.createElement('div');
        efecto.className = 'explosion-estrella';
        efecto.style.left = elemento.offsetLeft + 'px';
        efecto.style.top = elemento.offsetTop + 'px';
        document.getElementById('efectos-especiales').appendChild(efecto);

        setTimeout(() => {
            efecto.remove();
        }, 600);
    }

    finalizarJuego() {
        this.juegoActivo = false;
        clearInterval(this.intervaloJuego);
        
        const areaJuego = document.getElementById('area-juego');
        areaJuego.innerHTML = `<div style="color: var(--amarillo-sol); font-size: 1.5rem; padding: 50px;">
            ¡Juego terminado! Capturaste ${this.estrellasCapturadas} estrellas
        </div>`;
    }

    // ===== EFECTOS ESPECIALES GLOBALES =====
    configurarEfectosEspeciales() {
        // Efecto de cursor de estrella
        document.addEventListener('mousemove', (e) => {
            this.crearEstelaCursor(e);
        });

        // Efecto de respiración en elementos importantes
        this.efectoRespirar();
    }

    crearEstelaCursor(e) {
        const estela = document.createElement('div');
        estela.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            animation: desvanecerCursor 0.5s forwards;
        `;

        document.body.appendChild(estela);

        setTimeout(() => {
            estela.remove();
        }, 500);
    }

    efectoRespirar() {
        const elementos = document.querySelectorAll('.nasa-logo, .btn-explorar');
        
        elementos.forEach(elemento => {
            setInterval(() => {
                elemento.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    elemento.style.transform = 'scale(1)';
                }, 1000);
            }, 2000);
        });
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new AplicacionInicio();
});

// Agregar animaciones CSS adicionales
const estiloGlobal = document.createElement('style');
estiloGlobal.textContent = `
    @keyframes titilar {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.1); }
    }
    
    @keyframes desvanecerCursor {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0);
        }
    }
    
    @keyframes explosionEstrella {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes expandirLlamarada {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(3);
            opacity: 0;
        }
    }
    
    .tooltip-planeta {
        font-family: 'Nunito', sans-serif !important;
    }
`;
document.head.appendChild(estiloGlobal);