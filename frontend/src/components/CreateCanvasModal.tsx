import { Modal, Button, TextInput, Label, Alert } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "@/socket/socket";

interface CreateCanvasModalProps {
  isModalOpen: boolean;
  setModalOpen: (isOpen: boolean) => void;
}

export const CreateCanvasModal: React.FC<CreateCanvasModalProps> = ({ isModalOpen, setModalOpen }) => {
  const navigate = useNavigate();

  const [canvasName, setCanvasName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleCreateModal = () => {
    setError(null);
    if (canvasName.trim() === "") {
      setError("Please fill out canvas name.");
      return;
    }
    setCanvasName("");
    setModalOpen(false);
    // Add new room and pass to web socket
    socket.emit("addNewRoom", {
      roomName: canvasName,
      rooURL: `/dashboard/create-canvas?name=${encodeURIComponent(canvasName)}`
    })
    navigate(
      `/dashboard/create-canvas?name=${encodeURIComponent(canvasName)}`
    );
  }

  const handleCloseModal = () => {
    setCanvasName("");
    setError(null);
    setModalOpen(false);
  }

  return (
    <Modal
      show={isModalOpen}
      onClose={() => setModalOpen(false)}
      dismissible
    >
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-white">
            Create a new canvas
          </h3>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="canvas-name" value="Canvas Name" />
            </div>
            <TextInput
              id="canvas-name"
              placeholder="Canvas Name"
              value={canvasName}
              onChange={(e) => setCanvasName(e.target.value)}
              required
            />
          </div>
        </div>
        {error && (
          <Alert className="mt-5" color="failure">
            {error}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleCreateModal}>
          Create
        </Button>
        <Button color="gray" onClick={handleCloseModal}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
