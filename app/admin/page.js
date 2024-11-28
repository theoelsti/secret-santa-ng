// app/admin/page.js
"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AdminPage() {
  const [families, setFamilies] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [showTokens, setShowTokens] = useState(false);

  const addFamily = () => {
    setFamilies([...families, { name: "", members: [] }]);
  };

  const addMember = (familyIndex) => {
    const updatedFamilies = [...families];
    updatedFamilies[familyIndex].members.push({
      id: Date.now(),
      name: "",
    });
    setFamilies(updatedFamilies);
  };

  const updateMember = (familyIndex, memberIndex, value) => {
    const updatedFamilies = [...families];
    updatedFamilies[familyIndex].members[memberIndex].name = value;
    setFamilies(updatedFamilies);
  };

  const updateFamilyName = (index, value) => {
    const updatedFamilies = [...families];
    updatedFamilies[index].name = value;
    setFamilies(updatedFamilies);
  };

  const removeMember = (familyIndex, memberIndex) => {
    const updatedFamilies = [...families];
    updatedFamilies[familyIndex].members.splice(memberIndex, 1);
    setFamilies(updatedFamilies);
  };

  const removeFamily = (index) => {
    const updatedFamilies = [...families];
    updatedFamilies.splice(index, 1);
    setFamilies(updatedFamilies);
  };

  const generateSecretSanta = async () => {
    try {
      const formattedData = families.map((family) => ({
        name: family.name,
        members: family.members.map((m) => ({
          id: m.id,
          name: m.name,
        })),
      }));

      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          families: formattedData,
          token: "G67CCL47F2PAZALV5F6J",
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setTokens(data.tokens);
        setShowTokens(true);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Failed to generate:", error);
      alert("Failed to generate secret santa");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Panel - Secret Santa</h1>

      <Button onClick={addFamily} className="mb-4">
        Add Family
      </Button>

      <div className="space-y-4">
        {families.map((family, familyIndex) => (
          <Card key={family.name || familyIndex}>
            <CardHeader className="flex flex-row justify-between items-center">
              <div className="flex-1">
                <Input
                  placeholder="Family name"
                  value={family.name}
                  onChange={(e) =>
                    updateFamilyName(familyIndex, e.target.value)
                  }
                />
              </div>
              <Button
                variant="destructive"
                onClick={() => removeFamily(familyIndex)}
                className="ml-2"
              >
                Remove Family
              </Button>
            </CardHeader>
            <CardContent>
              <Button onClick={() => addMember(familyIndex)} className="mb-4">
                Add Member
              </Button>

              <div className="space-y-2">
                {family.members.map((member, memberIndex) => (
                  <div key={member.id} className="flex gap-2">
                    <Input
                      placeholder="Member name"
                      value={member.name}
                      onChange={(e) =>
                        updateMember(familyIndex, memberIndex, e.target.value)
                      }
                    />
                    <Button
                      variant="destructive"
                      onClick={() => removeMember(familyIndex, memberIndex)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        onClick={generateSecretSanta}
        className="mt-8"
        disabled={!families.length}
      >
        Generate Secret Santa
      </Button>

      <AlertDialog open={showTokens} onOpenChange={setShowTokens}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generated Tokens</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                {tokens.map((token, index) => (
                  <div key={index} className="p-4 bg-gray-100 rounded">
                    <pre className="whitespace-pre-wrap">
                      👋 Bonsoir {token.name}! 🌐 Rend toi sur le site suivant :
                      https://santa.example.com et découvre à qui tu dois offrir
                      ton cadeau ! 🔑 Voici ton jeton d'authentification :
                      {token.token}
                    </pre>
                    <Button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `👋 Bonsoir ${token.name}!\n🌐 Rend toi sur le site suivant : https://santa.example.com et découvre à qui tu dois offrir ton cadeau !\n🔑 Voici ton jeton d'authentification :\n${token.token}`
                        )
                      }
                      className="mt-2"
                    >
                      Copy
                    </Button>
                  </div>
                ))}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
