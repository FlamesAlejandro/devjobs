module.exports = {
    seleccionarSkills : (seleccionadas = [], opciones) => {
        // el arreglo se inicia vacio, para que no de undefined, en este caso seleccionadas, que nos servira para editar
        const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress'];

        let html = '';
        // Es Importante este código, cuando imprime el html, pregunta si seleccionadas(arreglo) ya viene con datos o no,
        // si tiene alguna, entonces las deja activa, sirve para editar
        skills.forEach(skills => {
            html += `
                <li>${seleccionadas.includes(skills) ? 'class="activo"' : ''}>${skills}</li>
            `;
        });

        return opciones.fn().html = html;
    },
    // Seleccionado es todo lo que tengas en la base de datos, opciones es todo lo que tengas en el html. RegExp Expresion regular
    tipoContrato: (seleccionado, opciones) => {
        // Este codigo dice, que compara las opciones con igual valor a seleccionado de la bdd, y luego inyecta el selected en el que encontro
        return opciones.fn(this).replace(
            new RegExp(` value="${seleccionado}"`), '$& selected="selected"'
        )
    },
    // en handlebars no se puede mezclar el javascript como en pug, todo en helpers
    mostrarAlertas: (errores = {}, alertas) => {
        
    }
}