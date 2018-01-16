require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var competenciasController = require('./controller/competenciasController');

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//Pedidos a la base de datos.

app.get('/competencias/:id/peliculas', competenciasController.peliculaAVotar);
app.post('/competencias/:idCompetencia/voto', competenciasController.guardarVoto);
app.get('/competencias/:id/resultados', competenciasController.obtenerResultado);
app.get('/competencias', competenciasController.buscarCompetencias);
app.post('/competencias', competenciasController.crearNuevaCompetencia);
app.delete('/competencias/:id/votos', competenciasController.eliminarVotos);
app.get('/competencias/:id', competenciasController.nombreCompetencia)
app.delete('/competencias/:idCompetencia', competenciasController.eliminarCompetencia);
app.put('/competencias/:id', competenciasController.modificarCompetencias);
app.get('/generos', competenciasController.cargarGeneros);
app.get('/directores', competenciasController.cargarDirectores);
app.get('/actores', competenciasController.cargarActores);


app.get('/', function (req, res) {
  res.json({
      message: 'Servidor funcionando 😎'
  });
});

app.listen(process.env.EXPRESS_PORT, function () {
    console.log("Escuchando en " + `http://localhost:${process.env.EXPRESS_PORT}/`);
});