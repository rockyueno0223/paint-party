import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const CreateCanvas = () => {
  const [searchParams] = useSearchParams();
  const canvasName = searchParams.get("name");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Set fixed internal resolution
    canvas.width = 800; // Internal width
    canvas.height = 600; // Internal height

    // Initialize canvas styles
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";
  }, []);

  const draw = (
    ctx: CanvasRenderingContext2D,
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0); // Start at the previous position
    ctx.lineTo(x1, y1); // Draw a line to the new position
    ctx.stroke();
  };

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width; // Horizontal scaling
    const scaleY = canvas.height / rect.height; // Vertical scaling

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setLastPosition({ x, y }); // Set starting position
    setIsDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPosition(null); // Reset last position
  };

  const drawMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext("2d")!;

    if (lastPosition) {
      draw(ctx, lastPosition.x, lastPosition.y, x, y); // Draw from last position to current position
    }

    setLastPosition({ x, y }); // Update the last position
  };

  return (
    <div className="flex flex-col items-center p-3">
      <h3 className="text-xl font-semibold my-3">{canvasName}</h3>
      <div className="bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 p-0.5">
        <canvas
          ref={canvasRef}
          className="w-full max-w-2xl h-auto bg-white cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={drawMouseMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  )
}
