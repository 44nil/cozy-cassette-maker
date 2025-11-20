import { useState } from "react";
import { CassetteTape } from "@/components/CassetteTape";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Disc, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Ekran görüntüsündeki renk paletlerine benzer renkler
const BODY_COLORS = [
  "#2d4a6d", // Lacivert
  "#2d6d5b", // Yeşil
  "#c93838", // Kırmızı
  "#2d2d2d", // Siyah
  "#4a3b2d", // Kahve
  "#D4A574", // Orijinal
];

const LABEL_COLORS = [
  "#F5E6D3", // Krem
  "#b4d4d4", // Açık Mavi
  "#e6c86e", // Sarı
  "#ffffff", // Beyaz
  "#e6a66e", // Turuncu
];

const Create = () => {
  const [step, setStep] = useState<"landing" | "create">("landing");
  const [cassetteCode, setCassetteCode] = useState("");
  
  const [bodyColor, setBodyColor] = useState(BODY_COLORS[0]);
  const [labelColor, setLabelColor] = useState(LABEL_COLORS[0]);
  const [cassetteTitle, setCassetteTitle] = useState("");
  const [toName, setToName] = useState("");
  const [fromName, setFromName] = useState("");
  const [message, setMessage] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

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

  // --- LANDING SAYFASI TASARIMI (Resim 1) ---
  if (step === "landing") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden font-handwriting">
        {/* Düzeltilen Satır: opacity-10 kaldırıldı, sadece opacity-5 bırakıldı */}
        <div className="absolute inset-0 pointer-events-none bg-[url('/placeholder.svg')] bg-repeat opacity-5" />
        
        <div className="max-w-md w-full space-y-12 z-10">
          <div className="text-center space-y-2">
            <h1 className="text-7xl font-bold text-primary tracking-wider" style={{ fontFamily: "'Covered By Your Grace', cursive" }}>
              MIXTAPE FOR YOU
            </h1>
            <p className="text-2xl text-muted-foreground font-handwriting">
              Sevdiğinize mavi bir anı bırakın.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border-4 border-white space-y-8">
            <Button 
              onClick={() => setStep("create")}
              className="w-full py-8 text-2xl bg-[#4a6fa5] hover:bg-[#3b5c8d] text-white rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Disc className="mr-2 h-6 w-6" />
              KASET OLUŞTUR
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-primary/20"></div>
              <span className="flex-shrink-0 mx-4 text-primary/60 text-lg">VEYA</span>
              <div className="flex-grow border-t border-primary/20"></div>
            </div>

            <div className="flex gap-2">
              <Input 
                placeholder="Kaset Kodunu Girin" 
                className="h-14 text-xl bg-secondary/30 border-2 border-transparent focus:border-primary/50 rounded-xl px-4 placeholder:text-primary/40"
                value={cassetteCode}
                onChange={(e) => setCassetteCode(e.target.value)}
              />
              <Button 
                onClick={handleCassetteCodeSubmit}
                className="h-14 w-14 rounded-xl bg-[#ef6b6b] hover:bg-[#d95a5a]"
              >
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Alt kısımdaki dekoratif kaset */}
          <div className="transform scale-75 opacity-80 hover:opacity-100 transition-opacity duration-500">
             <CassetteTape bodyColor="#2d4a6d" labelColor="#F5E6D3" />
          </div>
        </div>
      </div>
    );
  }

  // --- OLUŞTURMA SAYFASI TASARIMI (Resim 2) ---
  return (
    <div className="min-h-screen flex p-4 md:p-8 gap-8 font-handwriting">
      {/* SOL PANEL - DÜZENLEME */}
      <div className="w-full md:w-1/2 lg:w-5/12 flex flex-col h-[calc(100vh-4rem)]">
        <div className="bg-white/90 backdrop-blur rounded-[2rem] p-8 shadow-xl border-4 border-white overflow-y-auto scrollbar-hide h-full">
          
          <h2 className="text-4xl font-bold text-primary mb-6" style={{ fontFamily: "'Covered By Your Grace', cursive" }}>
            KASETİ ÖZELLEŞTİR
          </h2>

          <div className="space-y-8">
            {/* Renk Seçimi */}
            <div className="space-y-3">
              <Label className="text-xl text-primary/80">GÖVDE RENGİ</Label>
              <div className="flex gap-3 flex-wrap">
                {BODY_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setBodyColor(color)}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110",
                      bodyColor === color && "ring-2 ring-primary ring-offset-2 scale-110"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xl text-primary/80">ETİKET RENGİ</Label>
              <div className="flex gap-3 flex-wrap">
                {LABEL_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setLabelColor(color)}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 border-primary/10 shadow-md transition-transform hover:scale-110",
                      labelColor === color && "ring-2 ring-primary ring-offset-2 scale-110"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Kaset Başlığı */}
            <div className="space-y-2">
              <Label className="text-xl text-primary/80">KASET ADI</Label>
              <Input
                value={cassetteTitle}
                onChange={(e) => setCassetteTitle(e.target.value)}
                className="bg-transparent border-b-2 border-primary/20 border-t-0 border-x-0 rounded-none px-0 text-2xl focus-visible:ring-0 focus-visible:border-primary font-bold placeholder:font-normal"
                placeholder="Örn: Yol Şarkıları"
              />
            </div>

            <div className="h-px bg-primary/10 w-full my-6" />

            <h2 className="text-4xl font-bold text-primary mb-4" style={{ fontFamily: "'Covered By Your Grace', cursive" }}>
              İÇERİK
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-lg">KİME</Label>
                <Input
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  className="bg-white border-2 border-primary/10 rounded-xl h-12 text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-lg">KİMDEN</Label>
                <Input
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  className="bg-white border-2 border-primary/10 rounded-xl h-12 text-lg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-lg">YOUTUBE BAĞLANTISI</Label>
              <div className="relative">
                <Music2 className="absolute left-3 top-3 h-5 w-5 text-primary/40" />
                <Input
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  className="bg-white border-2 border-primary/10 rounded-xl h-12 pl-10 text-base font-sans"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-lg">MESAJ</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-white border-2 border-primary/10 rounded-xl min-h-[120px] text-xl resize-none p-4 leading-relaxed"
                placeholder="İçinden gelenleri yaz..."
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button 
                variant="ghost" 
                onClick={() => setStep("landing")}
                className="text-lg text-muted-foreground hover:text-primary"
              >
                GERİ
              </Button>
              <Button
                onClick={handleCreate}
                disabled={isCreating}
                className="flex-1 py-6 text-xl bg-[#2d4a6d] hover:bg-[#1f344f] text-white rounded-xl shadow-lg"
              >
                {isCreating ? "OLUŞTURULUYOR..." : "KASETİ OLUŞTUR"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* SAĞ PANEL - ÖNİZLEME */}
      <div className="hidden md:flex w-1/2 lg:w-7/12 items-center justify-center relative">
        <div className="border-2 border-white/50 rounded-3xl p-12 w-full max-w-2xl bg-white/20 backdrop-blur-sm shadow-2xl relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white/30 px-6 py-1 rounded-full text-white text-sm font-sans">
            Önizleme
          </div>
          
          <div className="transform hover:scale-105 transition-transform duration-500">
            <CassetteTape 
              bodyColor={bodyColor} 
              labelColor={labelColor} 
              // Not: CassetteTape bileşenin 'title' prop'u kabul etmesi gerekebilir.
              // Eğer CassetteTape bileşenini güncellemezseniz bu prop çalışmaz.
              // className="drop-shadow-2xl"
            />
            {/* Kaset üzerine yazı yazdırmak için basit bir overlay (eğer SVG desteklemiyorsa) */}
            <div className="absolute top-[58%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] text-center pointer-events-none">
              <p className="text-2xl font-bold text-primary/80 truncate" style={{ fontFamily: "'Rock Salt', cursive" }}>
                {cassetteTitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;