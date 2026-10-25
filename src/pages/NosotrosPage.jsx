export function NosotrosPage() {
  return (
    <>
      <h1 className="mb-3">Sobre nosotros</h1>
      <img src="/img/imagen-de-la-tienda.jpg" alt="Tienda Sonido Vivo" className="img-fluid rounded shadow-sm mb-4" style={{ maxHeight: "320px", width: "100%", objectFit: "cover" }} />
      <p className="lead">
        Fundada en Viña del Mar, Sonido Vivo nació de la pasión por la música.
      </p>
      <p>
        Llevamos más de 10 años equipando a músicos emergentes y profesionales de todo Chile con los
        mejores instrumentos, amplificadores y accesorios del mercado. Nuestro compromiso es entregarte
        asesoría experta y equipos de primera calidad.
      </p>
    </>
  );
}
