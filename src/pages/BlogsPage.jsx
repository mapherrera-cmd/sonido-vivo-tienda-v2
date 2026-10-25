import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BLOGS } from "../data/blogs";

export function BlogsPage() {
  return (
    <>
      <h1 className="mb-4">Noticias y casos curiosos</h1>
      <Row className="g-4">
        {BLOGS.map((blog) => (
          <Col key={blog.id} md={6}>
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src={blog.img} alt={blog.titulo} style={{ height: "200px", objectFit: "cover" }} />
              <Card.Body className="d-flex flex-column">
                <Card.Title>Caso curioso #{blog.id}: {blog.titulo}</Card.Title>
                <Card.Text>{blog.resumen}</Card.Text>
                <Link to={`/blogs/${blog.id}`} className="btn btn-outline-primary mt-auto align-self-start">
                  Ver más detalles
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
