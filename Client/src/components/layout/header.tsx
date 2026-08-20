import { Link } from "@tanstack/react-router";
import { ChevronDown, History, KeyRound, LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import { revokeSession } from "@/lib/api";

const navLinkClass =
	"px-2 sm:mx-2 sm:w-32 pb-1 sm:pb-3 sm:px-2.5 text-center font-semibold text-xs sm:text-base uppercase text-white hover:font-extrabold hover:text-gray-200";
const navLinkActiveClass = "font-extrabold border-b-4 border-white";

const navLinks = [
	{ to: "/", label: "Trang chủ" },
	{ to: "/schedule", label: "Lịch trình" },
	{ to: "/lookup-ticket", label: "Tra cứu vé" },
	{ to: "/invoice", label: "Hóa đơn" },
];

export function Header() {
	const { isLoggedIn, isEmployee, userName, logout } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleLogout = async () => {
		await revokeSession();
		localStorage.removeItem("customerId");
		logout();
		window.location.href = "/";
	};

	return (
		<header
			className="block bg-orange-500 min-h-[80px] px-4 sm:px-[30px] mx-auto relative z-10"
		>
			{/* ── Mobile top bar: logo left, hamburger right ── */}
			<div className="flex sm:hidden items-center justify-between py-3">
				<Link to="/">
					<img
						src="https://futabus.vn/_next/static/media/logo_new.8a0251b8.svg"
						alt="Logo"
						className="w-[120px] h-auto"
					/>
				</Link>
				<button
					onClick={() => setIsMenuOpen((prev) => !prev)}
					className="text-white p-2"
					aria-label="Toggle menu"
					type="button"
				>
					{isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
				</button>
			</div>

			{/* ── Mobile dropdown: nav links + login ── */}
			{isMenuOpen && (
				<div className="sm:hidden absolute left-0 right-0 z-50 flex flex-col items-stretch bg-orange-500/95 py-2">
					{navLinks.map(({ to, label }) => (
						<Link
							key={to}
							to={to}
							className="px-6 py-3 text-sm font-semibold uppercase text-white hover:bg-white/20"
							activeProps={{ className: "font-extrabold border-l-4 border-white" }}
							onClick={() => setIsMenuOpen(false)}
						>
							{label}
						</Link>
					))}
					<div className="border-t border-white/30 mt-1 pt-1">
						{isLoggedIn ? (
							<>
								{isEmployee && (
									<Link
										to="/dashboard"
										className="flex items-center px-6 py-3 gap-2 text-sm text-white hover:bg-white/20"
										onClick={() => setIsMenuOpen(false)}
									>
										<LayoutDashboard className="w-4 h-4" />
										<span>Dashboard</span>
									</Link>
								)}
								<Link
									to="/information"
									className="flex items-center px-6 py-3 gap-2 text-sm text-white hover:bg-white/20"
									onClick={() => setIsMenuOpen(false)}
								>
									<User className="w-4 h-4" />
									<span>{userName}</span>
								</Link>
								<Link
									to="/ticket-purchase-history"
									className="flex items-center px-6 py-3 gap-2 text-sm text-white hover:bg-white/20"
									onClick={() => setIsMenuOpen(false)}
								>
									<History className="w-4 h-4" />
									<span>Lịch sử mua vé</span>
								</Link>
								<Link
									to="/reset-password"
									className="flex items-center px-6 py-3 gap-2 text-sm text-white hover:bg-white/20"
									onClick={() => setIsMenuOpen(false)}
								>
									<KeyRound className="w-4 h-4" />
									<span>Đặt lại mật khẩu</span>
								</Link>
								<button
									onClick={() => { handleLogout(); setIsMenuOpen(false); }}
									className="flex items-center w-full px-6 py-3 gap-2 text-sm text-white hover:bg-white/20"
									type="button"
								>
									<LogOut className="w-4 h-4" />
									<span>Đăng xuất</span>
								</button>
							</>
						) : (
							<div className="flex items-center px-6 py-3 gap-3 text-sm text-white font-semibold">
								<User className="w-4 h-4" />
								<Link to="/login" className="hover:underline" onClick={() => setIsMenuOpen(false)}>Đăng nhập</Link>
								<span>/</span>
								<Link to="/register" className="hover:underline" onClick={() => setIsMenuOpen(false)}>Đăng ký</Link>
							</div>
						)}
					</div>
				</div>
			)}

			{/* ── Desktop top bar: 3-column grid keeps logo centered ── */}
			<div className="hidden sm:grid grid-cols-3 items-center h-20 px-16">
				<div />
				<div className="flex justify-center">
					<Link to="/">
						<img
							src="https://futabus.vn/_next/static/media/logo_new.8a0251b8.svg"
							alt="Logo"
							className="w-[295px] h-auto mb-6"
						/>
					</Link>
				</div>
				<div className="flex justify-end">
					{isLoggedIn ? (
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center h-8 outline-none cursor-pointer gap-4">
								<User className="w-8 h-full text-white" />
								<span className="font-medium text-white">{userName}</span>
								<ChevronDown className="w-4 h-4 text-white" />
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="min-w-[200px] bg-white">
								{isEmployee && (
									<DropdownMenuItem asChild>
										<Link to="/dashboard" className="flex items-center p-2 cursor-pointer gap-2">
											<LayoutDashboard className="w-4 h-4" />
											<span>Dashboard</span>
										</Link>
									</DropdownMenuItem>
								)}
								<DropdownMenuItem asChild>
									<Link to="/information" className="flex items-center p-2 cursor-pointer gap-2">
										<User className="w-4 h-4" />
										<span>Thông tin tài khoản</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link to="/ticket-purchase-history" className="flex items-center p-2 cursor-pointer gap-2">
										<History className="w-4 h-4" />
										<span>Lịch sử mua vé</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem asChild>
									<Link to="/reset-password" className="flex items-center p-2 cursor-pointer gap-2">
										<KeyRound className="w-4 h-4" />
										<span>Đặt lại mật khẩu</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem onClick={handleLogout} className="flex items-center p-2 cursor-pointer gap-2">
									<LogOut className="w-4 h-4" />
									<span>Đăng xuất</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<div className="flex items-center h-8 px-2 text-black bg-white gap-3 rounded-2xl whitespace-nowrap text-sm font-extrabold">
							<User className="w-5 h-5" />
							<Link to="/login" className="text-black hover:text-blue-500">Đăng nhập</Link>
							<span>/</span>
							<Link to="/register" className="text-black hover:text-blue-500">Đăng ký</Link>
						</div>
					)}
				</div>
			</div>

			{/* ── Desktop nav — single row, no wrap ── */}
			<nav className="hidden sm:flex flex-nowrap justify-around items-center px-[100px]">
				{navLinks.map(({ to, label }) => (
					<Link
						key={to}
						to={to}
						className={navLinkClass}
						activeProps={{ className: navLinkActiveClass }}
					>
						{label}
					</Link>
				))}
			</nav>
		</header>
	);
}
