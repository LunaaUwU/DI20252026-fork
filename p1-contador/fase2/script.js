const btnMas = document.getElementById("btn-mas");
const btnMenos = document.getElementById("btn-menos");
const btnBoom = document.getElementById("btn-boom");
const btnDeselect = document.getElementById("btn-deselect");
const btnRandom = document.getElementById("btn-random");
const inputStep = document.getElementById("input-step");
const btnUpload = document.getElementById("btn-upload");
const fileInput = document.getElementById("file-input");

const imgBoom = document.getElementById("img-boom");
const audioBoom = new Audio("explosion.ogg");

const imgCoins = document.getElementById("img-coins");
const audioCoins = new Audio("coins.ogg");

const alumnoContainer = document.getElementById("alumno-container");
const alumnoCards = alumnoContainer.querySelectorAll(".alumno-card");
let numeroAlumnos = alumnoCards.length;

const alumnos = [];
const contadores = [];

for (let i = 1; i <= numeroAlumnos; i++) {
  const alumnoCard = document.getElementById(`alumno${i}-container`);
  const contadorElem = document.getElementById(`contador-alumno${i}`);

  if (alumnoCard && contadorElem) {
    alumnos.push(alumnoCard);
    contadores.push({
      contador: parseInt(contadorElem.textContent),
      selected: false,
      span: contadorElem
    });

    alumnoCard.addEventListener("click", () => {
      const alumnoData = contadores[i - 1];
      alumnoData.selected = !alumnoData.selected;
      alumnoCard.style.border = alumnoData.selected
        ? "3px solid black"
        : "3px solid transparent";
    });
  }
}

const alumno0Card = document.getElementById("alumno0-container");
const contadorProfe = document.getElementById("contador-profe");

const alumno0Data = {
  contador: parseInt(contadorProfe.textContent),
  selected: false,
  span: contadorProfe
};

alumnos.push(alumno0Card);
contadores.push(alumno0Data);

alumno0Card.addEventListener("click", () => {
  alumno0Data.selected = !alumno0Data.selected;
  alumno0Card.style.border = alumno0Data.selected
    ? "3px solid black"
    : "3px solid transparent";
});

function actualizarContador() {
  contadores.forEach(contador => {
    contador.span.textContent = contador.contador.toFixed(1);

    contador.span.classList.add("changed");
    setTimeout(() => contador.span.classList.remove("changed"), 200);

    if (contador.contador > 7) {
      contador.span.style.color = "green";
    } else if (contador.contador > 5) {
      contador.span.style.color = "orange";
    } else if (contador.contador > 3) {
      contador.span.style.color = "red";
    } else {
      contador.span.style.color = "black";
    }
  });
}

// + button
function plusButton() {
  contadores.forEach(contador => {
    if (contador.selected) {
      contador.contador = Math.min(contador.contador + getSteps(), 10);
      contador.contador = Math.round(contador.contador * 10) / 10;
    }
  });
  actualizarContador();
}

// - button
function minusButton() {
  contadores.forEach(contador => {
    if (contador.selected) {
      contador.contador = Math.max(contador.contador - getSteps(), 0);
      contador.contador = Math.round(contador.contador * 10) / 10;
    }
  });
  actualizarContador();
}

btnUpload.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const names = text.split("\n").map(name => name.trim()).filter(name => name);

    // Clear previous alumnos
    const alumnoContainer = document.getElementById("alumno-container");
    alumnoContainer.innerHTML = "";

    alumnos.length = 0;
    contadores.length = 0;

    names.forEach((name, index) => {
      const card = document.createElement("div");
      card.classList.add("alumno-card");
      card.id = `alumno${index + 1}-container`;

      const h2 = document.createElement("h2");
      h2.textContent = name;
      h2.id = `alumno${index + 1}`;

      const span = document.createElement("span");
      span.classList.add("contador");
      span.id = `contador-alumno${index + 1}`;
      span.textContent = "10";

      card.appendChild(h2);
      card.appendChild(span);
      alumnoContainer.appendChild(card);

      alumnos.push(card);
      contadores.push({
        contador: 10,
        selected: false,
        span: span
      });

      card.addEventListener("click", () => {
        const data = contadores[index];
        data.selected = !data.selected;
        card.style.border = data.selected
          ? "3px solid black"
          : "3px solid transparent";
      });
    });
    alumnos.push(alumno0Card);
    contadores.push(alumno0Data);

    actualizarContador();
  };
  reader.readAsText(file);
});

btnMas.addEventListener("click", plusButton);
btnMenos.addEventListener("click", minusButton);

// Boom button
btnBoom.addEventListener("click", () => {
  let hasExploded = false;

  contadores.forEach(contador => {
    if (contador.selected) {
      contador.contador = 0;
      hasExploded = true;
    }
  });

  if (hasExploded) {
    imgBoom.src = "blood.gif";
    imgBoom.style.zIndex = 9999;
    imgBoom.style.opacity = 1;
    audioBoom.play();

    setTimeout(() => {
      imgBoom.style.zIndex = "-9999";
      imgBoom.src = "";
      imgBoom.style.opacity = 0;
    }, 2000);
  }
  actualizarContador();
});

// Deselect All button
btnDeselect.addEventListener("click", () => {
  contadores.forEach((contador, index) => {
    contador.selected = false;
    alumnos[index].style.border = "3px solid transparent";
  });
});

// Random button
btnRandom.addEventListener("click", () => {
  let hasChanged = false;
  contadores.forEach(contador => {
    if (contador.selected) {
      contador.contador = Math.random() * (10 - 0.1) + 0.1;
      contador.contador = Math.round(contador.contador * 10) / 10;
      hasChanged = true;
    }
  });

  if (hasChanged) {
    imgCoins.src = "1-million-coins.gif";
    imgCoins.style.zIndex = 9999;
    imgCoins.style.opacity = 1;
    audioCoins.play();
    disableButtons(true);

    setTimeout(() => {
      imgCoins.style.zIndex = "-9999";
      imgCoins.src = "";
      imgCoins.style.opacity = 0;
      disableButtons(false);
    }, 2000);
  }

  actualizarContador();
});

// Keyboard shortcuts
document.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
    case "ArrowRight":
      plusButton();
      break;
    case "ArrowDown":
    case "ArrowLeft":
      minusButton();
      break;
  }
});

function getSteps() {
  let step = parseFloat(inputStep.value);
  step = Math.max(0.1, Math.min(step, 10));
  inputStep.value = step;
  return step;
}

function disableButtons(disabled) {
  btnMas.disabled = disabled;
  btnMenos.disabled = disabled;
  btnBoom.disabled = disabled;
  btnDeselect.disabled = disabled;
  btnRandom.disabled = disabled;
}

// Initial update
actualizarContador();

// Modo Fiesta
let modoFiesta = false;
const audioFiesta = new Audio("audio-aprobado.mp3");

document.addEventListener("keydown", (event) => {
  if (event.key === "f" || event.key === "F") {
    if (!modoFiesta) {
      activarModoFiesta();
    } else {
      desactivarModoFiesta();
    }
  }
});

function activarModoFiesta() {
  modoFiesta = true;
  audioFiesta.play();
  document.body.style.backgroundImage = "url('aprobado.gif')";
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
}

function desactivarModoFiesta() {
  modoFiesta = false;
  audioFiesta.pause();
  document.body.style.backgroundImage = "";
}
