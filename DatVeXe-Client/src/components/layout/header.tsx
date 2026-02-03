import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/auth-context";
import { User, ChevronDown, History, KeyRound, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinkClass =
  "mx-2 w-32 pb-3 px-2.5 text-center font-semibold text-base uppercase text-white hover:font-extrabold hover:text-gray-200";
const navLinkActiveClass = "font-extrabold border-b-4 border-white";

export function Header() {
  const { isLoggedIn, logout } = useAuth();
  const [userName] = useState("User"); // Will be fetched via API later

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("customerId");
    logout();
    window.location.href = "/";
  };

  return (
    <header
      className="block bg-cover min-h-[180px] h-[220px] px-[30px] mx-auto relative"
      style={{
        backgroundImage:
          "url('https://futabus.vn/images/banners/home_banner.png')",
      }}
    >
      {/* Top navigation */}
      <div className="flex h-20 justify-end px-[100px]">
        {/* Logo */}
        <div className="mx-20 z-10">
          <Link to="/">
            <img
              src="https://futabus.vn/_next/static/media/logo_new.8a0251b8.svg"
              alt="Logo"
              className="block w-[295px] h-auto mb-6 max-w-full"
            />
          </Link>
        </div>

        {/* Login section */}
        <div className="flex justify-end flex-grow-[0.5] flex-shrink flex-basis-0 mt-4">
          <div className="flex text-center font-extrabold text-sm leading-5 gap-4 items-start">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-4 h-8 cursor-pointer outline-none">
                  <User className="w-8 h-full text-white" />
                  <span className="text-white font-medium">{userName}</span>
                  <ChevronDown className="w-4 h-4 text-white" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-[200px] bg-white"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      to="/information"
                      className="flex items-center gap-2 p-2 cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      <span>Thong tin tai khoan</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/ticket-purchase-history"
                      className="flex items-center gap-2 p-2 cursor-pointer"
                    >
                      <History className="w-4 h-4" />
                      <span>Lich su mua ve</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/reset-password"
                      className="flex items-center gap-2 p-2 cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>Dat lai mat khau</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 p-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Dang xuat</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center w-52 h-8 px-2 gap-3 bg-white rounded-2xl text-black">
                <User className="w-5 h-5" />
                <Link to="/login" className="text-black hover:text-blue-500">
                  Đăng nhập
                </Link>
                <span>/</span>
                <Link to="/register" className="text-black hover:text-blue-500">
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex justify-around items-center px-[100px]">
        <Link to="/" className={navLinkClass} activeProps={{ className: navLinkActiveClass }}>
          Trang chủ
        </Link>
        <Link to="/schedule" className={navLinkClass} activeProps={{ className: navLinkActiveClass }}>
          Lịch trình
        </Link>
        <Link to="/lookup-ticket" className={navLinkClass} activeProps={{ className: navLinkActiveClass }}>
          Tra cứu vé
        </Link>
        <Link to="/invoice" className={navLinkClass} activeProps={{ className: navLinkActiveClass }}>
          Hóa đơn
        </Link>
      </nav>
    </header>
  );
}
