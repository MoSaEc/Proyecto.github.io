// Objeto para almacenar las tareas
let tareas = [];

// Obtén los elementos de audio, imagen y mensaje
const audio = document.getElementById('audio');
const imagen = document.getElementById('imagen');
const imagen2 = document.getElementById('imagen2');
const mensaje = document.getElementById('mensaje');

// Función para crear nuevas tareas
function crearTarea() {
    const inputValue = document.getElementById("nueva-tarea").value;
    const categoriaValue = document.getElementById("categoria-tarea").value;
    const fechaInicioValue = document.getElementById("fecha-inicio").value;
    const fechaFinValue = document.getElementById("fecha-fin").value;

    if (inputValue === "") {
        alert("Por favor, ingresa una tarea antes de agregarla.");
        return;
    }

    const fechaInicio = new Date(fechaInicioValue);
    const fechaFin = new Date(fechaFinValue);

    // Verificar si la fecha de finalización es anterior a la fecha de inicio
    if (fechaFin < fechaInicio) {
        alert("La fecha de finalización no puede ser anterior a la fecha de inicio.");
        return;
    }

    // Agregar la tarea al array de tareas, incluyendo las fechas
    tareas.push({
        texto: inputValue,
        completada: false,
        categoria: categoriaValue,
        fechaInicio: fechaInicioValue,
        fechaFin: fechaFinValue
    });

    mostrarTareas();

    // Limpiar los campos de entrada después de agregar la tarea
    document.getElementById("nueva-tarea").value = "";
    document.getElementById("fecha-inicio").value = "";
    document.getElementById("fecha-fin").value = "";
}


// Función para mostrar las tareas
function mostrarTareas() {
    const listaTareas = document.getElementById("lista-tareas");
    listaTareas.innerHTML = "";

    tareas.forEach((tarea, index) => {
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.textContent = tarea.texto + ` (Inicio: ${tarea.fechaInicio}, Fin: ${tarea.fechaFin})`;
        li.appendChild(span);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = tarea.completada;
        checkbox.addEventListener("change", () => marcarTarea(index));
        li.appendChild(checkbox);

        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.addEventListener("click", () => eliminarTarea(index));
        li.appendChild(botonEliminar);

        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.addEventListener("click", () => editarTarea(index));
        li.appendChild(botonEditar);

        listaTareas.appendChild(li);
    });

    localStorage.setItem('tareas', JSON.stringify(tareas));
}


// Función para marcar una tarea como completada
function marcarTarea(index) {
    tareas[index].completada = !tareas[index].completada;
    mostrarTareas();

    // Verificar si todas las tareas están completadas
    if (verificarTareasCompletadas()) {
        // Mostrar el mensaje y la imagen
        mensaje.textContent = "Felicidades, tareas superadas";
        mensaje.style.display = "block";
        imagen.style.display = "block";
    }

    // Reproduce el sonido
    audio.play();
}

// Función para eliminar una tarea
function eliminarTarea(index) {
    tareas.splice(index, 1);
    mostrarTareas();
}

// Función para editar una tarea
function editarTarea(index) {
    const nuevaTarea = prompt("Editar tarea", tareas[index].texto);
    if (nuevaTarea !== null) {
        tareas[index].texto = nuevaTarea;
        mostrarTareas();
    }
}

// Función para verificar si todas las tareas están completadas
function verificarTareasCompletadas() {
    return tareas.every(tarea => tarea.completada);
}

// Función para filtrar tareas por categoría
 function filtrarTareas(categoria) {
    const tareasFiltradas = tareas.filter(tarea => tarea.categoria === categoria || categoria === 'Todas');
    const listaTareas = document.getElementById("lista-tareas");
    listaTareas.innerHTML = "";

    // Cambiar la clase del cuerpo del documento
    document.body.className = categoria;

    // Obtener el mensaje y la imagen
    const mensajeSinTareas = document.getElementById("mensaje-sin-tareas");

    if (tareasFiltradas.length === 0) {
        // Mostrar el mensaje y la imagen
        mensajeSinTareas.style.display = "block";
        imagen2.style.display = "block";
    } else {
        // Ocultar el mensaje y la imagen
        mensajeSinTareas.style.display = "none";
        imagen2.style.display = "none";

        tareasFiltradas.forEach((tarea, index) => {
            const li = document.createElement("li");
            const span = document.createElement("span");
            span.textContent = tarea.texto;
            li.appendChild(span);

            // Agregar un checkbox para marcar la tarea como completada
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = tarea.completada;
            checkbox.addEventListener("change", () => marcarTarea(index));
            li.appendChild(checkbox);

            // Agregar un botón para eliminar la tarea
            const botonEliminar = document.createElement("button");
            botonEliminar.textContent = "Eliminar";
            botonEliminar.addEventListener("click", () => eliminarTarea(index));
            li.appendChild(botonEliminar);

            // Agregar un botón para editar la tarea
            const botonEditar = document.createElement("button");
            botonEditar.textContent = "Editar";
            botonEditar.addEventListener("click", () => editarTarea(index));
            li.appendChild(botonEditar);

            listaTareas.appendChild(li);
        });
    }

    // Cambiar la fuente del título según la categoría seleccionada
    cambiarFuente(categoria);
}



// Función para cambiar la fuente del título según la categoría
function cambiarFuente(categoria) {
    const titulo = document.getElementById("titulo");
    titulo.className = categoria;
}

// Evento para el botón de agregar tarea
document.getElementById("agregar-btn").addEventListener("click", crearTarea);

// Cargar las tareas al cargar la página
window.onload = function() {
    const tareasGuardadas = JSON.parse(localStorage.getItem('tareas'));
    if (tareasGuardadas) {
        tareas = tareasGuardadas;
        mostrarTareas();
    }
};
