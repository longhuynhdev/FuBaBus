import type { ReactNode } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

interface Column<T> {
	header: string;
	accessorKey?: keyof T;
	cell?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
	columns: Column<T>[];
	data: T[];
	isLoading?: boolean;
	emptyMessage?: string;
}

export function DataTable<T>({
	columns,
	data,
	isLoading,
	emptyMessage = "Không có dữ liệu",
}: DataTableProps<T>) {
	return (
		<div className="overflow-x-auto rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						{columns.map((col) => (
							<TableHead key={col.header}>{col.header}</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								Đang tải...
							</TableCell>
						</TableRow>
					) : data.length === 0 ? (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								{emptyMessage}
							</TableCell>
						</TableRow>
					) : (
						data.map((row, i) => (
							<TableRow key={i}>
								{columns.map((col) => (
									<TableCell key={col.header}>
										{col.cell
											? col.cell(row)
											: col.accessorKey
												? String(
														(row as Record<string, unknown>)[
															col.accessorKey as string
														] ?? "",
													)
												: ""}
									</TableCell>
								))}
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
