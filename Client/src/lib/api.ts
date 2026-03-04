const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

function authHeader(): Record<string, string> {
	const token = localStorage.getItem("accessToken");
	return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(
	path: string,
	init?: RequestInit,
): Promise<Response> {
	return fetch(`${BASE_URL}${path}`, {
		...init,
		headers: {
			"Content-Type": "application/json",
			...authHeader(),
			...(init?.headers as Record<string, string> | undefined),
		},
	});
}
