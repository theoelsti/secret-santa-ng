"use client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCookie } from "@/lib/cookies";
import { useEffect, useState } from "react";
export default function GiftManagement() {
  const [gifts, setGifts] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [newGift, setNewGift] = useState("");
  const [credit, setCredit] = useState(null);
  const [totalGifts, setTotalGifts] = useState(0);
  const [message, setMessage] = useState(null);

  const getTotalGifts = async () => {
    try {
      const res = await fetch("/api/receivers/gift/total");
      if (res.ok) {
        const data = await res.json();
        setTotalGifts(data.total_gifts);
      }
    } catch (error) {
      console.error("Failed to get total gifts:", error);
    }
  };

  const checkCredit = async () => {
    const token = getCookie("token");

    try {
      const res = await fetch("/api/receivers/credit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (res.ok) {
        const data = await res.json();
        setCredit(data.has_credit);
      }
    } catch (error) {
      console.error("Failed to check credit:", error);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/receivers/all");
      if (res.ok) {
        const data = await res.json();
        const receiverId = getCookie("id");
        // Filtrer pour ne pas afficher le destinataire
        setMembers(
          data.receivers
            .map(([id, name]) => [id, name])
            .filter(([id]) => id !== parseInt(receiverId))
        );
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
  };

  const fetchGifts = async () => {
    const receiverId = getCookie("id");
    const token = getCookie("token");

    try {
      const res = await fetch(`/api/receivers/gift/${receiverId}`);

      if (res.ok) {
        const data = await res.json();
        setGifts(data.gifts.map((g) => g.gift));
      }
    } catch (error) {
      console.error("Failed to fetch gifts:", error);
    }
  };

  useEffect(() => {
    fetchGifts();
    fetchMembers();
    checkCredit();
    getTotalGifts();
  }, []);

  const handleSubmitGift = async () => {
    if (!selectedMember || !newGift) {
      alert("Merci de séléctionner un nom et d'entrer un cadeau");
      return;
    }

    try {
      const res = await fetch("/api/receivers/gift", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gift: newGift,
          receiver: selectedMember,
          token: getCookie("token"),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "default",
          text: data.message,
        });
        setNewGift("");
        setSelectedMember("");
        fetchGifts();
        getTotalGifts();
      } else {
        setMessage({
          type: "destructive",
          text: data.message,
        });
      }
    } catch (error) {
      console.error("Failed to submit gift:", error);
      setMessage({
        type: "destructive",
        text: "Une erreur est survenue lors de l'envoi du cadeau",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-center mb-4">Cadeaux Proposés</h2>

      <div className="mb-8">
        {gifts.length === 0 ? (
          <div className="text-center">
            <p>Rien pour le moment 😒</p>
            <img
              src="https://c.tenor.com/_BiwWBWhYucAAAAd/tenor.gif"
              alt="Confused John Travolta"
              className="w-1/3 mx-auto mt-4"
            />
          </div>
        ) : (
          <ul className="list-disc pl-6">
            {gifts.map((gift, i) => (
              <li key={i}>{gift}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="text-center mb-8">
        {credit !== null && credit && (
          <p className="text-sm text-green-600">
            Vous pouvez proposer 1 cadeau pour vous-même.
          </p>
        )}
        <p className="text-sm mb-4">
          Nombre total de cadeaux proposés : {totalGifts}
        </p>
      </div>

      {message && (
        <Alert variant={message.type} className="mb-8">
          <AlertDescription
            dangerouslySetInnerHTML={{ __html: message.text }}
          />
        </Alert>
      )}

      <div className="flex gap-4 justify-center">
        <Select value={selectedMember} onValueChange={setSelectedMember}>
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Choisir" />
          </SelectTrigger>
          <SelectContent>
            {members.map(([id, name]) => (
              <SelectItem key={id} value={id.toString()}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          value={newGift}
          onChange={(e) => setNewGift(e.target.value)}
          placeholder="Entre un cadeau"
          className="max-w-xs"
        />

        <Button onClick={handleSubmitGift}>Envoyer</Button>
      </div>
    </div>
  );
}
