import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

export default function ManageExisting() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/admin/members");
      if (res.ok) {
        const data = await res.json();
        const groupedMembers = groupByFamily(data.members);
        setMembers(groupedMembers);
      }
    } catch (error) {
      console.error("Failed to fetch members:", error);
    }
    setLoading(false);
  };

  const groupByFamily = (members) => {
    return members.reduce((acc, member) => {
      (acc[member.family] = acc[member.family] || []).push(member);
      return acc;
    }, {});
  };

  const copyToken = async (member) => {
    const message = `👋 Bonsoir ${member.name}!\n🌐 Rend toi sur le site suivant : https://santa.example.com et découvre à qui tu dois offrir ton cadeau !\n🔑 Voici ton jeton d'authentification :\n${member.token}`;
    await navigator.clipboard.writeText(message);
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {Object.entries(members).map(([family, familyMembers]) => (
          <Card key={family} className="w-full sm:w-1/2 md:w-1/3">
            <CardHeader>
              <CardTitle>{family}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{member.name}</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <div
                            className={`h-3 w-3 rounded-full ${
                              member.lastSeen ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {member.lastSeen
                            ? `Dernière connexion: ${new Date(
                                member.lastSeen
                              ).toLocaleString()}`
                            : "Jamais connecté"}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Button
                      onClick={() => copyToken(member)}
                      variant="outline"
                      size="sm"
                    >
                      Copier Token
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}
