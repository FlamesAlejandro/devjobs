document.addEventListener('DOMContentLoaded', () => {
    const skills = document.querySelector('.lista-conocimientos');

    if(skills) {
        skills.addEventListener('click', agregarSkills)
    }
})

const agregarSkills = e => {
    // Para revisar que el usuario presione el "li", Debe ser mayuscula
    if (e.target.tagName === 'LI'){

    }
}