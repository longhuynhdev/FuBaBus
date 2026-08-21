import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";

interface Customer {
	id: string;
	name: string;
	phone: string;
	email: string;
	gender: string;
	role: string;
}

const PAGE_SIZE = 20;

export function CustomerTable() {
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [totalElements, setTotalElements] = useState(0);

	const fetchCustomers = (targetPage: number) => {
		setLoading(true);
		apiFetch(`/api/customers?page=${targetPage}&size=${PAGE_SIZE}`)
			.then((res) => (res.ok ? res.json() : []))
			.then((data) => {
				if (Array.isArray(data)) {
					setCustomers(data);
					setTotalPages(1);
					setTotalElements(data.length);
				} else {
					setCustomers(data.content ?? []);
					setTotalPages(data.totalPages ?? 0);
					setTotalElements(data.totalElements ?? 0);
				}
				setPage(targetPage);
			})
			.catch(() => toast.error("Không thể tải danh sách khách hàng"))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		fetchCustomers(0);
		// eslint-disable-next-line react-hooks/exhaustive-deps
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

	return (
		<DataTable
			columns={columns}
			data={customers}
			isLoading={loading}
			pagination={{
				page,
				totalPages,
				totalElements,
				onPageChange: fetchCustomers,
			}}
		/>
	);
}
