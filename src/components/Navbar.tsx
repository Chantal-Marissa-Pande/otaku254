import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-black/70 backdrop-blur border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link to="/" className="text-2xl font-bold">
          <span className="text-purple-500">Otaku</span>
          <span className="text-pink-500">254</span>
        </Link>

        <div className="hidden md:flex gap-6 text-sm">
          <Link to="/" className="hover:text-purple-400">Home</Link>
          <Link to="/anime" className="hover:text-purple-400">Anime</Link>
          <Link to="/manga" className="hover:text-purple-400">Manga</Link>
          <Link to="/kpop" className="hover:text-purple-400">K-pop</Link>
          <Link to="/merch" className="hover:text-purple-400">Merch</Link>
          <Link to="/about" className="hover:text-purple-400">About</Link>
          <Link to="/community" className="hover:text-purple-400">Community</Link>
        </div>

      </div>
    </nav>
  );
}