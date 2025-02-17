import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../api/apiService"
import {Link} from "react-router-dom";

interface NavbarHomeProps {
  onLogout: () => void;
}

const NavbarHome: React.FC<NavbarHomeProps> = ({ onLogout }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);  // Menambahkan state loading
  const navigate = useNavigate();

  // Mengambil profil pengguna setelah login
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);  // Memulai loading saat pengambilan data
      try {
        const userData = await getUser();  // Memanggil API untuk mendapatkan user
        setUsername(userData.username);  // Menyimpan username dari API
      } catch (error) {
        console.error("Gagal mengambil profil pengguna", error);
      } finally {
        setLoading(false);  // Menghentikan loading setelah data diambil
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
      {/* <h1 className="text-xl font-bold">Artichel Travel</h1> */}
      <div className="flex items-center gap-4">
        {loading ? (
          <span>Loading...</span>  // Menampilkan loading saat data user masih diambil
        ) : username ? (
          <span className="font-semibold"> {username}</span>  // Menampilkan username
        ) : (
          <span>User tidak ditemukan</span>  // Menangani kondisi jika username tidak ada
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
