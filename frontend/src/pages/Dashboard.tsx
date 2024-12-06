import { CanvasCard } from "@/components/CanvasCard";
import { useCanvasHistoryContext } from "@/context/CanvasHistoryContext";
import { useUserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { socket } from "@/socket/socket";

export const Dashboard = () => {
  const { user } = useUserContext();
  const { canvasHistory, setCanvasHistory } = useCanvasHistoryContext();

  const [rooms, setRooms] = useState<Array<{
    roomName: string;
    roomURL: string;
  }>>([]);

  useEffect(() => {
    socket.on("newRoom", (data) => {
      setRooms((prevRooms) => [...prevRooms, data]);
    })
    return () => {
      socket.off("newRoom");
    };
  }, []);

  useEffect(() => {
    const fetchCanvasHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/canvas/history`, {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          credentials: "include",
          body: JSON.stringify({ email: user?.email }),
        });
        const data = await res.json();
        if (data.success) {
          setCanvasHistory(data.history);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchCanvasHistory();
  }, [user, setCanvasHistory]);

  return (
    <div className="flex flex-col space-y-4 p-3">
      <div className="">
        <h3 className="text-xl text-left font-semibold pl-3 my-4">Active Rooms</h3>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {rooms ?
            <>
              {rooms.map((room, index) => (
                <a href={`http://localhost:5173/dashboard/create-canvas?name=${room.roomName}`} key={index} className="border border-zinc-400">
                  {room.roomName}
                </a>
              ))}
            </>
          :
            <p className="text-red-500 text-xl font-semibold text-center">
              No Active Room
            </p>
          }
        </div>
      </div>
      <div className="">
        <h3 className="text-xl text-left font-semibold pl-3 my-4">Your Canvas</h3>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {canvasHistory ?
            <>
              {canvasHistory.map((canvas, index) => (
                <CanvasCard key={index} canvas={canvas} />
            ))}
            </>
          :
            <p className="text-red-500 text-xl font-semibold text-center">
              No Canvas History
            </p>
          }
        </div>
      </div>
    </div>
  )
}
