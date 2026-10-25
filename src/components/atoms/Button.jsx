export function Button({ children, onClick, variant = "primary", className = "", disabled = false, type = "button" }) {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
