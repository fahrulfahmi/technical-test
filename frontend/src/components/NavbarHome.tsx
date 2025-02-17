import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../api/apiService"
import {Link} from "react-router-dom";

interface NavbarHomeProps {
  onLogout: () => void;
}

const NavbarHome: React.FC<NavbarHomeProps> = ({ onLogout }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);  
      try {
        const userData = await getUser();  
        setUsername(userData.username);  
      } catch (error) {
        console.error("Gagal mengambil profil pengguna", error);
      } finally {
        setLoading(false);  
      }
    };

    fetchUser();
  }, []);

  // Fungsi logout
  const handleLogout = () => {
    onLogout();
    localStorage.removeItem("token");  // Menghapus token setelah logout
    localStorage.removeItem("user");  // Menghapus data user setelah logout
    navigate("/");  // Redirect ke halaman utama
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
       <Link to="/home" className="text-xl font-bold">
        Artichel Travel
      </Link>
      <div className="flex items-center gap-4">
        {loading ? (
          <span>Loading...</span>
        ) : username ? (
          <span className="font-semibold"> {username}</span>
        ) : (
          <span>User tidak ditemukan</span> 
        )}
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavbarHome;
