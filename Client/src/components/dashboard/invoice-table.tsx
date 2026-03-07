import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/dashboard/data-table";
import { apiFetch } from "@/lib/api";
import { formatVND } from "@/lib/utils";
import { toast } from "sonner";

interface Invoice {
	invoiceID: string;
	name: string;
	phone: string;
	email: string;
	price: number;
	paymentMethod: string;
	status: string;
}

export function InvoiceTable() {
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		apiFetch("/api/invoices")
			.then((res) => (res.ok ? res.json() : []))
			.then(setInvoices)
			.catch(() => toast.error("Không thể tải danh sách hóa đơn"))
			.finally(() => setLoading(false));
	}, []);

	const columns = [
		{ header: "Mã HĐ", accessorKey: "invoiceID" as const },
		{ header: "Tên", accessorKey: "name" as const },
		{ header: "SĐT", accessorKey: "phone" as const },
		{ header: "Email", accessorKey: "email" as const },
		{
			header: "Giá",
			cell: (row: Invoice) => formatVND(row.price),
		},
		{ header: "Thanh toán", accessorKey: "paymentMethod" as const },
		{
			header: "Trạng thái",
			cell: (row: Invoice) => (
				<Badge variant="outline">{row.status}</Badge>
			),
		},
	];

	return <DataTable columns={columns} data={invoices} isLoading={loading} />;
}
