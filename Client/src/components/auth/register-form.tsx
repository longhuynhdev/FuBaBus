import { useNavigate } from "@tanstack/react-router";
import { Lock, Mail, Phone, User } from "lucide-react";
import { type FormEvent, useState } from "react";
import logoWithTextIcon from "@/assets/logoText.svg";
import TVCIcon from "@/assets/TVC.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

interface RegisterFormData {
	phone: string;
	email: string;
	name: string;
	password: string;
}

export function RegisterForm() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<RegisterFormData>({
		phone: "",
		email: "",
		name: "",
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
			const response = await apiFetch("/api/auth/register", {
				method: "POST",
				body: JSON.stringify(formData),
			});
			if (response.ok) {
				toast.success("Đăng ký thành công");
				navigate({ to: "/login" });
			} else {
				toast.error("Đăng ký thất bại. Vui lòng thử lại.");
			}
		} catch (error) {
			console.error("Register error:", error);
			toast.error("Có lỗi xảy ra khi đăng ký.");
		}
	};

	return (
		<div className="flex flex-row max-w-[1128px] h-[520px] mx-auto rounded-2xl border border-orange-500/60 outline outline-6 outline-orange-900/5 overflow-hidden bg-white">
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
				<h1 className="mb-6 text-2xl font-semibold leading-8">
					Đăng ký tài khoản
				</h1>

				<form onSubmit={handleSubmit} className="w-full max-w-[408px]">
					{/* Phone input */}
					<div className="flex items-center border border-amber-500 rounded-lg mb-4 focus-within:border-amber-500 focus-within:ring-[3px] focus-within:ring-amber-500/30">
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

					{/* Email input */}
					<div className="flex items-center border border-amber-500 rounded-lg mb-4 focus-within:border-amber-500 focus-within:ring-[3px] focus-within:ring-amber-500/30">
						<Mail className="w-6 h-6 mx-3 text-gray-500" />
						<Input
							type="email"
							name="email"
							placeholder="Nhập Email"
							value={formData.email}
							onChange={handleChange}
							className="border-0 focus-visible:ring-0 focus-visible:border-0"
						/>
					</div>

					{/* Name input */}
					<div className="flex items-center border border-amber-500 rounded-lg mb-4 focus-within:border-amber-500 focus-within:ring-[3px] focus-within:ring-amber-500/30">
						<User className="w-6 h-6 mx-3 text-gray-500" />
						<Input
							type="text"
							name="name"
							placeholder="Nhập họ tên"
							value={formData.name}
							onChange={handleChange}
							className="border-0 focus-visible:ring-0 focus-visible:border-0"
						/>
					</div>

					{/* Password input */}
					<div className="flex items-center border border-amber-500 rounded-lg mb-4 focus-within:border-amber-500 focus-within:ring-[3px] focus-within:ring-amber-500/30">
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
						Đăng ký
					</Button>
				</form>
			</div>
		</div>
	);
}
