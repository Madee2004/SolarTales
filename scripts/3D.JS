// --- 1. CONFIGURACIÓN BÁSICA DE THREE.JS (El Sol) ---

const container = document.getElementById('container-3d');
let scene, camera, renderer, sun;

function initThreeJS() {
    // 1. ESCENA
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Fondo negro

    // 2. CÁMARA
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2;

    // 3. RENDERIZADOR
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 4. CREAR EL OBJETO 3D (EL SOL - UNA ESFERA)
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    // Usamos un material que emite luz (MeshBasicMaterial para simplicidad, o MeshLambertMaterial con luz)
    // Para que "brille" sin necesidad de texturas complejas, le daremos un color brillante.
    const material = new THREE.MeshBasicMaterial({ color: 0xffa500, wireframe: false }); 
    sun = new THREE.Mesh(geometry, material);
    scene.add(sun);
    
    // Opcional: Agregar una luz ambiental para que se vea mejor
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Opcional: Agregar una luz puntual para simular el brillo solar
    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);


    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// 5. BUCLE DE ANIMACIÓN
function animate() {
    requestAnimationFrame(animate);
    
    // Rotación suave continua para simular el giro solar
    sun.rotation.y += 0.005; 
    
    renderer.render(scene, camera);
}

initThreeJS();
animate();


// --- 2. DATOS PARA LA INTERACCIÓN ---

const curiousFacts = [
    "El Sol es una estrella de tipo G (enana amarilla). Su edad es de unos 4.600 millones de años.",
    "Tarda aproximadamente 25 días en rotar sobre su eje en el ecuador, ¡y 36 días en sus polos!",
    "La energía generada en el núcleo del Sol tarda cerca de 100,000 años en llegar a la superficie."
];

const spaceWeatherInfo = {
    // Información adaptada y simplificada basada en el sitio de GOES-R
    CoronalMassEjection: "Una CME es una liberación masiva de plasma y campo magnético del Sol. Pueden causar tormentas geomagnéticas en la Tierra, afectando satélites y redes eléctricas.",
    SolarFlares: "Las erupciones solares son explosiones repentinas de radiación. Se clasifican por intensidad (A, B, C, M, X) y pueden causar apagones de radio a corto plazo en la Tierra.",
    SolarWind: "El viento solar es un flujo de partículas cargadas que emana constantemente del Sol. Es lo que forma las hermosas auroras boreales y australes al interactuar con el campo magnético de la Tierra."
};

// --- 3. LÓGICA DE BOTONES E INTERACCIÓN ---

const btnFact = document.getElementById('btn-curious-fact');
const btnWeather = document.getElementById('btn-space-weather');
const dataDisplay = document.getElementById('data-display');
let factIndex = 0;

// Función para mostrar un dato curioso y animar el Sol
btnFact.addEventListener('click', () => {
    // 1. Mostrar el dato
    const fact = curiousFacts[factIndex];
    dataDisplay.innerHTML = `<p><strong>Dato Curioso #${factIndex + 1}:</strong> ${fact}</p>`;
    
    // 2. Animar el Sol: hacerlo "pulsar" (cambio de escala)
    sun.scale.set(1.1, 1.1, 1.1);
    setTimeout(() => sun.scale.set(1, 1, 1), 200);

    // 3. Avanzar al siguiente dato
    factIndex = (factIndex + 1) % curiousFacts.length;
});

// Función para mostrar la información del clima espacial con botones internos
btnWeather.addEventListener('click', () => {
    // 1. Mostrar los botones de clima espacial
    dataDisplay.innerHTML = `
        <p>Selecciona un fenómeno de clima espacial para ver su explicación:</p>
        <button id="btn-cme" class="sub-button">Erupción de Masa Coronal (CME)</button>
        <button id="btn-flares" class="sub-button">Llamaradas Solares</button>
        <button id="btn-wind" class="sub-button">Viento Solar</button>
    `;

    // 2. Agregar la lógica a los nuevos sub-botones
    document.getElementById('btn-cme').addEventListener('click', () => {
        showSpaceWeather('CME');
    });
    document.getElementById('btn-flares').addEventListener('click', () => {
        showSpaceWeather('Flares');
    });
    document.getElementById('btn-wind').addEventListener('click', () => {
        showSpaceWeather('Wind');
    });
    
    // Animación 3D: Hacer que el sol gire más rápido para indicar alerta o cambio de foco
    sun.rotation.x = 0; // Reiniciar
    sun.rotation.z += 0.1;
});

function showSpaceWeather(type) {
    let text = '';
    
    // Actualizar el material (simulando actividad)
    if (type === 'CME') {
        text = spaceWeatherInfo.CoronalMassEjection;
        sun.material.color.set(0xff0000); // Rojo intenso para alerta
    } else if (type === 'Flares') {
        text = spaceWeatherInfo.SolarFlares;
        sun.material.color.set(0xffff00); // Amarillo brillante para llamarada
    } else if (type === 'Wind') {
        text = spaceWeatherInfo.SolarWind;
        sun.material.color.set(0x00ff00); // Verde para el flujo constante
    }
    
    // Reemplazar solo el contenido del área de datos (o usar un sub-div)
    dataDisplay.innerHTML = `
        <p><strong>Clima Espacial:</strong></p>
        <p>${text}</p>
    `;
}