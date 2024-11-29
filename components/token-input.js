"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TokenInput() {
  const [token, setToken] = useState("");
  const [showError, setShowError] = useState(false);
  const [autoSubmitting, setAutoSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkExistingToken = async () => {
      const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
      if (cookieToken) {
        setAutoSubmitting(true);
        await handleSubmit(cookieToken);
      } else {
        const urlToken = searchParams.get("token");
        if (urlToken) {
          setToken(urlToken);
          setAutoSubmitting(true);
          await handleSubmit(urlToken);
        }
      }
    };

    checkExistingToken();
    // eslint-disable-next-line
  }, [searchParams]);

  const handleSubmit = async (tokenToSubmit = token) => {
    if (!tokenToSubmit) {
      alert("Please enter a token.");
      return;
    }
    try {
      const res = await fetch("/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToSubmit }),
      });
      if (res.ok) {
        const data = await res.json();
        document.cookie = `token=${tokenToSubmit}`;
        document.cookie = `name=${data.santa}`;
        document.cookie = `gift=${data.receiver}`;
        document.cookie = `id=${data.receiver_id}`;
        router.push("/dashboard");
      } else {
        setShowError(true);
        setAutoSubmitting(false);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setShowError(true);
      setAutoSubmitting(false);
    }
  };

  if (autoSubmitting) {
    return <div>Connexion en cours...</div>;
  }

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
        <Button onClick={() => handleSubmit()}>Valider</Button>
      </div>
    </>
  );
}
