interface LoginResponse {
  token: string;

  user: {
    id: number;
    name: string;
    username: string;
    role: string;
  };
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const response = await fetch(
    "http://localhost:3000/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ?? "No fue posible iniciar sesión.",
    );
  }

  return data;
}