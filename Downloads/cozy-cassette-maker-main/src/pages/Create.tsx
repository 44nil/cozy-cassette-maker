import { useState } from "react";
import { CassetteTape } from "@/components/CassetteTape";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Create = () => {
  const [bodyColor, setBodyColor] = useState("#D4A574");
  const [labelColor, setLabelColor] = useState("#F5E6D3");
  const [toName, setToName] = useState("");
  const [fromName, setFromName] = useState("");
  const [message, setMessage] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!toName || !fromName || !message || !youtubeLink) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const { data, error } = await supabase
        .from("mixtapes")
        .insert([
          {
            to_name: toName,
            from_name: fromName,
            message,
            youtube_link: youtubeLink,
            cassette_body_color: bodyColor,
            cassette_label_color: labelColor,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Mixtape created!",
        description: "Your mixtape is ready to share",
      });

      navigate(`/play/${data.id}`);
    } catch (error) {
      console.error("Error creating mixtape:", error);
      toast({
        title: "Error",
        description: "Failed to create mixtape. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-6xl font-bold text-primary">Mixtape for You</h1>
          <p className="text-xl text-muted-foreground">Create a personalized mixtape</p>
        </div>

        <div className="bg-card p-8 rounded-lg shadow-lg border-2 border-border space-y-6">
          <div className="flex justify-center">
            <CassetteTape bodyColor={bodyColor} labelColor={labelColor} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bodyColor" className="text-lg">Cassette Color</Label>
              <div className="flex gap-2">
                <Input
                  id="bodyColor"
                  type="color"
                  value={bodyColor}
                  onChange={(e) => setBodyColor(e.target.value)}
                  className="w-16 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={bodyColor}
                  onChange={(e) => setBodyColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="labelColor" className="text-lg">Label Color</Label>
              <div className="flex gap-2">
                <Input
                  id="labelColor"
                  type="color"
                  value={labelColor}
                  onChange={(e) => setLabelColor(e.target.value)}
                  className="w-16 h-10 cursor-pointer"
                />
                <Input
                  type="text"
                  value={labelColor}
                  onChange={(e) => setLabelColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="toName" className="text-lg">To:</Label>
              <Input
                id="toName"
                placeholder="Their name"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fromName" className="text-lg">From:</Label>
              <Input
                id="fromName"
                placeholder="Your name"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-lg">Message:</Label>
              <Textarea
                id="message"
                placeholder="Write your heartfelt message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-24 text-lg resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeLink" className="text-lg">YouTube Link:</Label>
              <Input
                id="youtubeLink"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
                className="text-lg"
              />
            </div>
          </div>

          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className="w-full text-xl py-6 bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
          >
            {isCreating ? "Creating..." : "Create Mixtape"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Create;
