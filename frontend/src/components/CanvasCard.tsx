import { Card } from "flowbite-react";

interface CanvasCardProps {
  canvas: {
    _id: string,
    canvasName: string,
    canvasURL: string
  };
}

export const CanvasCard: React.FC<CanvasCardProps> = ({ canvas }) => {
  return (
    <div className="bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 p-px rounded-md">
      <Card
        className="w-full"
      >
        <div className="w-full bg-white">
          <img
            className="rounded-md"
            src={canvas.canvasURL}
            alt={canvas.canvasName}
          />
        </div>
        <h5 className="text-lg tracking-tight">
          {canvas.canvasName}
        </h5>
      </Card>
    </div>
  )
}
