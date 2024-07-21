import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, LogIn, LogOut, Menu, X, Star} from "lucide-react";
import { toast } from "react-toastify";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    localStorage.removeItem("username");
    navigate("/");
    toast.success("Logout successfully");
  };

  const isLoggedIn = !!localStorage.getItem("token");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const username = localStorage.getItem("username");
  return (
    <nav className="bg-[#FFFFFF] shadow-md border-b border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {isLoggedIn ? (
              <>
                {/* <Star className="h-8 w-8 text-black mr-2" /> */}
                <img src="nlogo.png" alt="" className="w-14" />
                <span className="font-bold text-xl  text-black">
                𝓦𝓮𝓫 𝓢𝓬𝓻𝓪𝓹𝓮𝓻
                </span>
              </>
            ) : (
              <NavLink
                to="/"
                icon={<Star className="h-8 w-8 text-black mr-2" />}
              >
                <span className="font-bold text-xl text-black">
                  Ai Text Summarizer
                </span>
              </NavLink>
            )}
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {isLoggedIn && (
                <>
                  {/* <UserCircle className="h-8 w-8 text-black" /> */}
                  <img src="logomen.png" alt="" className="w-8" />
                  <span className="font-bold text-xl text-black">
                    {username}
                  </span>
                </>
              )}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-black hover:bg-blue-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium flex items-center transition duration-150 ease-in-out"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Logout
                </button>
              ) : (
                <NavLink to="/" icon={<LogIn className="h-5 w-5" />}>
                  Login
                </NavLink>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-black hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink to="/" icon={<Home className="h-5 w-5 mr-1" />}>
              Home
            </MobileNavLink>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-black hover:bg-blue-700 hover:text-black block px-3 py-2 rounded-md text-base font-medium w-full text-left flex items-center"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            ) : (
              <MobileNavLink
                to="/login"
                icon={<LogIn className="h-5 w-5 mr-1" />}
              >
                Login
              </MobileNavLink>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children, icon }) => (
  <Link
    to={to}
    className="text-black hover:bg-blue-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium flex items-center transition duration-150 ease-in-out"
  >
    {icon}
    <span className="ml-1">{children}</span>
  </Link>
);

const MobileNavLink = ({ to, children, icon }) => (
  <Link
    to={to}
    className="text-black hover:bg-blue-700 hover:text-black block px-3 py-2 rounded-md text-base font-medium flex items-center"
  >
    {icon}
    <span className="ml-1">{children}</span>
  </Link>
);

export default Navbar;
