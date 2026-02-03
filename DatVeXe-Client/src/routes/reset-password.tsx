import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { MenuGroup } from "@/components/user/menu-group";

export const Route = createFileRoute("/reset-password")({
	component: ResetPasswordPage,
});

function ResetPasswordPage() {
	return (
		<div className="min-h-screen">
			<Header />
			<main className="max-w-[1128px] mx-auto px-4 -mt-20 relative">
				<div className="flex gap-6 bg-white rounded-2xl border border-gray-200 p-6">
					<div className="w-[280px] flex-shrink-0">
						<MenuGroup />
					</div>
					<div className="flex-1">
						<h1 className="text-2xl font-medium text-gray-900 mb-2">
							Đặt lại mật khẩu
						</h1>
						<p className="text-base text-gray-700/80">
							Thay đổi mật khẩu để bảo mật tài khoản
						</p>
						<div className="mt-6 p-6 rounded-2xl border border-gray-300 text-center text-muted-foreground">
							Chức năng đang được phát triển
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
