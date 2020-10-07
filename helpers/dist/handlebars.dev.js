"use strict";

var _this = void 0;

module.exports = {
  seleccionarSkills: function seleccionarSkills() {
    var seleccionadas = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var opciones = arguments.length > 1 ? arguments[1] : undefined;
    // el arreglo se inicia vacio, para que no de undefined, en este caso seleccionadas, que nos servira para editar
    var skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress'];
    var html = ''; // Es Importante este código, cuando imprime el html, pregunta si seleccionadas(arreglo) ya viene con datos o no,
    // si tiene alguna, entonces las deja activa, sirve para editar

    skills.forEach(function (skills) {
      html += "\n                <li>".concat(seleccionadas.includes(skills) ? 'class="activo"' : '', ">").concat(skills, "</li>\n            ");
    });
    return opciones.fn().html = html;
  },
  // Seleccionado es todo lo que tengas en la base de datos, opciones es todo lo que tengas en el html. RegExp Expresion regular
  tipoContrato: function tipoContrato(seleccionado, opciones) {
    // Este codigo dice, que compara las opciones con igual valor a seleccionado de la bdd, y luego inyecta el selected en el que encontro
    return opciones.fn(_this).replace(new RegExp(" value=\"".concat(seleccionado, "\"")), '$& selected="selected"');
  },
  // en handlebars no se puede mezclar el javascript como en pug, todo en helpers
  mostrarAlertas: function mostrarAlertas() {
    var errores = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var alertas = arguments.length > 1 ? arguments[1] : undefined;
    // errores = error, alertas para el html
    // Clasificar los errores por categoria.
    var categoria = Object.keys(errores); //template para el html

    var html = '';

    if (categoria.length) {
      //por cada categoria, hacer un div para mostrar el error
      // la categoria, en este caso error, le da un estilop directo desde el css
      errores[categoria].forEach(function (error) {
        html += "<div class=\"".concat(categoria, " alerta\">\n                    ").concat(error, "\n                </div>");
      });
    }

    return alertas.fn().html = html;
  }
};