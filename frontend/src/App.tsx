import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { LoginPage } from "./pages/LoginPage";
import { RegisterServicePage } from "./pages/operator/RegisterServicePage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import {
  ServiceTrackingPage,
} from "./pages/operator/ServiceTrackingPage";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

        <Route
        path="/services/new"
        element={
          <ProtectedRoute>
            <RegisterServicePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/services"
        element={
          <ProtectedRoute>
            <ServiceTrackingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;