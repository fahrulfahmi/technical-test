import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import NavbarHome from "./components/NavbarHome";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import AddArticles from "./pages/Articeles";
import ArticleDetail from "./pages/DetailArticles";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Fungsi untuk mengupdate status login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {isAuthenticated ? <NavbarHome onLogout={handleLogout} /> : <Navbar />}

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-article" element={<AddArticles />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
