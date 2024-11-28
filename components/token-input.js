// app/components/TokenInput.js
"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TokenInput() {
  const [token, setToken] = useState("");
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!token) {
      alert("Please enter a token.");
      return;
    }

    try {
      const res = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        const data = await res.json();
        document.cookie = `token=${token}`;
        document.cookie = `name=${data.santa}`;
        document.cookie = `gift=${data.receiver[0]}`;
        document.cookie = `id=${data.receiver_id}`;

        router.push("/dashboard");
      } else {
        setShowError(true);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setShowError(true);
    }
  };

  return (
    <>
      {showError && (
        <Alert variant="destructive" className="w-full max-w-md mb-6">
          <AlertDescription>
            On dirait bien que ton jeton est <strong>invalide</strong> !<br />
            Vérifie que tu l&apos;as bien copié en entier et réessaye
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-row gap-4">
        <Input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="max-w-xs"
          placeholder="Entre ton jeton ici"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <Button onClick={handleSubmit}>Valider</Button>
      </div>
    </>
  );
}
