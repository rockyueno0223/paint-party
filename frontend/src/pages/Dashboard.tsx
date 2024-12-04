import { CanvasCard } from "@/components/CanvasCard";

export const Dashboard = () => {

  // test code
  const canvases = [
    {
      _id: "1",
      canvasName: "Fluffy cat",
      imageUrl: "https://www.tomboweurope.com/fileadmin/Content/article/2201_Drawing_Templates/2211_Drawing_Template_Cat_Outlines.jpg"
    }
  ];

  return (
    <div className="flex flex-col space-y-4 p-3">
      <div className="">
        <h3 className="text-xl text-left font-semibold pl-3 my-4">Your Canvas</h3>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {canvases.map((canvas, index) => (
            <CanvasCard key={index} canvas={canvas} />
          ))}
        </div>
      </div>
    </div>
  )
}
