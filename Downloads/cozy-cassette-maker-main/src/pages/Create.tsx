import { useState } from "react";
import { CassetteTape } from "@/components/CassetteTape";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Disc, Music2, ChevronLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";

// --- GÖRSELDEN ALINAN BİREBİR ŞABLONLAR ---
const CASSETTE_TEMPLATES = [
  { id: 1, name: "Soundtrack", body: "#F4A460", label: "#E0F7FA" }, // Turuncu & Mavi (Görseldeki Sound Track)
  { id: 2, name: "Retro Yeşil", body: "#388E3C", label: "#F1F8E9" }, // Koyu Yeşil (Görseldeki Orwo)
  { id: 3, name: "Sevgililer", body: "#F8BBD0", label: "#FFEBEE" }, // Pembe (Valentine's Mix)
  { id: 4, name: "Gece Mavisi", body: "#1A237E", label: "#E3F2FD" }, // Koyu Mavi (Stereo)
  { id: 5, name: "Klasik Gri", body: "#B0BEC5", label: "#FFFFFF" }, // Gri (Infonics)
  { id: 6, name: "Şeffaf Mor", body: "rgba(156, 39, 176, 0.7)", label: "#E1BEE7" }, // Şeffaf Mor
  { id: 7, name: "Vintage Krem", body: "#D7CCC8", label: "#3E2723" }, // Krem & Kahve (True Sound)
  { id: 8, name: "Neon Siyah", body: "#212121", label: "#FF5252" }, // Siyah & Kırmızı
];

