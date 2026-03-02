import { type FormEvent, useState } from "react";
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

interface UserData {
	name: string;
	phone: string;
	email: string;
	gender: string;
	address: string;
	job: string;
}

export function InformationForm() {
	// TODO: Fetch user data from API
	const [userData, setUserData] = useState<UserData>({
		name: "",
		phone: "",
		email: "",
		gender: "MALE",
		address: "",
		job: "",
	});

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
		// TODO: Replace with actual API call using fetch
		try {
			// const customerId = localStorage.getItem('customerId');
			// const response = await fetch(`http://localhost:8080/api/customers/${customerId}`, {
			//   method: 'PUT',
			//   headers: { 'Content-Type': 'application/json' },
			//   body: JSON.stringify(userData),
			// });
			// if (response.ok) {
			//   alert('Cập nhật thông tin thành công');
			// }
			console.log("Update user data:", userData);
			alert("Cập nhật thông tin thành công");
		} catch (error) {
			console.error("Update error:", error);
			alert("An error occurred while updating");
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
