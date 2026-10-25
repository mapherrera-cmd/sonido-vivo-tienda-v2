import { ProductGrid } from "../components/organisms/ProductGrid";
import { obtenerProductos } from "../data/productos";
import { useCarrito } from "../hooks/useCarrito";

export function OfertasPage() {
  const { agregar } = useCarrito();
  // Solo los productos marcados como oferta
  const ofertas = obtenerProductos().filter((p) => p.oferta);

  return (
    <>
      <h1 className="mb-3">Ofertas</h1>
      <ProductGrid productos={ofertas} onAdd={agregar} />
    </>
  );
}
