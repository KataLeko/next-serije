import Link from 'next/link';

export default function NotFound() {
  return (
 <>
      <h1 className="text-4xl font-bold mb-4">404 - Stranica nije pronađena</h1>
      
      
      <Link
        href="/"
        className="relative text-white font-medium px-4 py-2 hover:text-red-700 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-red-700 hover:after:w-full after:transition-all after:duration-300"
      >
        Natrag na početnu
      </Link>
    </>
  );
}
