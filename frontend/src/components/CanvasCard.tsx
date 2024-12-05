import { Card } from "flowbite-react";

interface CanvasCardProps {
  // test code
  canvas: {
    _id: string,
    canvasName: string,
    imageUrl: string
  };
}

export const CanvasCard: React.FC<CanvasCardProps> = ({ canvas }) => {
  return (
    <div className="bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 p-px rounded-md">
      <Card
        className="w-full"
        imgAlt={canvas.canvasName}
        imgSrc={canvas.imageUrl}
      >
        <h5 className="text-lg tracking-tight">
          {canvas.canvasName}
        </h5>
      </Card>
    </div>
  )
}
