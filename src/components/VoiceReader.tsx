"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  Languages,
  Gauge,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VoiceReaderProps {
  text: string;
  options?: string[];
  questionId?: number;
}

const SPEECH_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

const LANGUAGES: { code: string; name: string; voiceName?: string }[] = [
  { code: "en-US", name: "English (US)" },
  { code: "en-GB", name: "English (UK)" },
  { code: "hi-IN", name: "Hindi" },
  { code: "es-ES", name: "Spanish" },
  { code: "fr-FR", name: "French" },
  { code: "de-DE", name: "German" },
];

export default function VoiceReader({ text, options, questionId }: VoiceReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [language, setLanguage] = useState("en-US");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>();
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load voices when available
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Auto-select best voice for current language
      const preferredVoice = availableVoices.find(
        (v) => v.lang.startsWith(language) && v.localService
      );
      if (preferredVoice) {
        setSelectedVoice(preferredVoice.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [language]);

  // Load saved preferences
  useEffect(() => {
    const savedRate = localStorage.getItem("voice-rate");
    const savedLanguage = localStorage.getItem("voice-language");
    const savedVoice = localStorage.getItem("voice-name");

    if (savedRate) setRate(parseFloat(savedRate));
    if (savedLanguage) setLanguage(savedLanguage);
    if (savedVoice) setSelectedVoice(savedVoice);
  }, []);

  // Save preferences when changed
  useEffect(() => {
    localStorage.setItem("voice-rate", rate.toString());
    localStorage.setItem("voice-language", language);
    if (selectedVoice) {
      localStorage.setItem("voice-name", selectedVoice);
    }
  }, [rate, language, selectedVoice]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = useCallback(() => {
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not supported");
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Build full text
    let fullText = text;
    if (options && options.length > 0) {
      fullText = `${text}. Options: ${options
        .map((opt, i) => `${String.fromCharCode(65 + i)}, ${opt}`)
        .join(". ")}`;
    }

    const utterance = new SpeechSynthesisUtterance(fullText);

    // Add pause between question and options
    const questionPart = text;
    utterance.text = questionPart;

    // Configure voice
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.lang = language;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      setIsPlaying(false);
      setIsPaused(false);
    };

    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [text, options, rate, language, voices, selectedVoice]);

  const pause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const handlePlayPause = () => {
    if (isPlaying && !isPaused) {
      pause();
    } else if (isPlaying && isPaused) {
      resume();
    } else {
      speak();
    }
  };

  const handleStop = () => {
    stop();
  };

  const handleRateChange = (newRate: string) => {
    const rateValue = parseFloat(newRate);
    setRate(rateValue);
    if (isPlaying) {
      // Restart with new rate
      speak();
    }
  };

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode);
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith(langCode) && v.localService
    );
    if (preferredVoice) {
      setSelectedVoice(preferredVoice.name);
    }
  };

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
  };

  // Filter voices for current language
  const filteredVoices = voices.filter((v) => v.lang.startsWith(language));

  return (
    <div className="inline-flex items-center gap-2 flex-wrap">
      {/* Main Play/Pause Button */}
      <Button
        variant={isPlaying ? "secondary" : "outline"}
        size="sm"
        onClick={handlePlayPause}
        className={isPlaying ? "bg-primary/10" : ""}
      >
        {isPlaying && !isPaused ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>

      {/* Stop Button */}
      {isPlaying && (
        <Button variant="ghost" size="sm" onClick={handleStop}>
          <VolumeX className="h-4 w-4" />
        </Button>
      )}

      {/* Speed Control */}
      <Select value={rate.toString()} onValueChange={handleRateChange}>
        <SelectTrigger className="w-[70px] h-8">
          <Gauge className="h-3 w-3 mr-1" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SPEECH_RATES.map((r) => (
            <SelectItem key={r} value={r.toString()}>
              {r}x
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Language Selection */}
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[140px] h-8">
          <Languages className="h-3 w-3 mr-1" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Voice Selection (if multiple voices available) */}
      {filteredVoices.length > 1 && (
        <Select value={selectedVoice} onValueChange={handleVoiceChange}>
          <SelectTrigger className="w-[180px] h-8">
            <Volume2 className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Select voice" />
          </SelectTrigger>
          <SelectContent>
            {filteredVoices.map((voice) => (
              <SelectItem key={voice.name} value={voice.name}>
                {voice.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
