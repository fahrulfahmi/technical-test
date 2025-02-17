import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold px-4">Artichel Travel</Link>
      
      <button
        className="lg:hidden text-2xl"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>

      <div
        className={`mr-10 lg:flex flex-grow items-center justify-end space-x-4 ${isMenuOpen ? "block" : "hidden"} lg:block`}
      >
        <Link to="/login" className="px-4">Login</Link>
        <Link to="/register" className="px-4">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
