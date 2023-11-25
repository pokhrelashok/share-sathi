"use client";

import { useRouter } from "next/navigation";

function BackIcon() {
  const router = useRouter();
  return (
    <svg
      onClick={() => {
        router.back();
      }}
      className="cursor-pointer"
      height="40px"
      id="Layer_1"
      version="1.1"
      viewBox="0 0 512 512"
      width="40px"
    >
      <polygon points="352,128.4 319.7,96 160,256 160,256 160,256 319.7,416 352,383.6 224.7,256 " />
    </svg>
  );
}

export default BackIcon;
