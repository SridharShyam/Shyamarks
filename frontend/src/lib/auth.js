export function getToken() {
  return localStorage.getItem('shyamarks_token');
}

export function setToken(token) {
  localStorage.setItem('shyamarks_token', token);
}

export function clearToken() {
  localStorage.removeItem('shyamarks_token');
}

export function isAuthenticated() {
  const token = getToken();
  return !!token;
}
