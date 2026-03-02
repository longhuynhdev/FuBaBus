import { Link, useLocation } from "@tanstack/react-router";
import { History, KeyRound, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

interface MenuItemProps {
	to: string;
	icon: React.ReactNode;
	label: string;
	isActive?: boolean;
}

function MenuItem({ to, icon, label, isActive }: MenuItemProps) {
	return (
		<div className="cursor-pointer">
			<div
				className={cn(
					"rounded-lg px-3 py-2 hover:bg-orange-50",
					isActive && "bg-orange-100",
				)}
			>
				<Link
					to={to}
					className="flex items-center gap-3 p-2 text-[17px] font-medium text-black no-underline"
				>
					{icon}
					<span>{label}</span>
				</Link>
			</div>
		</div>
	);
}

export function MenuGroup() {
	const { logout } = useAuth();
	const location = useLocation();

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("customerId");
		logout();
		// Navigation will be handled by the parent component or router
		window.location.href = "/";
	};

	const menuItems = [
		{
			to: "/information",
			icon: <User className="w-5 h-5" />,
			label: "Thông tin tài khoản",
		},
		{
			to: "/ticket-purchase-history",
			icon: <History className="w-5 h-5" />,
			label: "Lịch sử mua vé",
		},
		{
			to: "/reset-password",
			icon: <KeyRound className="w-5 h-5" />,
			label: "Đặt lại mật khẩu",
		},
	];

	return (
		<div className="block p-2 border border-gray-300 rounded-2xl">
			{menuItems.map((item) => (
				<MenuItem
					key={item.to}
					to={item.to}
					icon={item.icon}
					label={item.label}
					isActive={location.pathname === item.to}
				/>
			))}

			{/* Logout button */}
			<div className="cursor-pointer">
				<div className="px-3 py-2 rounded-lg hover:bg-orange-50">
					<button
						onClick={handleLogout}
						className="flex w-full items-center gap-3 p-2 text-[17px] font-medium text-black"
					>
						<LogOut className="w-5 h-5" />
						<span>Đăng xuất</span>
					</button>
				</div>
			</div>
		</div>
	);
}
