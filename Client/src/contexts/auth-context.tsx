import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

interface AuthContextType {
	isLoggedIn: boolean;
	role: string | null;
	isEmployee: boolean;
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

	const isEmployee = role === "EMPLOYEE" || role === "ADMIN";

	const login = (userRole: string) => {
		setIsLoggedIn(true);
		setRole(userRole);
		localStorage.setItem("role", userRole);
	};

	const logout = () => {
		setIsLoggedIn(false);
		setRole(null);
		localStorage.removeItem("role");
	};

	useEffect(() => {
		localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
	}, [isLoggedIn]);

	return (
		<AuthContext.Provider
			value={{ isLoggedIn, role, isEmployee, login, logout }}
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
