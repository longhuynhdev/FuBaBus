import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone, Lock } from "lucide-react";

import logoWithTextIcon from "@/assets/logoText.svg";
import TVCIcon from "@/assets/TVC.svg";

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
    // TODO: Replace with actual API call using fetch
    // For now, just simulate login
    try {
      // const response = await fetch('http://localhost:8080/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });
      // const data = await response.json();
      // if (response.ok) {
      //   localStorage.setItem('accessToken', data.accessToken);
      //   localStorage.setItem('customerId', data.customerId);
      //   login();
      //   navigate({ to: '/' });
      // }
      console.log("Login attempt with:", formData);
      login();
      navigate({ to: "/" });
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in");
    }
  };

  return (
    <div className="flex flex-row max-w-[1128px] h-[471px] mx-auto rounded-2xl border border-orange-500/60 outline outline-6 outline-orange-900/5 overflow-hidden bg-white">
      {/* Banner section - Left side */}
      <div className="flex-1 hidden md:flex flex-col p-8">
        <img
          src={logoWithTextIcon}
          alt="Logo"
          className="h-[77px] w-[366px] object-contain"
        />
        <div className="flex-1 flex items-start justify-start">
          <img
            src={TVCIcon}
            alt="Banner"
            className="max-w-[500px] w-full object-contain"
          />
        </div>
      </div>

      {/* Form section - Right side */}
      <div className="flex flex-col justify-center items-center w-full md:w-[480px] p-8">
        <h1 className="font-semibold text-2xl leading-8 mb-8">
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
            className="w-full mt-4 h-11 rounded-full bg-orange-600 hover:bg-orange-600/80 text-white"
          >
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
}
