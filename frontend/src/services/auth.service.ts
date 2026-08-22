export interface SessionUser {
  id: number;
  name: string;
  username: string;
  role: string;
}

interface LoginResponse {
  user: SessionUser;
}

interface SessionResponse {
  user: SessionUser;
}


export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {

  const response = await fetch(
    "http://localhost:3000/api/auth/login",
    {
      method: "POST",

      credentials: "include",

      headers: {
        "Content-Type":
          "application/json",
      },

      body:
        JSON.stringify({
          username,
          password,
        }),
    },
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "No fue posible iniciar sesión.",
    );
  }

  return data;
}


export async function getCurrentUser():
Promise<SessionUser> {

  const response = await fetch(
    "http://localhost:3000/api/auth/me",
    {
      credentials: "include",
    },
  );

  const data =
    await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ??
        "La sesión no es válida.",
    );
  }

  return (
    data as SessionResponse
  ).user;
}


export async function logout():
Promise<void> {

  const response = await fetch(
    "http://localhost:3000/api/auth/logout",
    {
      method: "POST",

      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error(
      "No fue posible cerrar la sesión.",
    );
  }
}