import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";

function App() {
  if (window.location.pathname === "/dashboard") {
    return <DashboardPage />;
  }

  return <LoginPage />;
}

export default App;