import { Button } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaRegCircle } from "react-icons/fa";
import { RiEraserLine } from "react-icons/ri";
import { ToastComponent } from "@/components/ToastComponent";
import { socket } from "@/socket/socket";
import { useUserContext } from "@/context/UserContext";
import { createSlug } from "@/utils/createSlug";

interface Drawing {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
  width: number;
};

export const CreateCanvas = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const canvasName = searchParams.get("name");
  const creatorName = searchParams.get("creator");
  const { user } = useUserContext();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null);

  const [lineWidth, setLineWidth] = useState<number>(2);
  const [lineColor, setLineColor] = useState<string>("#000000");
  const [isEraser, setIsEraser] = useState<boolean>(false);

  const [showToast, setShowToast] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const usernameSlug = createSlug(user?.username || "Unknown User");

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

    // Load existing canvas data
    socket.on('load canvas', (drawings: Drawing[]) => {
        drawings.forEach(({ x0, y0, x1, y1, color, width }) => {
            draw(ctx, x0, y0, x1, y1, color, width);
        });
    });

    // Listen for drawing events from the server
    socket.on("drawing", ({ x0, y0, x1, y1, color, width }) => {
      draw(ctx, x0, y0, x1, y1, color, width);
    });

    return () => {
      socket.off('load canvas');
      socket.off("drawing");
    };
  }, []);

  useEffect(() => {
    // Listen for joining room
    socket.emit("join room", {
      room: canvasName,
      userName: user?.username
    });
    return () => {
      socket.emit('leave room', { room: canvasName, userName: user?.username });
    }
  }, [user, canvasName])

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
    y1: number,
    color: string,
    width: number
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
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
      const currentColor = isEraser ? "#FFFFFF" : lineColor;
      draw(ctx, lastPosition.x, lastPosition.y, x, y, currentColor, lineWidth); // Draw from last position to current position

      // Emit the drawing event to the server
      socket.emit("drawing", {
        room: canvasName,
        x0: lastPosition.x,
        y0: lastPosition.y,
        x1: x,
        y1: y,
        color: isEraser ? "#FFFFFF" : lineColor,
        width: lineWidth,
      });
    }

    setLastPosition({ x, y }); // Update the last position
  };

  const handleChangeWidth = (width: number) => {
    setLineWidth(width);
    setIsEraser(false);
  }

  const handleCreateCanvas = async () => {
    const canvas = canvasRef.current!;
    if (!canvas) {
      setShowToast(true);
      setIsSuccess(false);
      setToastMessage("Cannot get canvas data.");

      setTimeout(() => {
        setShowToast(false);
        return;
      }, 3000);
    }

    // Convert the canvas to a Base64 image URL
    const imageDataURL = canvas.toDataURL("image/png");

    const canvasData = {
      canvasName,
      imageUrl: imageDataURL,
      email: user?.email,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/canvas/save`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify(canvasData),
      });
      const data = await res.json();
      if (data.success) {
        setShowToast(true);
        setIsSuccess(true);
        setToastMessage("Canvas saved successfully.");

        setTimeout(() => {
          setShowToast(false);
          setIsSuccess(null);
          setToastMessage(null);
          navigate("/dashboard");
        }, 3000);
      } else {
        console.error(data.message);
        setShowToast(true);
        setIsSuccess(false);
        setToastMessage(data.message);

        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setShowToast(true);
      setIsSuccess(false);
      setToastMessage("Something went wrong. Please try again.");

      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  }

  return (
    <div className="flex flex-col items-center p-3">
      <h3 className="text-xl font-semibold my-3">{canvasName}</h3>
      <div className="flex flex-col lg:flex-row-reverse gap-3">
        {/* Selector */}
        <div className="bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 p-px rounded-full">
          <div className="flex flex-row lg:flex-col justify-between lg:justify-start items-center gap-4 bg-zinc-900 rounded-full w-full h-full py-3 px-5 lg:py-6 lg:px-4">

            <div className="flex flex-row lg:flex-col items-center gap-2">
              <FaPen className="me-2 mb-0 lg:me-0 lg:mb-2" />

              {/* Line Width Selector */}
              <Button
                onClick={() => handleChangeWidth(2)}
                className={`flex items-center h-full lg:h-auto ${lineWidth === 2 ? 'bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500' : 'dark:bg-white text-zinc-600'}`}
              >
                <FaRegCircle
                  size={8}
                  color={lineWidth === 2 ? "#fff" : "#000"}
                />
              </Button>
              <Button
                onClick={() => handleChangeWidth(5)}
                className={`flex items-center ${lineWidth === 5 ? 'bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500' : 'dark:bg-white text-zinc-600'}`}
              >
                <FaRegCircle
                  size={10}
                  color={lineWidth === 5 ? "#fff" : "#000"}
                />
              </Button>
              <Button
                onClick={() => handleChangeWidth(10)}
                className={`flex items-center ${lineWidth === 10 ? 'bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500' : 'dark:bg-white text-zinc-600'}`}
              >
                <FaRegCircle
                  size={12}
                  color={lineWidth === 10 ? "#fff" : "#000"}
                />
              </Button>

              {/* Line Color Selector */}
              <input
                type="color"
                value={lineColor}
                onChange={(e) => {
                  setIsEraser(false); // Disable eraser when color changes
                  setLineColor(e.target.value);
                }}
                className="w-9 h-9 lg:w-11 lg:h-11 rounded border"
              />
            </div>

            {/* Eraser */}
            <Button
              onClick={() => setIsEraser(!isEraser)}
              className={`flex items-center ${
                isEraser ? "dark:bg-red-500 text-white" : "dark:bg-gray-200 text-zinc-600"
              }`}
            >
              <RiEraserLine />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
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
          {/* Buttons */}
          <div className="flex flex-col gap-3">
            {usernameSlug === creatorName && (
              <Button onClick={handleCreateCanvas} className="w-full bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500">
                Save Canvas
              </Button>
            )}
            <Button
              color="gray"
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
      {showToast && isSuccess !== null && toastMessage && (
        <div className="fixed bottom-5 right-5 z-50">
          <ToastComponent isSuccess={isSuccess} message={toastMessage} />
        </div>
      )}
    </div>
  )
}
