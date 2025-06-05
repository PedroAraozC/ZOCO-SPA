import { Badge } from "react-bootstrap";

const RenderDescripcion = (item) => {
  if (item.type === "estudio") {
    const { institution, degree, status } = item.data;
    return (
      <>
        <div>
          <strong>{degree}</strong>
        </div>
        <div className="text-muted">{institution}</div>
        <Badge
          bg={
            status === "completado"
              ? "success"
              : status === "en_curso"
              ? "info"
              : "warning"
          }
          className="mt-1"
        >
          {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
        </Badge>
      </>
    );
  } else {
    const { street, city, province, addressType } = item.data;
    return (
      <>
        <div>
          <strong>{street}</strong>
        </div>
        <div className="text-muted">
          {city}, {province}
        </div>
        <Badge bg="secondary" className="mt-1">
          {addressType.charAt(0).toUpperCase() + addressType.slice(1)}
        </Badge>
      </>
    );
  }
};
export default RenderDescripcion;
