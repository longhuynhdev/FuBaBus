import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { apiFetch } from "@/lib/api";

interface AuthContextType {
	isLoggedIn: boolean;
	role: string | null;
	isEmployee: boolean;
	userName: string;
	login: (role: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
	const [isLoggedIn, setIsLoggedIn] = useState(() => {
		const storedLoggedIn = localStorage.getItem("isLoggedIn");
		return storedLoggedIn ? JSON.parse(storedLoggedIn) : false;
	});

	const [role, setRole] = useState<string | null>(() => {
		return localStorage.getItem("role");
	});

	const [userName, setUserName] = useState(() => {
		return localStorage.getItem("userName") || "User";
	});

	const isEmployee = role === "EMPLOYEE" || role === "ADMIN";

	const login = (userRole: string) => {
		setIsLoggedIn(true);
		setRole(userRole);
		localStorage.setItem("role", userRole);
	};

	const logout = () => {
		setIsLoggedIn(false);
		setRole(null);
		setUserName("User");
		localStorage.removeItem("role");
		localStorage.removeItem("userName");
	};

	useEffect(() => {
		localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
	}, [isLoggedIn]);

	useEffect(() => {
		if (!isLoggedIn) return;
		const customerId = localStorage.getItem("customerId");
		if (!customerId) return;
		apiFetch(`/api/customers/${customerId}`)
			.then((res) => (res.ok ? res.json() : null))
			.then((data) => {
				if (data?.name) {
					setUserName(data.name);
					localStorage.setItem("userName", data.name);
				}
			})
			.catch(() => {});
	}, [isLoggedIn]);

	return (
		<AuthContext.Provider
			value={{ isLoggedIn, role, isEmployee, userName, login, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
