import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CassetteTape } from "@/components/CassetteTape";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause } from "lucide-react";

interface Mixtape {
  id: string;
  to_name: string;
  from_name: string;
  message: string;
  youtube_link: string;
  cassette_body_color: string;
  cassette_label_color: string;
}

const Player = () => {
  const { id } = useParams();
  const [mixtape, setMixtape] = useState<Mixtape | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMixtape = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("mixtapes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching mixtape:", error);
      } else {
        setMixtape(data);
      }
      setLoading(false);
    };

    fetchMixtape();
  }, [id]);

  const getYoutubeEmbedUrl = (url: string) => {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
  };

  const handlePlay = () => {
    // Play click sound
    const clickSound = new Audio("data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU4AAAA=");
    clickSound.play();
    
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!mixtape) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl text-muted-foreground">Mixtape not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-5xl font-bold text-primary">
            For {mixtape.to_name}
          </h1>
          <p className="text-2xl text-muted-foreground">
            From {mixtape.from_name}
          </p>
        </div>

        <div className="bg-card p-8 rounded-lg shadow-lg border-2 border-border space-y-6">
          <div className="flex justify-center">
            <CassetteTape
              bodyColor={mixtape.cassette_body_color}
              labelColor={mixtape.cassette_label_color}
              isPlaying={isPlaying}
            />
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <p className="text-xl text-foreground whitespace-pre-wrap text-center">
              {mixtape.message}
            </p>
          </div>

          <Button
            onClick={handlePlay}
            className="w-full text-xl py-6 bg-accent hover:bg-accent/90 text-accent-foreground font-bold flex items-center justify-center gap-2"
          >
            {isPlaying ? (
              <>
                <Pause className="w-6 h-6" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-6 h-6" />
                Play Mixtape
              </>
            )}
          </Button>

          {isPlaying && (
            <div className="aspect-video rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src={getYoutubeEmbedUrl(mixtape.youtube_link)}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
