import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Vendors from "./pages/Vendors";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
import Themes from "./pages/Themes";
import Statistics from "./pages/Statistics";

function App() {
  return (
    <Router>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <div className="p-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/themes" element={<Themes />} />
              <Route path="/statistics" element={<Statistics />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
