import { Link, useParams } from "react-router-dom";
import { obtenerBlogPorId } from "../data/blogs";

export function BlogDetallePage() {
  // El id viene de la URL: /blogs/1
  const { id } = useParams();
  const blog = obtenerBlogPorId(id);

  if (!blog) {
    return (
      <div className="alert alert-warning">
        El artículo no existe. <Link to="/blogs">Volver a blogs</Link>
      </div>
    );
  }

  return (
    <article>
      <h1 className="h2 mb-3">{blog.titulo}</h1>
      <img src={blog.img} alt={blog.titulo} className="img-fluid rounded shadow-sm mb-4" style={{ maxHeight: "320px", width: "100%", objectFit: "cover" }} />
      {blog.contenido.map((parrafo) => (
        <p key={parrafo}>{parrafo}</p>
      ))}
      <Link to="/blogs" className="btn btn-outline-secondary">Volver a blogs</Link>
    </article>
  );
}
