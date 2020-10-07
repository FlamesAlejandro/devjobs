"use strict";

var _axios = _interopRequireDefault(require("axios"));

var _sweetalert = _interopRequireDefault(require("sweetalert2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

document.addEventListener('DOMContentLoaded', function () {
  var skills = document.querySelector('.lista-conocimientos'); //limpiar alertas
  //alertas es el contenedor padre, div

  var alertas = document.querySelector('.alertas');

  if (alertas) {
    limpiarAlertas();
  }

  if (skills) {
    skills.addEventListener('click', agregarSkills); //una vez que estemos en editar, llamar esta funcion

    skillsSeleccionados();
  } // botones de vacantes


  var vacantesListado = document.querySelector('.panel-administracion');

  if (vacantesListado) {
    vacantesListado.addEventListener('click', accionesListado);
  }
}); //inicializar el set para guardar los valores

var skills = new Set();

var agregarSkills = function agregarSkills(e) {
  // Para revisar que el usuario presione el "li", Debe ser mayuscula
  if (e.target.tagName === 'LI') {
    if (e.target.classList.contains('activo')) {
      //Si el boton ya esta activo, dejarlo normal en caso de ser apretado
      skills["delete"](e.target.textContent);
      e.target.classList.remove('activo');
    } else {
      // agregarlo al set y dejalo activo
      skills.add(e.target.textContent);
      e.target.classList.add('activo');
    }
  } // Utilizando object literal lo pasamos a Array


  var skillsArray = _toConsumableArray(skills);

  document.querySelector('#skills').value = skillsArray;
};

var skillsSeleccionados = function skillsSeleccionados() {
  // Sacar los <li> que tengan el class activo
  var seleccionadas = document.querySelectorAll('.lista-conocimientos .activo'); // Suando el set de arriba de skills, sacamos el texto de cada elemento <li></li>

  seleccionadas.forEach(function (seleccionada) {
    skills.add(seleccionada.textContent);
  }); // inyectarlo en el hidden

  var skillsArray = _toConsumableArray(skills);

  document.querySelector('#skills').value = skillsArray;
};

var limpiarAlertas = function limpiarAlertas() {
  // seleccionar alertas
  var alertas = document.querySelector('.alertas'); // setInterval es una funcion que se ejecuta cada cierto tiempo

  var interval = setInterval(function () {
    //children es el objeto hijo de alertas, en este caso serian 4 alertas max
    if (alertas.children.length > 0) {
      alertas.removeChild(alertas.children[0]); //eliminar el primero
    } else if (alertas.children.length === 0) {
      // Esto elimina el div de las alertas
      alertas.parentElement.removeChild(alertas); // para que termine el if, a pesar de que el lenght sea 0

      clearInterval(interval);
    }
  });
}; //eliminar vacantes


var accionesListado = function accionesListado(e) {
  // previene ejecuctiopn
  e.preventDefault(); //dataset es como se accede al atributo de eliminar

  if (e.target.dataset.eliminar) {
    _sweetalert["default"].fire({
      title: 'Confirmar',
      text: "No podras revertir esto",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si eliminar',
      cancelButtonText: 'No cancelar'
    }).then(function (result) {
      if (result.value) {
        //eliminar
        //el dataset eliminar trae el id
        var url = "".concat(location.origin, "/vacantes/eliminar/").concat(e.target.dataset.eliminar); //axios para eliminar

        _axios["default"]["delete"](url, {
          params: {
            url: url
          }
        }).then(function (respuesta) {
          if (respuesta.status === 200) {
            _sweetalert["default"].fire('Eliminado!', respuesta.data, 'success'); //TODO: Eliminar del DOOM 
            // basicamente eliminar el html que forma parte de la vacante eliminada


            e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
          }
        })["catch"](function () {
          _sweetalert["default"].fire({
            type: 'error',
            title: 'Hubo un error',
            text: ' No se pudo eliminar'
          });
        });
      }
    });
  } else if (e.target.tagName === 'A') {
    // tagname A es un enlace
    // en caos de que sean los otros botones
    window.location.href = e.target.href;
  }
};