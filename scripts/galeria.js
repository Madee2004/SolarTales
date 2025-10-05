document.addEventListener("DOMContentLoaded", () => {
  const planets = document.querySelectorAll(".planet");
  const orbits = document.querySelectorAll(".orbit");

  // ===== LIBRO =====
  const modal = document.getElementById("bookModal");
  const book3D = document.getElementById("book3D");
  const next = document.getElementById("nextPage");
  const prev = document.getElementById("prevPage");
  const close = document.getElementById("closeBook");
  const bookTitle = document.getElementById("bookTitle");

  const totalPages = 14;
  let currentPage = 1;

  // Imagen genérica por capítulo
  const chapterImages = {
    "Llamarada Solar": "images/solfacha.png",
    "CME": "images/cme.jpg",
    "Clima Espacial": "images/spaceweather.jpg",
    "Consecuencias": "images/earthstorm.jpg",
  };

  // ===== FUNCIONES DEL LIBRO =====
  function resetZIndex() {
    const pages = [...book3D.querySelectorAll(".page")];
    pages.forEach((pg, idx) => (pg.style.zIndex = totalPages - idx));
  }

  // Mostrar página actual con desvanecimiento
  function showPage(index) {
    const pages = book3D.querySelectorAll(".page");
    pages.forEach((p, i) => {
      p.classList.toggle("active", i === index - 1);
    });
  }

  function resetBook() {
    book3D.querySelectorAll(".page").forEach((p) => {
      p.classList.remove("active");
    });
    resetZIndex();
    currentPage = 1;
    showPage(1);
  }

  // ===== ABRIR LIBRO =====
  // === ABRIR LIBRO Y CARGAR DATOS DEL PLANETA ===
  planets.forEach((planet) => {
    planet.addEventListener("click", () => {
      modal.classList.add("active");
      resetBook();

      // Título principal
      bookTitle.textContent = planet.dataset.title || "";

      // Cargar texto e imagen por página
      for (let i = 1; i <= totalPages; i++) {
        const p = document.getElementById(`p${i}`);
        const img = document.getElementById(`img${i}`);

        // Texto de la página
        if (p) p.textContent = planet.dataset[`p${i}`] || "";

        // Imagen de la página
        const customImg = planet.dataset[`img${i}`]; // lee data-imgN
        img.src = customImg ? customImg : "images/a.png"; // usa la tuya o una por defecto
      }
    });
  });


  // ===== NAVEGACIÓN ENTRE PÁGINAS =====
  next.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      showPage(currentPage);
    }
  });

  prev.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      showPage(currentPage);
    }
  });

  // ===== CERRAR LIBRO =====
  close.addEventListener("click", () => {
    modal.classList.remove("active");
    resetBook();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      resetBook();
    }
  });

  // ===== MANTENER TEXTO DE PLANETAS HORIZONTAL =====
  function keepTextUpright() {
    orbits.forEach((orbit) => {
      const m = getComputedStyle(orbit).transform;
      if (m && m !== "none") {
        const match = m.match(/matrix\(([-\d.,\s]+)\)/);
        if (match) {
          const [a, b] = match[1].split(",").map(Number);
          const angle = Math.atan2(b, a);
          const planet = orbit.querySelector(".planet");
          if (planet) planet.style.rotate = `${-angle}rad`;
        }
      }
    });
    requestAnimationFrame(keepTextUpright);
  }

  keepTextUpright();
});
