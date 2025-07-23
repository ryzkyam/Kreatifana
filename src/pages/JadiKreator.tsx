// pages/jadiKreator.tsx
import { useForm } from "@formspree/react"; // atau bisa pakai fetch ke backend kamu langsung

function JadiKreatorPage() {
  const [state, handleSubmit] = useForm("mzzvbdjz");

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Ajukan Menjadi Kreator
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Isi form berikut untuk mengajukan diri sebagai kreator di platform
          Kreatifana.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full p-3 border rounded-lg"
              placeholder="Masukkan nama lengkap"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Link Portofolio (opsional)
            </label>
            <input
              type="url"
              name="portfolio"
              className="w-full p-3 border rounded-lg"
              placeholder="https://behance.net/..."
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Alasan Menjadi Kreator
            </label>
            <textarea
              name="reason"
              required
              className="w-full p-3 border rounded-lg"
              rows={4}
              placeholder="Tulis alasanmu di sini..."
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={state.submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            {state.submitting ? "Mengirim..." : "Ajukan Sekarang"}
          </button>
          {state.succeeded && (
            <p className="text-green-600 text-center">
              Pengajuan berhasil dikirim!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default JadiKreatorPage;
