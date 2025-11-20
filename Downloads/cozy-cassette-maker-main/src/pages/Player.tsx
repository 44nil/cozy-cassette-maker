import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CassetteTape } from "@/components/CassetteTape";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, Loader2 } from "lucide-react";

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
    if (!url) return "";
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
  };

  const handlePlay = () => {
    // --- SES EFEKTİ ---
    // Eğer çalmıyorsa (başlatılıyorsa) ses çıkar
    if (!isPlaying) {
        const audio = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_706997b459.mp3"); // Kısa mekanik klik sesi
        audio.volume = 0.6;
        audio.play().catch(e => console.log("Ses hatası:", e));
    }
    
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#8d6e63]" />
      </div>
    );
  }

  if (!mixtape) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center">
        <p className="text-2xl text-[#8d6e63] font-handwriting">Kaset bulunamadı :(</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-4 sm:p-8 font-handwriting">
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply" />

      <div className="w-full max-w-2xl z-10 flex flex-col items-center gap-8">
        
        <div className="text-center space-y-1 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-bold text-[#5d4037] tracking-wide" style={{ fontFamily: "'Covered By Your Grace', cursive" }}>
            For {mixtape.to_name}
          </h1>
          <p className="text-3xl text-[#8d6e63]">
            From {mixtape.from_name}
          </p>
        </div>

        <div className="w-full bg-[#eaddcf] rounded-[3rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#d7c9b8] flex flex-col gap-10 items-center relative overflow-hidden">
          
          <div className="transform hover:scale-105 transition-transform duration-500 ease-in-out">
            <CassetteTape
              bodyColor={mixtape.cassette_body_color}
              labelColor={mixtape.cassette_label_color}
              isPlaying={isPlaying}
              title={mixtape.to_name} 
              className="w-full max-w-[350px] md:max-w-[450px] drop-shadow-xl"
            />
          </div>

          <div className="w-full bg-[#d7c9b8]/40 rounded-2xl p-6 text-center">
            <p className="text-2xl md:text-3xl text-[#4a3b32] leading-relaxed">
              "{mixtape.message}"
            </p>
          </div>

          <Button
            onClick={handlePlay}
            className="w-full h-auto py-6 text-3xl rounded-2xl bg-[#e67e22] hover:bg-[#d35400] text-white shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-handwriting font-bold flex items-center justify-center gap-3 border-b-4 border-[#bf691e]"
          >
            {isPlaying ? (
              <>
                <Pause className="w-8 h-8 fill-current" />
                Duraklat
              </>
            ) : (
              <>
                <Play className="w-8 h-8 fill-current" />
                Play Mixtape
              </>
            )}
          </Button>

          {isPlaying && (
            <div className="absolute top-0 left-0 w-0 h-0 opacity-0 pointer-events-none">
              <iframe
                width="100"
                height="100"
                src={getYoutubeEmbedUrl(mixtape.youtube_link)}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Player;