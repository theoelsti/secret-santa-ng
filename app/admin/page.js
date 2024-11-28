"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ManageExisting from "./components/manage-users";
import SecretSantaForm from "./components/secret-santa-form";

export default function AdminPanel() {
  const [mode, setMode] = useState(null);
  const [authToken, setAuthToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication on load
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth");
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleAuth = async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: authToken }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        alert("Token invalide");
      }
    } catch (err) {
      console.error("Authentication error:", err);
    }
  };

  const handleLogout = async () => {
    // Clear session cookie
    document.cookie = "admin_session=; Max-Age=0; path=/;";
    setIsAuthenticated(false);
    setMode(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-center">Admin Authentication</h1>
        <input
          type="password"
          value={authToken}
          onChange={(e) => setAuthToken(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter admin token"
        />
        <Button onClick={handleAuth} className="w-full">
          Login
        </Button>
      </div>
    );
  }

  if (!mode) {
    return (
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-center">
          Admin Panel - Secret Santa
        </h1>
        <Button onClick={() => setMode("create")} className="w-full">
          Créer un nouveau Secret Santa
        </Button>
        <Button onClick={() => setMode("manage")} className="w-full">
          Gérer le Secret Santa actuel
        </Button>
        <Button onClick={handleLogout} variant="outline" className="w-full">
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button onClick={() => setMode(null)} className="mb-4">
        Retour
      </Button>
      {mode === "create" ? <SecretSantaForm /> : <ManageExisting />}
    </div>
  );
}
