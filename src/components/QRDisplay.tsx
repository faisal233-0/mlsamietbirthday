import { QRCodeSVG } from "qrcode.react";

interface QRDisplayProps {
  url: string;
  roomCode: string;
}

export function QRDisplay({ url, roomCode }: QRDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="bg-white p-3 rounded-2xl shadow-xl glow-primary">
        <QRCodeSVG
          value={url}
          size={160}
          bgColor="#ffffff"
          fgColor="#0a0a1a"
          level="M"
        />
      </div>
      <div className="text-center">
        <p className="text-muted-foreground text-sm">Room Code</p>
        <p className="text-4xl tracking-[0.3em] font-bold text-gradient-primary">
          {roomCode}
        </p>
      </div>
    </div>
  );
}
