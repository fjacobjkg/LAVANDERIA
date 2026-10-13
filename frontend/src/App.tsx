import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { LoginPage } from "./pages/LoginPage";
import { OwnerAccountsPage } from "./pages/owner/OwnerAccountsPage";
import { RegisterServicePage } from "./pages/operator/RegisterServicePage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { ServiceTrackingPage } from "./pages/operator/ServiceTrackingPage";
import { ServiceQrLabelPage } from "./pages/operator/ServiceQrLabelPage";
import { DeliveryConfirmationPage } from "./pages/operator/DeliveryConfirmationPage";
import { IncidentsHistoryPage } from "./pages/operator/IncidentsHistoryPage";
import {
  MonthlyDeliveriesPage,
} from "./pages/propietario/MonthlyDeliveriesPage";

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
          <ProtectedRoute role="OPERADOR">
            <RegisterServicePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/services"
        element={
          <ProtectedRoute role="OPERADOR">
            <ServiceTrackingPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/services/qr-label"
        element={
          <ProtectedRoute role="OPERADOR">
            <ServiceQrLabelPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/services/delivery-confirmation"
        element={
          <ProtectedRoute role="OPERADOR"><DeliveryConfirmationPage /></ProtectedRoute>
        }
      />

      <Route
          path="/services/incidents-history"
          element={
            <ProtectedRoute role="OPERADOR"><IncidentsHistoryPage /></ProtectedRoute>
          }
        />

        <Route
          path="/owner/monthly-deliveries"
          element={
            <ProtectedRoute role="PROPIETARIO"><MonthlyDeliveriesPage /></ProtectedRoute>
          }
        />

      <Route path="/owner/accounts" element={<ProtectedRoute role="PROPIETARIO"><OwnerAccountsPage /></ProtectedRoute>} />

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
