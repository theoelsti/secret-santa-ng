import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Key, Mail } from "lucide-react";
import { useEffect, useState } from "react";
export default function ManageExisting() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
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
    fetchMembers();
  }, []);

  const groupByFamily = (members) => {
    return members.reduce((acc, member) => {
      (acc[member.family] = acc[member.family] || []).push(member);
      return acc;
    }, {});
  };

  const copyToken = async (member, type) => {
    const baseUrl = `${window.location.origin}/?token=${member.token}`;
    const text =
      type === "token"
        ? member.token
        : `👋 Bonsoir ${member.name}!\n🌐 Rend toi sur le site suivant : ${baseUrl} et découvre à qui tu dois offrir ton cadeau !\n🔑 Voici ton jeton d'authentification :\n${member.token}`;

    await navigator.clipboard.writeText(text);
    setCopiedId(`${member.id}-${type}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    // Skeleton loading state
    return (
      <div className="flex flex-col items-center space-y-6">
        {[1, 2, 3].map((_, index) => (
          <Card
            key={index}
            className="w-full max-w-2xl bg-white shadow-lg rounded-lg"
          >
            <CardHeader>
              <div className="h-4 bg-gray-300 rounded-md w-1/3 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-20 bg-gray-300 rounded-md animate-pulse"></div>
                      <div className="h-3 w-3 bg-gray-300 rounded-full animate-pulse"></div>
                    </div>
                    <div className="h-6 w-24 bg-gray-300 rounded-md animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col items-center space-y-6">
        {Object.entries(members).map(([family, familyMembers]) => (
          <Card
            key={family}
            className="w-full max-w-2xl bg-white shadow-lg rounded-lg"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{family}</CardTitle>
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

                    <div className="flex gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => copyToken(member, "token")}
                            variant="outline"
                            size="icon"
                          >
                            {copiedId === `${member.id}-token` ? (
                              <Check className="h-4 w-4 text-green-500 animate-in zoom-in spin-in-90 duration-300" />
                            ) : (
                              <Key className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copier le token</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => copyToken(member, "message")}
                            variant="outline"
                            size="icon"
                          >
                            {copiedId === `${member.id}-message` ? (
                              <Check className="h-4 w-4 text-green-500 animate-in zoom-in spin-in-90 duration-300" />
                            ) : (
                              <Mail className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Copier le message complet
                        </TooltipContent>
                      </Tooltip>
                    </div>
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
