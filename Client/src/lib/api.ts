const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export function setTokens(accessToken: string, refreshToken: string): void {
	localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
	localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
	localStorage.removeItem(ACCESS_TOKEN_KEY);
	localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function authHeader(): Record<string, string> {
	const token = localStorage.getItem(ACCESS_TOKEN_KEY);
	return token ? { Authorization: `Bearer ${token}` } : {};
}

let refreshPromise: Promise<boolean> | null = null;

async function requestNewTokens(): Promise<boolean> {
	const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
	if (!refreshToken) return false;

	try {
		const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ refreshToken }),
		});
		if (!response.ok) {
			clearTokens();
			return false;
		}
		const data = await response.json();
		setTokens(data.accessToken, data.refreshToken);
		return true;
	} catch (error) {
		console.error("Token refresh failed:", error);
		return false;
	}
}

function refreshTokens(): Promise<boolean> {
	if (!refreshPromise) {
		refreshPromise = requestNewTokens().finally(() => {
			refreshPromise = null;
		});
	}
	return refreshPromise;
}

export async function apiFetch(
	path: string,
	init?: RequestInit,
): Promise<Response> {
	const send = () =>
		fetch(`${BASE_URL}${path}`, {
			...init,
			headers: {
				"Content-Type": "application/json",
				...authHeader(),
				...(init?.headers as Record<string, string> | undefined),
			},
		});

	const response = await send();

	// The auth endpoints issue tokens rather than consume them, so a 401 there is a real
	// failure, not an expired access token.
	if (response.status !== 401 || path.startsWith("/api/auth/")) {
		return response;
	}

	const refreshed = await refreshTokens();
	return refreshed ? send() : response;
}

/** Revokes the refresh token server-side, then drops both tokens locally. */
export async function revokeSession(): Promise<void> {
	const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
	if (refreshToken) {
		try {
			await fetch(`${BASE_URL}/api/auth/logout`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ refreshToken }),
			});
		} catch (error) {
			console.error("Logout request failed:", error);
		}
	}
	clearTokens();
}
