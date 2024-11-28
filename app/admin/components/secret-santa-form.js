"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SecretSantaForm() {
  const [families, setFamilies] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [showTokens, setShowTokens] = useState(false);

  const handleAddFamily = () => {
    setFamilies([...families, { id: Date.now(), name: "", members: [] }]);
  };

  const handleUpdateFamilyName = (index, name) => {
    setFamilies((prevFamilies) => {
      const updatedFamilies = [...prevFamilies];
      updatedFamilies[index].name = name;
      return updatedFamilies;
    });
  };

  const handleAddMember = (familyIndex) => {
    setFamilies((prevFamilies) => {
      const updatedFamilies = [...prevFamilies];
      updatedFamilies[familyIndex] = {
        ...updatedFamilies[familyIndex],
        members: [
          ...updatedFamilies[familyIndex].members,
          { id: Date.now(), name: "" },
        ],
      };
      return updatedFamilies;
    });
  };

  const handleUpdateMemberName = (familyIndex, memberIndex, name) => {
    setFamilies((prevFamilies) => {
      const updatedFamilies = [...prevFamilies];
      updatedFamilies[familyIndex].members[memberIndex].name = name;
      return updatedFamilies;
    });
  };

  const handleRemoveMember = (familyIndex, memberIndex) => {
    setFamilies((prevFamilies) => {
      const updatedFamilies = [...prevFamilies];
      updatedFamilies[familyIndex].members.splice(memberIndex, 1);
      return updatedFamilies;
    });
  };

  const handleRemoveFamily = (familyIndex) => {
    setFamilies((prevFamilies) => {
      const updatedFamilies = [...prevFamilies];
      updatedFamilies.splice(familyIndex, 1);
      return updatedFamilies;
    });
  };

  const handleGenerateSecretSanta = async () => {
    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          families: families.map((family) => ({
            name: family.name,
            members: family.members.map((member) => ({
              id: member.id,
              name: member.name,
            })),
          })),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setTokens(data.tokens);
        setShowTokens(true);
      } else {
        alert(data.message || "Failed to generate Secret Santa");
      }
    } catch (error) {
      console.error("Failed to generate Secret Santa:", error);
      alert("An error occurred while generating Secret Santa.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Créer votre Secret Santa</h2>
        <Button onClick={handleAddFamily}>Ajouter une famille</Button>
      </div>

      {families.length === 0 ? (
        <p className="text-gray-600 text-center">
          Pas encore de famille. Cliquez sur &quot;Ajouter une famille&quot;
          pour commencer!
        </p>
      ) : (
        families.map((family, familyIndex) => (
          <Card key={family.id} className="bg-gray-50 shadow-md">
            <CardHeader className="flex justify-between items-center">
              <Input
                placeholder="Nom de Famille"
                value={family.name}
                onChange={(e) =>
                  handleUpdateFamilyName(familyIndex, e.target.value)
                }
                className="max-w-md"
              />
              <Button
                variant="destructive"
                onClick={() => handleRemoveFamily(familyIndex)}
                size="sm"
              >
                Supprimer la famille
              </Button>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleAddMember(familyIndex)}
                size="sm"
                className="mb-4"
              >
                Ajouter un membre
              </Button>

              {family.members.length === 0 ? (
                <p className="text-gray-500">
                  Pas encore de membre. Ajoutez-en un!
                </p>
              ) : (
                family.members.map((member, memberIndex) => (
                  <div key={member.id} className="flex items-center gap-4 mb-2">
                    <Input
                      placeholder="Prénom"
                      value={member.name}
                      onChange={(e) =>
                        handleUpdateMemberName(
                          familyIndex,
                          memberIndex,
                          e.target.value
                        )
                      }
                      className="flex-grow"
                    />
                    <Button
                      variant="destructive"
                      onClick={() =>
                        handleRemoveMember(familyIndex, memberIndex)
                      }
                      size="sm"
                    >
                      Supprimer
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))
      )}

      {families.length > 0 && (
        <div className="flex justify-center">
          <Button onClick={handleGenerateSecretSanta} className="mt-6">
            Générer le secret santa
          </Button>
        </div>
      )}
    </div>
  );
}