const Create = () => {
  const [step, setStep] = useState<"landing" | "create">("landing");
  const [cassetteCode, setCassetteCode] = useState("");
  
  const [selectedTemplateId, setSelectedTemplateId] = useState(CASSETTE_TEMPLATES[0].id);
  const [bodyColor, setBodyColor] = useState(CASSETTE_TEMPLATES[0].body);
  const [labelColor, setLabelColor] = useState(CASSETTE_TEMPLATES[0].label);
  
  const [cassetteTitle, setCassetteTitle] = useState("");
  const [toName, setToName] = useState("");
  const [fromName, setFromName] = useState("");
  const [message, setMessage] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTemplateSelect = (template: typeof CASSETTE_TEMPLATES[0]) => {
    setSelectedTemplateId(template.id);
    setBodyColor(template.body);
    setLabelColor(template.label);
  };

  const handleCassetteCodeSubmit = () => {
    if (cassetteCode.trim()) {
      navigate(`/play/${cassetteCode}`);
    }
  };

  const handleCreate = async () => {
    if (!toName || !fromName || !message || !youtubeLink) {
      toast({
        title: "Eksik Bilgiler Var",
        description: "Lütfen tüm alanları doldurun.",
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
            title: cassetteTitle || "Mixtape",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Kaset Oluşturuldu!",
        description: "Kasetiniz paylaşmaya hazır.",
      });

      navigate(`/play/${data.id}`);
    } catch (error) {
      console.error("Error creating mixtape:", error);
      toast({
        title: "Hata",
        description: "Kaset oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  if (step === "landing") {
    return (
      <div className="min-h-screen bg-[#f4f4f0] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-[#b4d4d4] selection:text-[#2d4a6d]">
        <div className="absolute inset-0 pointer-events-none opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply" />
        
        <div className="max-w-md w-full space-y-12 z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
          <div className="text-center space-y-4">
            <h1 className="text-8xl font-bold text-[#2d4a6d] tracking-tight drop-shadow-sm" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              Mixtape
            </h1>
            <p className="text-xl text-[#64748b] font-medium tracking-wide" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Müziğini paylaş, anını sakla.
            </p>
          </div>

          <div className="w-full bg-white/80 backdrop-blur-sm rounded-[32px] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-white/50 space-y-6">
            <Button 
              onClick={() => setStep("create")}
              className="w-full py-8 text-2xl bg-[#2d4a6d] hover:bg-[#1e3a5f] text-white rounded-2xl shadow-lg shadow-blue-900/10 transition-all hover:-translate-y-1 font-bold tracking-wide"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
              <Disc className="mr-3 h-7 w-7" />
              KASET OLUŞTUR
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-bold uppercase tracking-widest opacity-60" style={{ fontFamily: "'Nunito', sans-serif" }}>veya</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="flex gap-3">
              <Input 
                placeholder="Kaset kodunu girin..." 
                className="h-14 text-lg bg-white border-none shadow-sm ring-1 ring-slate-100 focus-visible:ring-[#2d4a6d] rounded-2xl px-5 placeholder:text-slate-300 text-[#2d4a6d]"
                style={{ fontFamily: "'Nunito', sans-serif" }}
                value={cassetteCode}
                onChange={(e) => setCassetteCode(e.target.value)}
              />
              <Button 
                onClick={handleCassetteCodeSubmit}
                className="h-14 w-16 rounded-2xl bg-[#ef6b6b] hover:bg-[#d95a5a] text-white shadow-md transition-colors"
              >
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f0] py-8 px-4 font-sans selection:bg-[#b4d4d4] selection:text-[#2d4a6d] overflow-y-auto relative">
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply" />
      
      <div className="fixed top-6 left-6 z-50">
        <Button variant="ghost" size="icon" onClick={() => setStep("landing")} className="bg-white/80 hover:bg-white rounded-full text-[#2d4a6d] shadow-sm backdrop-blur-sm h-10 w-10">
            <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>

      <div className="max-w-2xl mx-auto flex flex-col items-center gap-10 animate-in fade-in duration-700 relative z-10 pb-20">
        
        <div className="relative w-full flex justify-center transform hover:scale-[1.02] transition-transform duration-500 mt-8">
            <div className="absolute inset-0 bg-[#e6c86e]/20 rounded-full blur-3xl opacity-60 transform scale-110 pointer-events-none"></div>
            <CassetteTape 
              bodyColor={bodyColor} 
              labelColor={labelColor} 
              title={cassetteTitle || "Kaset Adı"}
              className="drop-shadow-2xl w-full max-w-[420px]"
            />
        </div>

        <div className="w-full bg-white/60 backdrop-blur-xl rounded-[40px] p-8 md:p-10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] border border-white/60 space-y-10">
          
          {/* ŞABLON SEÇİMİ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center mb-2">
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest" style={{ fontFamily: "'Nunito', sans-serif" }}>Bir Tarz Seç</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {CASSETTE_TEMPLATES.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className={cn(
                            "group relative aspect-[1.6/1] rounded-xl transition-all duration-300 flex flex-col items-center justify-center overflow-hidden",
                            selectedTemplateId === template.id 
                                ? "ring-4 ring-[#2d4a6d] ring-offset-2 shadow-lg scale-105 z-10" 
                                : "hover:scale-105 hover:shadow-md ring-1 ring-slate-200/50 opacity-80 hover:opacity-100"
                        )}
                    >
                        <div className="w-full h-full pointer-events-none transform scale-125">
                           <CassetteTape 
                              bodyColor={template.body} 
                              labelColor={template.label} 
                              className="w-full h-full" 
                              title="" 
                           />
                        </div>
                        
                        {selectedTemplateId === template.id && (
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-[1px]">
                                <div className="bg-[#2d4a6d] text-white p-1.5 rounded-full shadow-lg animate-in zoom-in">
                                  <Check className="w-4 h-4" />
                                </div>
                            </div>
                        )}
                    </button>
                ))}
            </div>
          </div>

          <div className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label className="text-slate-500 font-bold pl-3 text-sm uppercase tracking-wide">Kaset İsmi</Label>
              <Input
                value={cassetteTitle}
                onChange={(e) => setCassetteTitle(e.target.value)}
                className="bg-white border-none shadow-[0_4px_12px_rgba(0,0,0,0.03)] focus-visible:ring-[#2d4a6d] rounded-2xl h-14 text-xl text-[#2d4a6d] font-bold placeholder:text-slate-300 px-5 transition-shadow hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)]"
                style={{ fontFamily: "'Patrick Hand', cursive" }}
                placeholder="Örn: Yol Şarkıları"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-500 font-bold pl-3 text-xs uppercase tracking-wide">Kime</Label>
                <Input
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  className="bg-white border-none shadow-[0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl h-12 text-base text-[#2d4a6d] px-4"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                  placeholder="Alıcı"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-500 font-bold pl-3 text-xs uppercase tracking-wide">Kimden</Label>
                <Input
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="bg-white border-none shadow-[0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl h-12 text-base text-[#2d4a6d] px-4"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                  placeholder="Sen"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-500 font-bold pl-3 text-xs uppercase tracking-wide">Müzik Linki</Label>
              <div className="relative group">
                <Music2 className="absolute left-4 top-3.5 h-5 w-5 text-slate-300 group-hover:text-[#2d4a6d] transition-colors" />
                <Input
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  className="bg-white border-none shadow-[0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl h-12 pl-12 text-base text-[#2d4a6d] transition-shadow hover:shadow-md"
                  style={{ fontFamily: "'Nunito', sans-serif" }}
                  placeholder="YouTube bağlantısını yapıştır..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-500 font-bold pl-3 text-xs uppercase tracking-wide">Notun</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-white border-none shadow-[0_4px_12px_rgba(0,0,0,0.03)] rounded-2xl min-h-[120px] text-lg text-[#2d4a6d] resize-none p-5 leading-relaxed transition-shadow hover:shadow-md"
                style={{ fontFamily: "'Patrick Hand', cursive" }}
                placeholder="İçinden gelenleri buraya yaz..."
              />
            </div>

            <Button
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full py-7 text-2xl bg-[#2d4a6d] hover:bg-[#1e3a5f] text-white rounded-2xl shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-1 active:translate-y-0 font-bold tracking-wide mt-4"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
              {isCreating ? "Hazırlanıyor..." : "KASETİ OLUŞTUR ✨"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Create;