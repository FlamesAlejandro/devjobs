import axios from 'axios';
import Swal from 'sweetalert2';

document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');

    //limpiar alertas
    //alertas es el contenedor padre, div
    let alertas = document.querySelector('.alertas');

    if(alertas) {
        limpiarAlertas();
    }

    if(skills) {
        skills.addEventListener('click', agregarSkills);

        //una vez que estemos en editar, llamar esta funcion
        skillsSeleccionados();
    }

    // botones de vacantes
    const vacantesListado = document.querySelector
    ('.panel-administracion');

    if(vacantesListado){
        vacantesListado.addEventListener('click', accionesListado);
    }



})

//inicializar el set para guardar los valores
const skills = new Set();

const agregarSkills = e => {
    // Para revisar que el usuario presione el "li", Debe ser mayuscula
    if (e.target.tagName === 'LI'){
        if(e.target.classList.contains('activo')){
            //Si el boton ya esta activo, dejarlo normal en caso de ser apretado
            skills.delete(e.target.textContent);
            e.target.classList.remove('activo');
        } else {
            // agregarlo al set y dejalo activo
            skills.add(e.target.textContent);
            e.target.classList.add('activo');
        }

    }

    // Utilizando object literal lo pasamos a Array
    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const skillsSeleccionados = () => {
    // Sacar los <li> que tengan el class activo
    const seleccionadas = document.querySelectorAll('.lista-conocimientos .activo');

    // Suando el set de arriba de skills, sacamos el texto de cada elemento <li></li>
    seleccionadas.forEach(seleccionada => {
        skills.add(seleccionada.textContent);
    })
    // inyectarlo en el hidden
    const skillsArray = [...skills];
    document.querySelector('#skills').value = skillsArray;
}

const limpiarAlertas = () => {
    // seleccionar alertas
    const alertas = document.querySelector('.alertas');
    // setInterval es una funcion que se ejecuta cada cierto tiempo
    const interval = setInterval(() => {
        //children es el objeto hijo de alertas, en este caso serian 4 alertas max
        if(alertas.children.length > 0 ){
            alertas.removeChild(alertas.children[0]);
            //eliminar el primero
        } else if (alertas.children.length === 0) {
            // Esto elimina el div de las alertas
            alertas.parentElement.removeChild(alertas);
            // para que termine el if, a pesar de que el lenght sea 0
            clearInterval(interval);
        }
    })
}

//eliminar vacantes
const accionesListado = e => {
    // previene ejecuctiopn
    e.preventDefault();

    //dataset es como se accede al atributo de eliminar
    if(e.target.dataset.eliminar){
        
        //axios para eliminar
        axios.delete(url, { params: {url} })
            .then(function(respuesta){
                if(respuesta.status === 200){
                    Swal.fire({
                        title: 'Confirmar',
                        text: "No podras revertir esto",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Si eliminar',
                        cancelButtonText: 'No cancelar'
                      }).then((result) => {
                        if (result.value) {

                            //eliminar
                            //el dataset eliminar trae el id
                            const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

                            Swal.fire(
                                'Eliminado!',
                                'Ha sido eliminado.',
                                'success'
                            )
                        }
                      })
                }
                
            });

        
    } else {
        // en caos de que sean los otros botones
        window.location.href = e.target.href;
    }
} 