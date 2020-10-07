exports.mostrarTrabajos = (req, res) => {
    res.render('home', {
        nombrePagina: 'DevJobs',
        tagline: 'Encuentra y publica trabajos',
        barra: true,
        boton: true
    })
}