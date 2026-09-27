export function getToken(): string | null {
  return localStorage.getItem('shyamarks_token');
}

export function setToken(token: string): void {
  localStorage.setItem('shyamarks_token', token);
}

export function clearToken(): void {
  localStorage.removeItem('shyamarks_token');
}

export function isAuthenticated(): boolean {
  const token = getToken();
  return !!token;
}
