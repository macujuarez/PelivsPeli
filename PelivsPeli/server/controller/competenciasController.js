var connection = require('../lib/connectiondb');

function buscarCompetencias(req, res) {
    var sql = "SELECT * FROM competencia WHERE inactivo = 1";

    connection.query(sql, function(error, resultado) {
        if (error) {
            console.log("Hubo un error al cargar las competencias", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
		return res.json(resultado);
	});
}

function peliculaAVotar(req, res) {
    var id = req.params.id;
    var queryCompetencia = "SELECT nombre, genero_id, director_id, actor_id FROM competencia WHERE id = " + id + ";";
        console.log(queryCompetencia)
        connection.query(queryCompetencia, function(error, competencia){
            if (error) {
                return res.status(500).json(error);
            }
            
        console.log(competencia);

    var queryPeliculas = "SELECT DISTINCT pelicula.id, poster, titulo, genero_id FROM pelicula LEFT JOIN actor_pelicula ON pelicula.id = actor_pelicula.pelicula_id LEFT JOIN director_pelicula ON pelicula.id = director_pelicula.pelicula_id WHERE 1 = 1";
    var genero = competencia[0].genero_id;
    var actor = competencia[0].actor_id;
    var director = competencia[0].director_id;
    var queryGenero = genero ? ' AND pelicula.genero_id = '  + genero : '';
    var queryActor = actor ? ' AND actor_pelicula.actor_id = ' + actor : '';
    var queryDirector = director ? ' AND director_pelicula.director_id = ' + director : '';
    var randomOrder = ' ORDER BY RAND() LIMIT 2';

    var query = queryPeliculas + queryGenero + queryActor + queryDirector + randomOrder;
            
        console.log(query);

        connection.query(query, function(error, peliculas){    
            if (error) {
                return res.status(500).json(error);
            }
                
            var response = {
                'peliculas': peliculas,
                'competencia': competencia[0].nombre
            };

            res.send(JSON.stringify(response));
        });
    });            
}

function guardarVoto (req,res){
    var idCompetencia= req.params.idCompetencia;
    var idPelicula = req.body.idPelicula;
    var pedido = "INSERT INTO voto (competencia_id, pelicula_id) values (" + idCompetencia + ", " + idPelicula + ")";

        connection.query(pedido,function (error, resultado){
            if (error) {
                console.log("Error al guardar voto", error.message);
                return res.status(500).json(error);
            }
            var response = {
                'voto': resultado.insertId,
            };

        res.status(200).send(response);
    });
}

function obtenerResultado (req,res){
    var idCompetencia = req.params.id; 
    var pedido = "SELECT pelicula_id, COUNT (*) AS votos, pelicula.poster, pelicula.titulo FROM voto JOIN competencia ON voto.competencia_id = competencia.id JOIN pelicula ON voto.pelicula_id = pelicula.id WHERE voto.competencia_id = " + idCompetencia + " GROUP BY competencia_id, pelicula_id HAVING COUNT(*) >= 1 ORDER BY votos DESC LIMIT 3";
    
        connection.query(pedido, function (error, datos){
            if (error) {
                console.log("Error al obtener resultados", error.message);
                return res.status(404).send(error);
            }
			    var toReturn = {
				    competencia:datos[0].nombre,
				    resultados:[],
			    }

			datos.forEach(function(element, index){
				var result = {
					pelicula_id:datos[index].pelicula_id,
					poster:datos[index].poster,
					titulo:datos[index].titulo,
					votos: datos[index].votos,
			    }
				toReturn.resultados.push(result);
		    });

        res.status(200).send(toReturn);
	});					
}
        

function crearNuevaCompetencia(req, res){
    var nombreCompetencia = req.body.nombre;
    var generoCompetencia = req.body.genero === '0' ? null : req.body.genero;
    var directorCompetencia = req.body.director === '0' ? null : req.body.director;
    var actorCompetencia = req.body.actor === '0' ? null : req.body.actor;

    console.log(req.body);

    var queryNueva = "INSERT INTO competencia (nombre, genero_id, director_id, actor_id) VALUES ('" + nombreCompetencia + "', " + generoCompetencia + ", " + directorCompetencia + ", " + actorCompetencia + ");";

    console.log(queryNueva);

    connection.query(queryNueva, function(error, resultado) {
        if (error) {
            return res.status(500).json(error);
        }

        var response = {
            'competencia': resultado
        };

        res.send(JSON.stringify(response));
    });
}

function eliminarVotos (req, res){
    var idCompetencia = req.params.id;
    var borrar = "DELETE FROM voto WHERE competencia_id = " + idCompetencia;
        connection.query(borrar, function (error, resultado){
            if (error) {
                console.log("Error al eliminar votos", error.message);
                return res.status(500).send(error);
            }
            console.log("Competencia reiniciada id: " + idCompetencia);
        res.send(JSON.stringify(resultado)); 
    });
} 

function nombreCompetencia(req, res){
    var nombreCompetencia = req.params.id;
    var query = "SELECT competencia.id, competencia.nombre, genero.nombre genero, director.nombre director, actor.nombre actor FROM competencia LEFT JOIN genero ON genero_id = genero.id LEFT JOIN director ON director_id= director.id LEFT JOIN actor ON actor_id= actor.id WHERE competencia.id = " + nombreCompetencia;  

        connection.query(query, function(error, resultado){
            if (error) {
                return res.status(500).json(error);
            }

            var response = {
                'id': resultado,
                'nombre': resultado[0].nombre,
                'genero_nombre': resultado[0].genero,
                'actor_nombre': resultado[0].actor,
                'director_nombre': resultado[0].director
            }
        res.send(JSON.stringify(response));    
    });
}

function cargarGeneros (req,res){
    var pedido = "SELECT * FROM genero"
        connection.query(pedido, function (error, resultado){
            if (error) {
                console.log("Error al cargar generos", error.message);
                return res.status(500).send(error);
            }
                res.send(JSON.stringify(resultado));
       });
} 

function cargarDirectores (req,res){
    var pedido = "SELECT * FROM director"
       connection.query(pedido, function (error, resultado){
           if (error) {
               console.log("Error al cargar directores", error.message);
               return res.status(500).send(error);
           }
               res.send(JSON.stringify(resultado));
       });
} 

function cargarActores (req,res){
    var pedido = "SELECT * FROM actor"
       connection.query(pedido, function (error, resultado){
           if (error) {
               console.log("Error al cargar actores", error.message);
               return res.status(500).send(error);
           }
               res.send(JSON.stringify(resultado));
       });
} 

function eliminarCompetencia (req, res){
    var idCompetencia = req.params.idCompetencia;
    var desactivar = "UPDATE competencia SET inactivo = 0 WHERE id =" + idCompetencia;
        connection.query(desactivar, function (error, resultado){
            if(error){
                return res.status(500).send("Error al eliminar competencia")
            }
        console.log("Competencia eliminada id: " +idCompetencia);
        res.status(200).send("eliminado");     
    });
}

function modificarCompetencias(req, res) {
    var idCompetencia = req.params.id;
	var nuevoNombre = req.body.nombre;
	var queryString = "UPDATE competencia SET nombre = '"+ nuevoNombre +"' WHERE id = "+ idCompetencia +";";
		connection.query(queryString,function(error,resultado){
			if(error){
			    return res.status(500).send("Error para modificar competencia")
            }
            if (resultado.length == 0){
                console.log("No se encontro la pelicula buscada con ese id");
                return res.status(404).send("No se encontro ninguna pelicula con ese id");
            } else {
                var response = {
                    'id': resultado
                };    
            }        
		res.send(JSON.stringify(response));
	});
}

module.exports = {
    buscarCompetencias: buscarCompetencias,
    peliculaAVotar: peliculaAVotar,
    guardarVoto: guardarVoto,
    obtenerResultado: obtenerResultado,
    crearNuevaCompetencia: crearNuevaCompetencia,
    eliminarVotos: eliminarVotos,
    nombreCompetencia: nombreCompetencia,
    cargarGeneros: cargarGeneros,
    cargarDirectores: cargarDirectores,
    cargarActores: cargarActores,
    eliminarCompetencia:eliminarCompetencia,
    modificarCompetencias: modificarCompetencias
};