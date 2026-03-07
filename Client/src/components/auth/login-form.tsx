import { useNavigate } from "@tanstack/react-router";
import { Lock, Phone } from "lucide-react";
import { type FormEvent, useState } from "react";
import logoWithTextIcon from "@/assets/logoText.svg";
import TVCIcon from "@/assets/TVC.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

interface LoginFormData {
	phone: string;
	password: string;
}

export function LoginForm() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [formData, setFormData] = useState<LoginFormData>({
		phone: "",
		password: "",
	});

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		try {
			const response = await apiFetch("/api/auth/login", {
				method: "POST",
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				const data = await response.json();
				localStorage.setItem("accessToken", data.accessToken);
				localStorage.setItem("customerId", data.customerId);
				login(data.role ?? "USER");
				navigate({ to: "/" });
			} else {
				toast.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
			}
		} catch (error) {
			console.error("Login error:", error);
			toast.error("Có lỗi xảy ra khi đăng nhập.");
		}
	};

	return (
		<div className="flex flex-row max-w-[1128px] h-[471px] mx-auto rounded-2xl border border-orange-500/60 outline outline-6 outline-orange-900/5 overflow-hidden bg-white">
			{/* Banner section - Left side */}
			<div className="flex-col flex-1 hidden p-8 md:flex">
				<img
					src={logoWithTextIcon}
					alt="Logo"
					className="h-[77px] w-[366px] object-contain"
				/>
				<div className="flex items-start justify-start flex-1">
					<img
						src={TVCIcon}
						alt="Banner"
						className="max-w-[500px] w-full object-contain"
					/>
				</div>
			</div>

			{/* Form section - Right side */}
			<div className="flex flex-col justify-center items-center w-full md:w-[480px] p-8">
				<h1 className="mb-8 text-2xl font-semibold leading-8">
					Đăng nhập tài khoản
				</h1>

				<form onSubmit={handleSubmit} className="w-full max-w-[408px]">
					{/* Phone input */}
					<div className="flex items-center border border-amber-500 rounded-lg mb-6 focus-within:border-amber-500 focus-within:ring-[3px] focus-within:ring-amber-500/30">
						<Phone className="w-6 h-6 mx-3 text-gray-500" />
						<Input
							type="text"
							name="phone"
							placeholder="Nhập số điện thoại"
							value={formData.phone}
							onChange={handleChange}
							className="border-0 focus-visible:ring-0 focus-visible:border-0"
						/>
					</div>

					{/* Password input */}
					<div className="flex items-center border border-amber-500 rounded-lg mb-6 focus-within:border-amber-500 focus-within:ring-[3px] focus-within:ring-amber-500/30">
						<Lock className="w-6 h-6 mx-3 text-gray-500" />
						<Input
							type="password"
							name="password"
							placeholder="Nhập mật khẩu"
							value={formData.password}
							onChange={handleChange}
							className="border-0 focus-visible:ring-0 focus-visible:border-0"
						/>
					</div>

					<Button
						type="submit"
						className="w-full mt-4 text-white bg-orange-600 rounded-full h-11 hover:bg-orange-600/80"
					>
						Đăng nhập
					</Button>
				</form>
			</div>
		</div>
	);
}
