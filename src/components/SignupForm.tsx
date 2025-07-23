// Signupform.tsx

import axios from "axios"; // Asumsi Anda menggunakan axios untuk registrasi
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signupform = () => {
  // const { signup } = useAuth(); // Jika Anda punya fungsi signup di AuthContext
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State baru untuk konfirmasi password
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validasi Frontend: Konfirmasi password harus cocok
    if (password !== confirmPassword) {
      toast.error("Password dan Konfirmasi Password tidak cocok.");
      setIsLoading(false);
      return;
    }

    try {
      // ✅ PENTING: Periksa payload ini dan pastikan sesuai dengan yang diharapkan backend
      // Backend Anda harus menerima `name`, `username`, `email`, dan `password`.
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        {
          name,
          username,
          email,
          password,
        }
      );

      if (response.data.success) {
        toast.success("Registrasi berhasil! Silakan login.");
        navigate("/LoginPage"); // Arahkan ke halaman login
      } else {
        // Jika backend mengirim `success: false` tapi bukan error HTTP, tangani di sini
        setError(response.data.message || "Registrasi gagal.");
        toast.error(response.data.message || "Registrasi gagal.");
      }
    } catch (err: any) {
      console.error("Error registrasi:", err);
      if (axios.isAxiosError(err) && err.response) {
        // Tangani error HTTP dari backend (misal: 400 Bad Request, 409 Conflict)
        const errorMessage =
          err.response.data.message ||
          `Error ${err.response.status}: ${err.response.statusText}`;
        setError(errorMessage);
        toast.error(errorMessage);
        // ✅ Untuk error 400 (Bad Request) atau 409 (Conflict), periksa detail pesan dari backend.
        // Ini seringkali menunjukkan masalah validasi (misal: username/email sudah ada, password lemah, field kosong).
        console.log("Backend response for 400/409:", err.response.data);
      } else {
        // Tangani error jaringan atau lainnya
        setError(
          "Terjadi kesalahan jaringan atau server tidak dapat dijangkau."
        );
        toast.error(
          "Terjadi kesalahan jaringan atau server tidak dapat dijangkau."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Daftar Akun Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nama
          </label>
          <input
            type="text"
            id="name"
            placeholder="Nama Lengkap"
            className="w-full px-4 py-2 text-gray-900 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 border-gray-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            placeholder="Pilih Username"
            className="w-full px-4 py-2 text-gray-900 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 border-gray-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Alamat Email"
            className="w-full px-4 py-2 text-gray-900 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label
            htmlFor="new-password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="new-password" // ID unik
            placeholder="Password baru"
            className="w-full px-4 py-2 text-gray-900 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 border-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700"
          >
            Konfirmasi Password
          </label>
          <input
            type="password"
            id="confirm-password" // ID unik dan berbeda
            placeholder="Konfirmasi password Anda"
            className="w-full px-4 py-2 text-gray-900 border rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 border-gray-300"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Mendaftar..." : "Daftar"}
        </button>
      </form>
    </div>
  );
};

export default Signupform;
