import { useState, type FormEvent } from "react";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { login } from "../services/auth.service";

import logo from "../assets/logo.png";

import "../styles/login.css";

interface FormErrors {
  username?: string;
  password?: string;
}

type MessageType = "success" | "error" | null;

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>(null);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!username.trim()) {
      nextErrors.username = "El usuario es obligatorio.";
    }

    if (!password) {
      nextErrors.password = "La contraseña es obligatoria.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setMessage("");
      setMessageType(null);
      return;
    }

    try {
      const result = await login(
        username,
        password,
      );

      localStorage.setItem(
        "accessToken",
        result.token,
      );

      window.location.href = "/dashboard";
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
        setMessageType("error");
      }
    }
  }
  
  return (
    <main className="login-page">

      {/* PANEL IZQUIERDO */}
      <section className="login-branding">

        <div
          aria-hidden="true"
          className="login-decoration login-decoration--top"
        />

        <div
          aria-hidden="true"
          className="login-decoration login-decoration--bottom"
        />

        <div className="login-brand-header">

          <div className="login-logo-container">
            <img
              src={logo}
              alt="Logo Sol y Espuma"
              className="login-logo"
            />
          </div>

          <div>
            <p className="login-brand-name">
              LAVANDERIA
            </p>

            <p className="login-brand-type">
              Registro, identificación y seguimiento de servicios.
            </p>
          </div>

        </div>

        <div className="login-brand-content">

          <p className="login-brand-label">
    
          </p>

          <h1 className="login-brand-title">
             Todas las prendas,
            <span>bajo control.</span>
          </h1>

          <p className="login-brand-description">
            Acceso para el personal autorizado.
          </p>

        </div>

        <p className="login-brand-footer">
        
        </p>

      </section>


      {/* PANEL DERECHO */}
      <section className="login-content">

        <div className="login-form-wrapper">

          <div className="login-mobile-brand">

            <div className="login-mobile-logo-container">
              <img
                src={logo}
                alt="Logo Sol y Espuma"
                className="login-mobile-logo"
              />
            </div>

            <div>
              <p>Sol y Espuma</p>
              <span>Lavandería</span>
            </div>

          </div>


          <div className="login-card">

            <p className="login-welcome">
              Bienvenido
            </p>

            <h2 className="login-title">
              Iniciar sesión
            </h2>

            <p className="login-subtitle">
              Ingresa tus datos para acceder al sistema.
            </p>


            <form
              className="login-form"
              noValidate
              onSubmit={handleSubmit}
            >

               <Input
                  id="username"
                  name="username"
                  label="Usuario"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Ej. Nombre"
                  value={username}
                  error={errors.username}
                  onChange={(event) => {
                    setUsername(event.target.value);

                    setErrors((current) => ({
                      ...current,
                      username: undefined,
                    }));

                    setMessage("");
                    setMessageType(null);
                  }}
                />

              <Input
                id="password"
                name="password"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                value={password}
                error={errors.password}
                onChange={(event) => {
                  setPassword(event.target.value);

                  setErrors((current) => ({
                    ...current,
                    password: undefined,
                  }));

                  setMessage("");
                  setMessageType(null);
                }}
                action={
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                }
              />


              {message && (
                  <p
                    aria-live="polite"
                    className={`login-message login-message--${messageType}`}
                  >
                    {message}
                  </p>
              )}


              <Button
                type="submit"
                fullWidth
              >
                Ingresar
              </Button>

            </form>


            <p className="login-help">
              Si no puedes ingresar, comunícate con el propietario.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}