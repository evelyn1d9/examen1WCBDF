const express = require('express')
var bodyParser = require('body-parser')
const { response } = require("express");
const app = express();
const puerto = process.env.PORT || 3000;


//Arreglo de clientes

let clientes = [
   { id: 1, nombre: "Evelyn Rocha", direccion:"Calle Falsa #123, Ciudad Imaginaria, Provincia Inventada, 12345", telefono:"(555) 123-4567"},
   { id: 2, nombre: "Francisco Escobedo", direccion:"Avenida de los Sueños #456, Pueblo de Ensueño, Estado de la Imaginación, 54321", telefono:"(555) 234-5678"},
   { id: 3, nombre: "Niek Kimman", direccion:"Carrera Ficticia #789, Ciudad de la Ilusión, Región Imaginaria, 67890", telefono:"(555) 345-6789"},
   { id: 4, nombre: "Gabriela Herrera", direccion:"Calle de los Deseos #101, Villa de los Sueños, Territorio de Fantasía, 98765", telefono:"(555) 456-7890"},
   { id: 5, nombre: "Omar Castro", direccion:"Callejón Imaginario #321, Ciudad de los Sueños, País de la Ilusión, 23456", telefono:"(555) 567-8901"},
   { id: 6, nombre: "Angel Rocha", direccion:"Camino de la Imaginación #654, Pueblo de Ensueño, Estado de los Sueños, 76543", telefono:"(555) 678-9012"},
   { id: 7, nombre: "Kaleth Herrera", direccion:"Calle de la Fantasía #987, Ciudad de las Maravillas, Región de Ensueño, 34567", telefono:"(555) 789-0123"},
   { id: 8, nombre: "Taylor Swift", direccion:"Avenida de los Sueños Dorados #210, Villa de los Deseos, País Imaginario, 87654", telefono:"(555) 890-1234"},
   { id: 9, nombre: "Hania Velazquez", direccion:"Paseo de los Unicornios #543, Ciudad Mágica, Provincia de los Sueños, 45678", telefono:"(555) 901-2345"},
   { id: 10, nombre: "Samantha Medrano", direccion:"Calle de los Cuentos #876, Pueblo Encantado, Reino de la Fantasía, 56789", telefono:"(555) 012-3456"}];

//CONSULTAS
app.get('/socios/v1/clientes', (req, res) => {
	//Obtener todos los clientes
	if (clientes.length === 0) {
		return res.status(404).json({
			estado: 0,
			mensaje: 'No existen clientes',
			clientes: clientes
		})
	} else {
		return res.json({
			clientes: clientes,
			estado: 1,
			mensaje: 'Clientes obtenidos con exito'
		})
	}


})

app.get('/socios/v1/clientes/:id', (req, res) => {
	const id = req.params.id;
	// comparar cliente por cliente cual coincide con el ID
	const cliente = clientes.find(cliente => cliente.id == id);
	if (cliente) { // si se encontro una categoria
		res.status(200).json({
			estado: 1,
			mensaje: "Cliente encontrado",
			cliente: cliente,
		});
	} else { // si no se encuentra
		res.status(404).json({
			estado: 0,
			mensaje: "Cliente no encontrado",
		});
	}
});

const jsonParser = bodyParser.json(); //middleware

app.use(jsonParser); //Utilizar middleware
app.post('/socios/v1/clientes', jsonParser, (req, res) => {
	// crear un recurso 
	//requiere: id (generado por el server),
	//nombre,direccion,telefono (introducidas x el user y se obtienen del body)

	const { nombre, direccion, telefono } = req.body; //Destructuring de objetos
	const id = Math.round(Math.random() * 1000); // generar el ID

	if (nombre == undefined || direccion == undefined || telefono == undefined) {
		res.status(400).json({
			estado: 0,
			mensaje: "Faltan parametros en la solicitud",
		});
	} else {

		const cliente = { id: id, nombre: nombre, direccion: direccion, telefono: telefono  };
		const longitudInicial = clientes.length;
		clientes.push(cliente);

		// verificar la longitud del array de clientes para ver si se agrego una nueva
		if (clientes.length > longitudInicial) {
			res.status(201).json({
				estado: 1,
				mensaje: "Cliente agregado",
				cliente: cliente,
			});
		} else {
			res.status(500).json({
				estado: 0,
				mensaje: "Ocurrio un error desconocido"
			});
		}
	}

})

app.put('/socios/v1/clientes/:id', (req, res) => {
	// Actualizar una categoría

	// ID viene en los parámetros
	// Nombre y descripción vienen en el cuerpo (body)

	const { id } = req.params;
	const { nombre, direccion, telefono } = req.body;

	if (nombre === undefined || direccion === undefined || telefono == undefined) {
		// No se enviaron el nombre o la descripción
		res.status(400).json({
			estado: 0,
			mensaje: "Bad Request (faltan parámetros)"
		});
	} else {
		const posActualizar = clientes.findIndex(cliente => cliente.id == id);

		if (posActualizar !== -1) {
			// Si se encontró el ID
			// Actualizar el nombre y la descripción de la categoría
			clientes[posActualizar].nombre = nombre;
			clientes[posActualizar].direccion = direccion;
            clientes[posActualizar].telefono = telefono;

			res.status(200).json({
				estado: 1,
				mensaje: "Categoría actualizada",
				cliente: clientes[posActualizar], // Devolver la categoría actualizada
			});
		} else {
			res.status(404).json({
				estado: 0,
				mensaje: "ID no encontrado"
			});
		}
	}
});

app.delete('/socios/v1/clientes/:id', (req, res) => {
	// Eliminar un cliente
	const { id } = req.params;
	const indiceEliminar = clientes.findIndex(cliente => cliente.id == id);
  
	if (indiceEliminar !== -1) {
	  // Se borra el cliente
	  clientes.splice(indiceEliminar, 1);
	  res.status(200).json({
		estado: 1,
		mensaje: "Cliente borrado correctamente"
	  });
	} else {
	  // No se encuentra el cliente
	  res.status(404).json({
		estado: 0,
		mensaje: "Cliente no encontrado"
	  });
	}
  });

app.listen(puerto, () => {
	console.log(`Escuchando en el puerto ${puerto}`);
})