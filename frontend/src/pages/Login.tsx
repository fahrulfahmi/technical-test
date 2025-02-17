import { useState } from "react";
import { authApi, userApi } from "../api/apiService";
import { useNavigate } from "react-router-dom";
import bglogin from "../assets/bglogin.jpg";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null); 
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan password wajib diisi!");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      console.log("Mengirim login request...");

      const response = await authApi.login({ email, password });
      const token = response.data.token;

      if (!token) throw new Error("Token tidak diterima dari server");

      localStorage.setItem("token", token);

      const profileResponse = await userApi.getProfile();
      localStorage.setItem("user", JSON.stringify(profileResponse.data));

      setUser(profileResponse.data);

      console.log("Login berhasil, navigasi ke /home");

      onLogin();
      navigate("/home");
    } catch (error: any) {
      setErrorMessage("Login gagal. Periksa email & password!");
      console.error("Login gagal:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bglogin})` }}
    >
      <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Login</h2>

        {errorMessage && (
          <div className="text-red-500 text-center mb-4">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-300"
            disabled={loading}
          >
            {loading ? (
              <span className="w-6 h-6 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
