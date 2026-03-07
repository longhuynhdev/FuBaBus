import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/dashboard/data-table";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

interface Customer {
	id: string;
	name: string;
	phone: string;
	email: string;
	gender: string;
	role: string;
}

export function CustomerTable() {
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		apiFetch("/api/customers")
			.then((res) => (res.ok ? res.json() : []))
			.then(setCustomers)
			.catch(() => toast.error("Không thể tải danh sách khách hàng"))
			.finally(() => setLoading(false));
	}, []);

	const columns = [
		{ header: "ID", accessorKey: "id" as const },
		{ header: "Tên", accessorKey: "name" as const },
		{ header: "SĐT", accessorKey: "phone" as const },
		{ header: "Email", accessorKey: "email" as const },
		{ header: "Giới tính", accessorKey: "gender" as const },
		{
			header: "Vai trò",
			cell: (row: Customer) => (
				<Badge
					variant={
						row.role === "EMPLOYEE" || row.role === "ADMIN"
							? "default"
							: "secondary"
					}
				>
					{row.role}
				</Badge>
			),
		},
	];

	return <DataTable columns={columns} data={customers} isLoading={loading} />;
}
