import { useCallback, useEffect, useState } from "react";
import { getReadiness, type ReadinessResponse } from "./api/health";
import { StatusCard } from "./components/StatusCard";

type RequestState = "checking" | "ok" | "error";

function App() {
  const [requestState, setRequestState] = useState<RequestState>("checking");
  const [health, setHealth] = useState<ReadinessResponse | null>(null);
  const [message, setMessage] = useState("Comprobando la comunicación entre contenedores...");

  const checkServices = useCallback(async () => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5_000);

    setRequestState("checking");
    setMessage("Comprobando la comunicación entre contenedores...");

    try {
      const result = await getReadiness(controller.signal);
      setHealth(result);
      setRequestState(result.status === "ok" ? "ok" : "error");
      setMessage(
        result.status === "ok"
          ? "La presentación, la API y MySQL se comunican correctamente."
          : (result.message ?? "Uno de los servicios todavía no está disponible."),
      );
    } catch (error) {
      setHealth(null);
      setRequestState("error");
      setMessage(
        error instanceof Error && error.name !== "AbortError"
          ? error.message
          : "La verificación tardó demasiado. Revisa que los servicios estén activos.",
      );
    } finally {
      window.clearTimeout(timeout);
    }
  }, []);

  useEffect(() => {
    void checkServices();
  }, [checkServices]);

  const apiState: RequestState =
    requestState === "checking" ? "checking" : health?.services.api === "ok" ? "ok" : "error";
  const databaseState: RequestState =
    requestState === "checking"
      ? "checking"
      : health?.services.database === "ok"
        ? "ok"
        : "error";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-600 text-lg font-black text-white shadow-lg shadow-cyan-200">
              SE
            </div>
            <div>
              <p className="font-bold text-slate-950">Sol y Espuma</p>
              <p className="text-xs text-slate-500">Sistema interno de lavandería</p>
            </div>
          </div>
          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800 ring-1 ring-inset ring-cyan-200">
            Fase 1
          </span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
              Base técnica lista
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Tres capas, una conexión verificable.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Esta pantalla confirma la comunicación inicial entre React, Express, Prisma y MySQL antes de implementar las reglas del negocio.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <StatusCard
              label="Presentación"
              technology="React + Vite"
              description="Interfaz TypeScript preparada para crecer por módulos y estilos con Tailwind CSS."
              state="ok"
            />
            <StatusCard
              label="Negocio"
              technology="Node.js + Express"
              description="API JSON con seguridad HTTP, CORS controlado y endpoints de salud."
              state={apiState}
            />
            <StatusCard
              label="Datos"
              technology="Prisma + MySQL"
              description="Conexión administrada por Prisma mediante el adaptador oficial para MySQL."
              state={databaseState}
            />
          </div>

          <div
            className={`mt-6 flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
              requestState === "error"
                ? "border-rose-200 bg-rose-50"
                : "border-cyan-200 bg-cyan-50"
            }`}
            role="status"
            aria-live="polite"
          >
            <div>
              <p className="text-sm font-bold text-slate-950">
                {requestState === "checking"
                  ? "Verificación en curso"
                  : requestState === "ok"
                    ? "Entorno preparado"
                    : "Hay un servicio pendiente"}
              </p>
              <p className="mt-1 text-sm text-slate-600">{message}</p>
            </div>
            <button
              type="button"
              onClick={() => void checkServices()}
              disabled={requestState === "checking"}
              className="shrink-0 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-50"
            >
              Verificar de nuevo
            </button>
          </div>
        </section>

        <footer className="border-t border-slate-200 py-5 text-xs text-slate-500">
          DERCAS RF-01 a RF-11 se implementarán de forma incremental desde esta base.
        </footer>
      </div>
    </main>
  );
}

export default App;
