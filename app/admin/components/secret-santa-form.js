"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Gift, Plus, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
export default function SecretSantaForm({ onSuccess }) {
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
        onSuccess?.();
      } else {
        alert(data.message || "Failed to generate Secret Santa");
      }
    } catch (error) {
      console.error("Failed to generate Secret Santa:", error);
      alert("An error occurred while generating Secret Santa.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Créer votre Secret Santa</h2>
        <Button onClick={handleAddFamily}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une famille
        </Button>
      </div>

      <div className="space-y-6">
        {families.map((family, familyIndex) => (
          <Card key={family.id}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Input
                  placeholder="Nom de Famille"
                  value={family.name}
                  onChange={(e) =>
                    handleUpdateFamilyName(familyIndex, e.target.value)
                  }
                  className="max-w-sm"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveFamily(familyIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator className="my-4" />
              <div className="space-y-3">
                {family.members.map((member, memberIndex) => (
                  <div key={member.id} className="flex items-center gap-2">
                    <Input
                      placeholder="Prénom du membre"
                      value={member.name}
                      onChange={(e) =>
                        handleUpdateMemberName(
                          familyIndex,
                          memberIndex,
                          e.target.value
                        )
                      }
                      className="flex-1"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() =>
                        handleRemoveMember(familyIndex, memberIndex)
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddMember(familyIndex)}
                className="w-full mt-2 border-dashed"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Ajouter un membre
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {families.length > 0 && (
        <div className="text-center pt-4">
          <Button size="lg" onClick={handleGenerateSecretSanta}>
            <Gift className="mr-2 h-5 w-5" />
            Générer le Secret Santa
          </Button>
        </div>
      )}
    </div>
  );
}
