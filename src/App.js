import React from "react";
import { useState, useEffect } from "react";

function App() {
  const [personas, setPersonas] = useState([]);
  const [paises, setpaises] = useState([]);
  const [nombre, setNombre] = useState("");
  const [pais, setPais] = useState("");
  const [id, setId] = useState("");
  const [error, setError] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    const getPersonas = async () => {
      const res = await fetch("https://uto.azurewebsites.net/personas");
      const data = await res.json();
      console.log(data);
      setPersonas(data);
    };
    const getpaises=async()=>{
      const res = await fetch("https://restcountries.herokuapp.com/api/v1");
      const data = await res.json();
      setpaises(data)
    }
    getPersonas();
    getpaises();
  }, []);

  const addPersona = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      console.log("nombre Vacio");
      setError("Debes Escribir un nombre");
      return;
    }
    if (!pais.trim()) {
      console.log("pais Vacio");
      setError("Debes Escribir un pais");
      return;
    }
    try {
      const nuevaPersona = {
        nombre,
        pais,
      };
      const savePersona = await fetch(
        "https://uto.azurewebsites.net/personas",
        {
          method: "POST",
          body: JSON.stringify(nuevaPersona),

          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const result = await savePersona.json();
      console.log(result.data);
      setPersonas([...personas, {...nuevaPersona,id:result.data.id}]);
      setNombre("");
      setPais("");
      setError(null);
    } catch (error) {
      console.log(error);
    }
  };

  const editPersona = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      console.log("nombre Vacio");
      setError("Debes Escribir un nombre");
      return;
    }
    if (!pais.trim()) {
      console.log("pais Vacio");
      setError("Debes Escribir un pais");
      return;
    }
    try {
      let data = {
        nombre,
        pais,
      };
      const editPersona = await fetch(
        `https://uto.azurewebsites.net/personas/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(data),

          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const result = await editPersona.json();
      console.log(result);
      const arrayEditado = personas.map((item) =>
        item.id === id ? { id: item.id, nombre: nombre, pais: pais } : item
      );
      setPersonas(arrayEditado);
      setNombre("");
      setPais("");
      setError(null);
      setModoEdicion(false);
    } catch (error) {
      console.log(error);
    }
  };

  const activeEdicion = (item) => {
    setModoEdicion(true);
    setNombre(item.nombre);
    setPais(item.pais);
    setId(item.id);
  };

  const deletePersona = async (id) => {
    try {
      await fetch(`https://uto.azurewebsites.net/personas/${id}`, {
        method: "DELETE",
      });

      const arrayFilter = personas.filter((item) => item.id !== id);
      setPersonas(arrayFilter);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Crud Pesonas</h1>
      <hr />
      <div className="row">
        <div className="col-8">
          <h4 className="text-center">Lista De Personas</h4>
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Pais</th>
                <th scope="col">Accion</th>
              </tr>
            </thead>
            <tbody>
              {personas.map((persona, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{persona.nombre}</td>
                  <td>{persona.pais}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm float-right mx-2"
                      onClick={() => activeEdicion(persona)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm float-right mx-2"
                      onClick={() => deletePersona(persona.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-4">
          <h4 className="text-center">
            {modoEdicion ? "Editar Persona" : "Agregar Persona"}{" "}
          </h4>
          <form onSubmit={modoEdicion ? editPersona : addPersona}>
            {error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : null}
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Ingrese Nombre"
              onChange={(e) => setNombre(e.target.value)}
              value={nombre}
            />
            {/* <input
              type="text"
              className="form-control mb-2"
              placeholder="Ingrese Pais"
              onChange={(e) => setPais(e.target.value)}
              value={pais}
            /> */}
            <select
              className="form-select  mb-2"
              aria-label="Default select example"
              onChange={(e) => setPais(e.target.value)}
            >
              {paises.map((pais, id) => (
                <option value={pais.name.common} key={id}>
                  {pais.name.common}
                </option>
              ))}
              <option defaultValue>Open this select menu</option>
            </select>
            <button
              type="submit"
              className={
                modoEdicion
                  ? "btn btn-warning btn-block"
                  : "btn btn-dark btn-block"
              }
            >
              {modoEdicion ? "Editar" : "Agregar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
