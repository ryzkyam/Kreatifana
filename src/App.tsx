// App.tsx

import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./appRoutes"; // Gunakan ini!
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </Router>
  );
}

export default App;
