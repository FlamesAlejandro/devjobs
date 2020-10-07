document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');

    if(skills) {
        skills.addEventListener('click', agregarSkills);
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

    Utilizando object literal lo pasamos a Array
    const skillsArray = [...skills];
    document.querySelector('#skills').value = skills;
}