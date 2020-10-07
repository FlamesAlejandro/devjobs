module.exports = {
    seleccionarSkills : (seleccionadas = [], opciones) => {
        // el arreglo se inicia vacio, para que no de undefined, en este caso seleccionadas, que nos servira para editar
        const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress'];

        let html = '';
        skills.forEach(skills => {
            html += `
                <li>${skills}</li>
            `;
        });

        return opciones.fn().html = html;
    }
}