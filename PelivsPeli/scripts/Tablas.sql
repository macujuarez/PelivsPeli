USE competencias;
DROP TABLE IF EXISTS competencia;

CREATE TABLE competencia (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(45) NOT NULL,
  PRIMARY KEY (id)
);

INSERT INTO competencia (nombre,inactivo) VALUES ("¿Cuál es la mejor película?",1), ("¿Qué comedia te hizo reir más?",1), ("¿Cuál es la película más bizarra?",1), ("¿Cuál es la mejor película para compartir?",1), ("¿Qué película de terror te asustó más?",1), ("¿Cuál es la mejor película de C.Ficción?",1);


USE competencias;
DROP TABLE IF EXISTS voto;

CREATE TABLE voto (
  id INT NOT NULL AUTO_INCREMENT,
  pelicula_id int(11) unsigned NOT NULL,
  competencia_id INT NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE voto add FOREIGN KEY (pelicula_id) REFERENCES pelicula (id);
ALTER TABLE voto add FOREIGN KEY (competencia_id) REFERENCES competencia(id);

ALTER TABLE competencia ADD COLUMN genero_id INT (11) UNSIGNED, ADD FOREIGN KEY (genero_id) REFERENCES genero(id);
ALTER TABLE competencia ADD COLUMN director_id INT (11) UNSIGNED, ADD FOREIGN KEY (director_id) REFERENCES director(id);
ALTER TABLE competencia ADD COLUMN actor_id INT (11) UNSIGNED, ADD FOREIGN KEY (actor_id) REFERENCES actor(id);
ALTER TABLE competencia ADD COLUMN inactivo TinyInt (1) NOT NULL DEFAULT 1;