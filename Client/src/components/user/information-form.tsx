import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

interface UserData {
	name: string;
	phone: string;
	email: string;
	gender: string;
	address: string;
	job: string;
}

export function InformationForm() {
	const [userData, setUserData] = useState<UserData>({
		name: "",
		phone: "",
		email: "",
		gender: "MALE",
		address: "",
		job: "",
	});

	useEffect(() => {
		const customerId = localStorage.getItem("customerId");
		if (!customerId) return;
		apiFetch(`/api/customers/${customerId}`)
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => {
				if (data) {
					setUserData({
						name: data.name ?? "",
						phone: data.phone ?? "",
						email: data.email ?? "",
						gender: data.gender ?? "MALE",
						address: data.address ?? "",
						job: data.job ?? "",
					});
				}
			})
			.catch((err) => console.error("Failed to load customer:", err));
	}, []);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setUserData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleGenderChange = (value: string) => {
		setUserData((prev) => ({
			...prev,
			gender: value,
		}));
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();
		const customerId = localStorage.getItem("customerId");
		if (!customerId) {
			toast.error("Vui lòng đăng nhập để cập nhật thông tin.");
			return;
		}
		try {
			const response = await apiFetch(`/api/customers/${customerId}`, {
				method: "PUT",
				body: JSON.stringify(userData),
			});
			if (response.ok) {
				toast.success("Cập nhật thông tin thành công");
			} else {
				toast.error("Cập nhật thất bại. Vui lòng thử lại.");
			}
		} catch (error) {
			console.error("Update error:", error);
			toast.error("Có lỗi xảy ra khi cập nhật.");
		}
	};

	return (
		<div className="flex-1">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-2xl font-medium text-gray-900">
					Thông tin tài khoản
				</h1>
				<p className="mt-2 text-base text-gray-700/80">
					Quản lý thông tin hồ sơ để bảo mật tài khoản
				</p>
			</div>

			{/* Form */}
			<form
				onSubmit={handleSubmit}
				className="p-6 border border-gray-300 rounded-2xl"
			>
				{/* Name */}
				<div className="flex items-center mb-4">
					<Label className="w-1/5 text-sm">Họ và tên:</Label>
					<Input
						type="text"
						name="name"
						value={userData.name}
						onChange={handleChange}
						required
						className="flex-1"
					/>
				</div>

				{/* Phone */}
				<div className="flex items-center mb-4">
					<Label className="w-1/5 text-sm">Số điện thoại:</Label>
					<Input
						type="text"
						name="phone"
						value={userData.phone}
						onChange={handleChange}
						required
						className="flex-1"
					/>
				</div>

				{/* Email */}
				<div className="flex items-center mb-4">
					<Label className="w-1/5 text-sm">E-mail:</Label>
					<Input
						type="email"
						name="email"
						value={userData.email}
						onChange={handleChange}
						required
						className="flex-1"
					/>
				</div>

				{/* Gender */}
				<div className="flex items-center mb-4">
					<Label className="w-1/5 text-sm">Giới tính:</Label>
					<Select value={userData.gender} onValueChange={handleGenderChange}>
						<SelectTrigger className="w-1/5">
							<SelectValue placeholder="Chọn giới tính" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="MALE">Nam</SelectItem>
							<SelectItem value="FEMALE">Nữ</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Address */}
				<div className="flex items-center mb-4">
					<Label className="w-1/5 text-sm">Địa chỉ:</Label>
					<Input
						type="text"
						name="address"
						value={userData.address}
						onChange={handleChange}
						className="flex-1"
					/>
				</div>

				{/* Job */}
				<div className="flex items-center mb-4">
					<Label className="w-1/5 text-sm">Nghề nghiệp:</Label>
					<Input
						type="text"
						name="job"
						value={userData.job}
						onChange={handleChange}
						className="flex-1"
					/>
				</div>

				{/* Submit button */}
				<div className="flex justify-center mt-8">
					<Button
						type="submit"
						className="w-[180px] h-[46px] rounded-full bg-orange-600 hover:bg-orange-600/80 text-white font-semibold"
					>
						Cập nhật
					</Button>
				</div>
			</form>
		</div>
	);
}
