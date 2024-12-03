import { Button } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const CreateCanvas = () => {
  const [searchParams] = useSearchParams();
  const canvasName = searchParams.get("name");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);

  const [lineWidth, setLineWidth] = useState<number>(2);
  const [lineColor, setLineColor] = useState<string>("#000000");
  const [isEraser, setIsEraser] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    // Set fixed internal size
    canvas.width = 800;
    canvas.height = 600;

    // Initialize canvas styles
    ctx.lineCap = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
  }, [lineWidth, lineColor])

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

  const handleChangeWidth = (width: number) => {
    setLineWidth(width);
    setIsEraser(false);
  }

  const toggleEraser = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    setIsEraser(!isEraser);
    ctx.strokeStyle = isEraser ? lineColor : "#FFFFFF"; // Use canvas background color for eraser
  };

  return (
    <div className="flex flex-col items-center p-3">
      <h3 className="text-xl font-semibold my-3">{canvasName}</h3>
      <div className="flex flex-col lg:flex-row-reverse gap-3">
        {/* Selector */}
        <div className="bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 p-px rounded-full">
          <div className="flex flex-row lg:flex-col gap-1 bg-zinc-900 rounded-full w-full h-full py-3 px-5 lg:py-6 lg:px-4">

            {/* Line Width Selector */}
            <Button
              onClick={() => handleChangeWidth(2)}
              className={lineWidth === 2 ? 'bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500' : 'dark:bg-white text-zinc-600'}
            >
              Thin
            </Button>
            <Button
              onClick={() => handleChangeWidth(5)}
              className={lineWidth === 5 ? 'bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500' : 'dark:bg-white text-zinc-600'}
            >
              Medium
            </Button>
            <Button
              onClick={() => handleChangeWidth(10)}
              className={lineWidth === 10 ? 'bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500' : 'dark:bg-white text-zinc-600'}
            >
              Thick
            </Button>

            {/* Line Color Selector */}
            <input
              type="color"
              value={lineColor}
              onChange={(e) => {
                setIsEraser(false); // Disable eraser when color changes
                setLineColor(e.target.value);
              }}
              className="w-10 h-10 rounded border"
            />

            {/* Eraser */}
            <Button
              onClick={toggleEraser}
              className={
                isEraser ? "dark:bg-red-500 text-white" : "dark:bg-gray-200 text-zinc-600"
              }
            >
              {isEraser ? "Eraser On" : "Eraser Off"}
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 p-0.5">
          <canvas
            ref={canvasRef}
            className="w-full max-w-3xl h-auto bg-white cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={drawMouseMove}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
      </div>
    </div>
  )
}
