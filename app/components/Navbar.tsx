import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-center items-center p-4 bg-black shadow-md">
      <ul className="flex gap-x-10 text-md text-red-600 font-medium">
        <li>
          <Link
            href="/"
            className="relative text-white font-medium px-4 py-2 hover:text-red-700 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-red-700 hover:after:w-full after:transition-all after:duration-300"
          >
            Početna
          </Link>
        </li>
        <li>
          <Link
            href="/search"
            className="relative text-white font-medium px-4 py-2 hover:text-red-700 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-red-700 hover:after:w-full after:transition-all after:duration-300"
          >
            Pretraživanje
          </Link>
        </li>
        <li>
          <Link
            href="/favorites"
            className="relative text-white font-medium px-4 py-2 hover:text-red-700 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-red-700 hover:after:w-full after:transition-all after:duration-300"
          >
            Favoriti
          </Link>
        </li>
      </ul>
    </nav>
  );
}
