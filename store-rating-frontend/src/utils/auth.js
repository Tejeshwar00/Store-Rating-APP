export function getCurrentRole() {
  try {
    const raw = localStorage.getItem("user"); // {"id":2,"name":"Asha","role":"STORE_OWNER"}
    return raw ? JSON.parse(raw).role : null;
  } catch {
    return null;
  }
}
