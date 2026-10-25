import { useSearchParams } from "react-router-dom";
import { FiltrosProductos } from "../components/molecules/FiltrosProductos";
import { ProductGrid } from "../components/organisms/ProductGrid";
import { obtenerCategorias } from "../data/categorias";
import { obtenerProductos } from "../data/productos";
import { useCarrito } from "../hooks/useCarrito";
import { filtrarYOrdenarProductos } from "../utils/filtrarProductos";

export function ProductosPage() {
  const { agregar } = useCarrito();

  // Los filtros viven en la URL (/productos?buscar=bajo&categoria=C001&orden=menor).
  // Así el buscador del menú y esta página usan el mismo dato.
  const [parametros, setParametros] = useSearchParams();
  const buscar = parametros.get("buscar") || "";
  const categoria = parametros.get("categoria") || "";
  const orden = parametros.get("orden") || "";

  // Cambia un filtro; si queda vacío, se quita de la URL
  const cambiarFiltro = (nombre, valor) => {
    const nuevos = new URLSearchParams(parametros);
    if (valor === "") {
      nuevos.delete(nombre);
    } else {
      nuevos.set(nombre, valor);
    }
    setParametros(nuevos);
  };

  const productos = filtrarYOrdenarProductos(obtenerProductos(), { buscar, categoria, orden });

  return (
    <>
      <h1 className="mb-3">Productos</h1>
      <FiltrosProductos
        buscar={buscar}
        categoria={categoria}
        orden={orden}
        categorias={obtenerCategorias()}
        onCambio={cambiarFiltro}
      />
      <p className="text-muted">
        {productos.length} {productos.length === 1 ? "producto encontrado" : "productos encontrados"}
      </p>
      <ProductGrid productos={productos} onAdd={agregar} />
    </>
  );
}
