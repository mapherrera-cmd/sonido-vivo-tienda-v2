// Dos selects enlazados: al elegir una región, la lista de comunas cambia.
// Se usa en el registro y en el checkout.
// No guarda estado: avisa los cambios con onChange({ region, comuna }) y el formulario los guarda.
import { REGIONES, obtenerComunas } from "../../data/regiones";
import { CampoFormulario } from "./CampoFormulario";

export function SelectorRegionComuna({ region, comuna, onChange, errorRegion = "", errorComuna = "" }) {
  // Las comunas dependen de la región elegida (si no hay región, la lista queda vacía)
  const comunas = obtenerComunas(region);

  return (
    <>
      <CampoFormulario
        id="region"
        etiqueta="Región"
        tipo="select"
        name="region"
        value={region}
        // Al cambiar de región se borra la comuna, porque la anterior ya no corresponde
        onChange={(e) => onChange({ region: e.target.value, comuna: "" })}
        textoVacio="-- Selecciona una región --"
        opciones={REGIONES.map((r) => ({ valor: r.id, texto: r.nombre }))}
        error={errorRegion}
      />
      <CampoFormulario
        id="comuna"
        etiqueta="Comuna"
        tipo="select"
        name="comuna"
        value={comuna}
        onChange={(e) => onChange({ comuna: e.target.value })}
        textoVacio={region ? "-- Selecciona una comuna --" : "-- Selecciona primero una región --"}
        opciones={comunas.map((c) => ({ valor: c, texto: c }))}
        error={errorComuna}
      />
    </>
  );
}
