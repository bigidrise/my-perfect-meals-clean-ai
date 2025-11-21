import { useState, useRef } from "react";

export const useMicRecorder = () => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const start = async (): Promise<Blob> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;

      const chunks: Blob[] = [];

      return new Promise<Blob>((resolve, reject) => {
        mr.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunks.push(e.data);
          }
        };

        mr.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          resolve(blob);
        };

        mr.onerror = (error) => {
          reject(error);
        };

        mr.start();
        setRecording(true);
      });
    } catch (err) {
      setRecording(false);
      throw err;
    }
  };

  const stop = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    // Clean up media stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Clear references
    mediaRecorderRef.current = null;
    setRecording(false);
  };

  return { start, stop, recording };
};
