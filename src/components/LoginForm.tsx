// LoginForm.tsx

import { useState } from "react";
import toast from "react-hot-toast"; // Library untuk notifikasi toast
import { useNavigate } from "react-router-dom"; // Hook untuk navigasi
import { useAuth } from "../context/AuthContext"; // Memastikan hook useAuth diimpor dengan benar

const LoginForm = () => {
  // Mengambil fungsi `login` dari AuthContext melalui hook useAuth
  // `login` akan mengautentikasi pengguna dan menyimpan token
  const { login } = useAuth();

  // Hook untuk navigasi programatik
  const navigate = useNavigate();

  // State untuk menyimpan nilai input email dan password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handler untuk submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah refresh halaman default

    // Memanggil fungsi login dari AuthContext
    // Fungsi ini diharapkan mengembalikan `true` jika login berhasil, `false` jika gagal
    const success = await login(email, password);

    if (success) {
      // Jika login berhasil, tampilkan notifikasi sukses dan navigasi ke halaman profil
      // `toast.success` sudah bisa dipanggil karena react-hot-toast diimpor
      // `Maps("/profile")` akan mengarahkan user ke halaman profil Anda
      // Pastikan ada route `/profile` di App.tsx yang mengarah ke UserProfilePage
      toast.success("Login successful!");
      navigate("/");
    } else {
      // Jika login gagal, notifikasi error sudah ditangani di dalam AuthContext
      // jadi Anda mungkin tidak perlu `toast.error` di sini lagi, kecuali ada logic spesifik
      // Misalnya, jika `login` hanya mengembalikan `false` tanpa toast
      // Namun, jika AuthContext sudah mengelola toast, baris ini bisa dihilangkan
      // toast.error("Invalid credentials"); // Ini bisa dihilangkan jika toast sudah di AuthContext
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email" // ✅ Ditambahkan untuk aksesibilitas dan autofill browser
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password" // ✅ Ditambahkan untuk aksesibilitas dan autofill browser
      />
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
      >
        Log In
      </button>
    </form>
  );
};

export default LoginForm;
