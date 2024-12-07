import { Navbar } from "flowbite-react";
import { Link } from "react-router-dom";
import type { CustomFlowbiteTheme } from "flowbite-react";
import { useState } from "react";
import { CreateCanvasModal } from "@/components/CreateCanvasModal";
import { useUserContext } from "@/context/UserContext";

const customTheme: CustomFlowbiteTheme["navbar"] = {
  "toggle": {
    base: "bg-transparent rounded-lg border-2 border-transparent focus:border-white p-1 md:hidden",
  }
};

export const Header = () => {
  const { user } = useUserContext();

  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        // Logout action
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  return (
    <>
      <Navbar className="text-white bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 md:py-4" theme={customTheme}>
        <Link to="/" className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold">
          <span className="px-2 py-1 rounded-lg">
            Paint Party
          </span>
        </Link>
        <Navbar.Toggle />

        <Navbar.Collapse>
          {user ?
            <>
              <Navbar.Link as={'div'}>
                <Link to="/dashboard" className="text-white">Dashboard</Link>
              </Navbar.Link>
              <Navbar.Link as={'div'}>
                <span
                  onClick={() => setModalOpen(true)}
                  className="text-white cursor-pointer"
                >
                  Create Modal
                </span>
              </Navbar.Link>
              <Navbar.Link as={'div'}>
                <span
                  onClick={handleSignout}
                  className="text-white cursor-pointer"
                >
                  Sign Out
                </span>
              </Navbar.Link>
            </>
            :
            <>
              <Navbar.Link as={'div'}>
                <Link to="/signin" className="text-white">Sign In</Link>
              </Navbar.Link>
              <Navbar.Link as={'div'}>
                <Link to="/signup" className="text-white">Sign Up</Link>
              </Navbar.Link>
            </>
          }
        </Navbar.Collapse>
      </Navbar>

      <CreateCanvasModal isModalOpen={isModalOpen} setModalOpen={setModalOpen} />
    </>
  )
}
