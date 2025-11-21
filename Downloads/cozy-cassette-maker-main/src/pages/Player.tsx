import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CassetteTape } from "@/components/CassetteTape";
import { supabase } from "@/integrations/supabase/client";
import { Play, Pause, Loader2, Music2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button"; // Button eklendi

interface Mixtape {
  id: string;
  to_name: string;
  from_name: string;
  message: string;
  youtube_link: string;
  cassette_body_color: string;
  cassette_label_color: string;
  title: string | null; // <-- Burayı "string | null" yaptık
}

const Player = () => {
  const { id } = useParams();
  const [mixtape, setMixtape] = useState<Mixtape | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchMixtape = async () => {
      if (!id) return;
      const { data, error } = await supabase.from("mixtapes").select("*").eq("id", id).single();
      if (error) console.error("Error:", error);
      else setMixtape(data);
      setLoading(false);
    };
    fetchMixtape();
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return "";
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;
  };

  const handlePlay = () => {
    if (!isPlaying) {
      const audio = new Audio("https://cdn.pixabay.com/audio/2022/03/15/audio_706997b459.mp3");
      audio.volume = 0.6;
      audio.play().catch(e => console.log("Ses hatası:", e));
    }
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9EFE6]">
        <Loader2 className="w-10 h-10 animate-spin text-[#8B735B]" />
      </div>
    );
  }

  if (!mixtape) return null;

  return (
    <div className="min-h-screen bg-[#F2E3D5] flex flex-col items-center justify-center p-6 font-sans selection:bg-[#D4B59D] selection:text-white relative overflow-hidden">
      
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply" />

      <div className="w-full max-w-lg z-10 flex flex-col items-center gap-8 animate-in fade-in duration-700">
        
        <div className="text-center mb-2 space-y-2">
          <h1 className="text-6xl font-bold text-[#5A4A42]" style={{ fontFamily: "'Caveat', cursive" }}>
            For {mixtape.to_name}
          </h1>
          <p className="text-2xl text-[#8B735B]" style={{ fontFamily: "'Covered By Your Grace', cursive" }}>
            From {mixtape.from_name}
          </p>
        </div>

        <div className="transform hover:scale-[1.02] transition-transform duration-500 ease-in-out drop-shadow-2xl relative z-20">
          <CassetteTape
            bodyColor={mixtape.cassette_body_color}
            labelColor={mixtape.cassette_label_color}
            isPlaying={isPlaying}
            title={mixtape.title || mixtape.to_name}
            className="w-full max-w-[400px]"
          />
        </div>

        <div className="w-full space-y-6 px-4 max-w-md">
          <div className="flex items-center justify-center gap-6">
            <Button
              onClick={handlePlay}
              variant="ghost"
              className="w-16 h-16 rounded-full bg-[#e67e22]/90 hover:bg-[#d35400] text-white shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center p-0"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ml-1" />
              )}
            </Button>
            
            <div className="px-4 py-2 rounded-xl bg-[#FFF9F0] text-[#8B735B] text-sm font-medium font-serif tracking-wide border border-[#E6D5C3]/50 shadow-sm">
              Mixtape Player
            </div>
          </div>

          <div className="space-y-2">
            <Slider 
              value={[progress]} 
              max={100} 
              step={1} 
              className="cursor-pointer" 
              disabled
            />
            <div className="flex justify-between text-xs font-medium text-[#A89078] font-mono">
              <span>{isPlaying ? "0:42" : "0:00"}</span>
              <span>3:45</span>
            </div>
          </div>
          
          <div className="text-center">
             <p className="text-sm text-[#8B735B] italic font-serif">
                {isPlaying ? "♫ Now Playing..." : "Ready to play"}
             </p>
          </div>
        </div>

        <div className="text-center max-w-md px-4 mt-2">
          <p className="text-2xl md:text-3xl text-[#4a3b32] leading-relaxed font-handwriting" style={{ fontFamily: "'Caveat', cursive" }}>
            "{mixtape.message}"
          </p>
        </div>

        {isPlaying && (
          <div className="w-full mt-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
            <div className="bg-white p-3 pb-8 shadow-[0_8px_30px_rgba(0,0,0,0.15)] -rotate-2 transition-transform duration-500 hover:rotate-0 max-w-[320px] mx-auto rounded-sm">
              <div className="aspect-video bg-black/10 overflow-hidden relative filter sepia-[0.15] contrast-[1.05] rounded-sm">
                <iframe
                  width="100%"
                  height="100%"
                  src={getYoutubeEmbedUrl(mixtape.youtube_link)}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 mix-blend-overlay"></div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-[#5d4037] font-handwriting text-lg transform -rotate-1 opacity-80" style={{ fontFamily: "'Rock Salt', cursive" }}>
                  Çalıyor... ♫
                </p>
              </div>
            </div>
          </div>
        )}
        
      </div>
      
      <div className="fixed bottom-8 right-8 text-[#FFF9F0] opacity-60">
        <Music2 className="w-12 h-12 animate-bounce delay-700" />
      </div>

    </div>
  );
};

export default Player;