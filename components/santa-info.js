"use client";
import { Button } from "@/components/ui/button";
import { getCookie } from "@/lib/cookies";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export default function SantaInfo() {
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      router.replace("/");
      return;
    }

    const name = getCookie("name");
    const gift = getCookie("gift");
    const hour = new Date().getHours();
    const greeting = hour < 17 ? "Bonjour" : "Bonsoir";

    setMessage(
      <p>
        {greeting} <span className="text-[#006F57] font-bold">{name}</span>, tu
        dois offrir un cadeau à{" "}
        <span
          className={`text-[#23856D] font-bold ${
            !isIOS()
              ? "blur-sm hover:blur-none focus:blur-none active:blur-none transition-all duration-500"
              : ""
          }`}
        >
          {gift}
        </span>
      </p>
    );
  }, [router]);

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  const logout = () => {
    document.cookie.split(";").forEach((c) => {
      document.cookie =
        c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    });
    router.replace("/");
  };

  return (
    <div className="text-center mb-8">
      <div id="santa" className="mb-4">
        {message}
      </div>
      <Button
        variant="destructive"
        size="icon"
        onClick={logout}
        title="Déconnection"
      >
        <LogOut />
      </Button>
    </div>
  );
}
