"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
 const router = useRouter();

 function handleClick() {
 router.back();
 }

 return (
 <button
 onClick={handleClick}
 className='bg-blue-600 hover:bg-blue-300 text-white px-3 py-1 rounded-md transition-colors'
 >
 Back
 </button>
 );
}
