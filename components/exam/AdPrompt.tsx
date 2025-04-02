import { useState } from "react";
import { Button } from "@/components/ui/button";
import YouTube from "react-youtube";

const AdPrompt = ({ paperName, onProceed, adType = "video", videoUrl = "https://www.youtube.com/watch?v=NuI2u_9it4o" }) => {
  const [isVideoEnded, setIsVideoEnded] = useState(false);

  // Extract video ID from URL
  const videoId = videoUrl.includes("v=") ? videoUrl.split("v=")[1].split("&")[0] : videoUrl.split("/").pop();

  const handleVideoEnd = () => {
    setIsVideoEnded(true);
    onProceed(); // Auto-proceed after video ends
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="text-center max-w-3xl w-full">
        <h1 className="text-3xl font-bold mb-4 text-white">{paperName}</h1>
        <p className="text-muted-foreground mb-4 text-white">
          Do not disconnect. You are going to see an ad before the start and at the end.
        </p>
        {adType === "video" && videoUrl ? (
          <div className="mb-6 w-full max-w-2xl mx-auto">
            <YouTube
              videoId={videoId}
              opts={{
                width: "100%",
                height: "400",
                playerVars: {
                  autoplay: 1,
                  mute: 1,
                },
              }}
              onEnd={handleVideoEnd}
              className="w-full"
            />
            {!isVideoEnded && (
              <p className="text-muted-foreground text-white mt-2">
                Please wait for the video to finish...
              </p>
            )}
          </div>
        ) : (
          <div className="mb-6 p-4 bg-muted rounded">
            Ad Space - Coming Soon
            <Button onClick={onProceed} className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
              Continue to Exam
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdPrompt;