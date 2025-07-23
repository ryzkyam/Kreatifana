import { Facebook, Github as GitHub, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Kreatifana</h3>
            <p className="text-gray-400 mb-4">
              Tempat kreator Indonesia terhubung, mempromosikan karya, dan
              menjual produk digital tanpa batas.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <GitHub size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Kategori</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/category/Illustration"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Art & Illustration
                </Link>
              </li>
              <li>
                <Link
                  to="/category/Photography"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Photography
                </Link>
              </li>
              <li>
                <Link
                  to="/category/Web-Development"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  to="/category/Music"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Music
                </Link>
              </li>
              <li>
                <Link
                  to="/category/Design"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Design
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Perusahaan kami</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/profil-perusahaan"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Tentang Kita
                </Link>
              </li>
              <li>
                <Link
                  to="/kontak-perusahaan"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Kontak
                </Link>
              </li>
              <li>
                <Link
                  to="/karir"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Karir
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Dukungan</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/help"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Pusat Bantuan
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Syarat Layanan
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  to="/license"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Lisensi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} Kreatifana. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
