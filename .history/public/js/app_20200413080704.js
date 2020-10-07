document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');

    //limpiar alertas
    let alertas = document.querySelector('.alertas');

    if(skills) {
        skills.addEventListener('click', agregarSkills);

        //una vez que estemos en editar, llamar esta funcion
        skillsSeleccionados();
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