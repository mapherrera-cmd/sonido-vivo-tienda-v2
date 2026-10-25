// Hook para manejar un formulario controlado:
//   const { valores, errores, setErrores, manejarCambio, actualizarCampos } = useFormulario({ correo: "" });
// - valores: lo que hay escrito en cada campo (estado de React)
// - errores: mensajes de error por campo (vacío si no hay errores)
// - manejarCambio: se pone en el onChange de cada input (usa el atributo "name" del input)
import { useState } from "react";

export function useFormulario(valoresIniciales) {
  const [valores, setValores] = useState(valoresIniciales);
  const [errores, setErrores] = useState({});

  // Cambia varios campos a la vez y borra el error de esos campos (la persona ya los está corrigiendo)
  const actualizarCampos = (cambios) => {
    setValores((anteriores) => ({ ...anteriores, ...cambios }));
    setErrores((anteriores) => {
      const nuevos = { ...anteriores };
      Object.keys(cambios).forEach((campo) => delete nuevos[campo]);
      return nuevos;
    });
  };

  // Para inputs normales: lee el "name" y el "value" del input que cambió
  const manejarCambio = (evento) => {
    const { name, value } = evento.target;
    actualizarCampos({ [name]: value });
  };

  return { valores, errores, setErrores, manejarCambio, actualizarCampos };
}
