export function isAuthenticated() {
  const token = localStorage.getItem('access');
  return !!token;  // Devuelve true si el token existe, false si no
}
