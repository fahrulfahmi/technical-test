import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/apiService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import bgregister from "../assets/bglogin.jpg"

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("Semua field wajib diisi!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.register({ username, email, password });

      toast.success("Registrasi berhasil! Silakan login.", {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => navigate("/login"), 1000);
    } catch (error: any) {
      toast.error("Registrasi gagal. Coba lagi!", {
        position: "top-right",
        autoClose: 3000,
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgregister})` }}
    >
      <ToastContainer />
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Daftar</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? (
              <span className="w-6 h-6 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></span> // Spinner
            ) : (
              "Daftar"
            )}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Sudah punya akun? <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
