"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function SecretSantaForm() {
  const [families, setFamilies] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [showTokens, setShowTokens] = useState(false);

  const addFamily = () => {
    setFamilies([...families, { id: Date.now(), name: "", members: [] }]);
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
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          families: families.map((family) => ({
            name: family.name,
            members: family.members.map((m) => ({
              id: m.id,
              name: m.name,
            })),
          })),
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
    <div className="space-y-4">
      <Button onClick={addFamily} className="mb-4">
        Add Family
      </Button>

      {families.map((family, familyIndex) => (
        <Card key={family.id}>
          {" "}
          {/* Utiliser `family.id` comme clé */}
          <CardHeader className="flex flex-row justify-between items-center">
            <Input
              placeholder="Family name"
              value={family.name}
              onChange={(e) => updateFamilyName(familyIndex, e.target.value)}
              className="max-w-xs"
            />
            <Button
              variant="destructive"
              onClick={() => removeFamily(familyIndex)}
              size="sm"
            >
              Remove Family
            </Button>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => addMember(familyIndex)}
              className="mb-4"
              size="sm"
            >
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
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {families.length > 0 && (
        <Button onClick={generateSecretSanta}>Generate Secret Santa</Button>
      )}
    </div>
  );
}
