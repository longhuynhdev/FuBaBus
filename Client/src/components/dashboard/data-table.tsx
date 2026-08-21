import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
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

interface PaginationProps {
	/** 0-based current page index */
	page: number;
	totalPages: number;
	totalElements: number;
	onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
	columns: Column<T>[];
	data: T[];
	isLoading?: boolean;
	emptyMessage?: string;
	pagination?: PaginationProps;
}

export function DataTable<T>({
	columns,
	data,
	isLoading,
	emptyMessage = "Không có dữ liệu",
	pagination,
}: DataTableProps<T>) {
	return (
		<div className="space-y-3">
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
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Đang tải...
								</TableCell>
							</TableRow>
						) : data.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
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
			{pagination && pagination.totalElements > 0 && (
				<div className="flex flex-wrap items-center justify-between gap-2">
					<p className="text-sm text-muted-foreground">
						Trang {pagination.page + 1} / {Math.max(pagination.totalPages, 1)} ·{" "}
						{pagination.totalElements} kết quả
					</p>
					<div className="flex gap-1">
						<Button
							variant="outline"
							size="sm"
							disabled={pagination.page <= 0}
							onClick={() => pagination.onPageChange(pagination.page - 1)}
						>
							<ChevronLeft className="h-4 w-4" />
							Trước
						</Button>
						<Button
							variant="outline"
							size="sm"
							disabled={pagination.page + 1 >= pagination.totalPages}
							onClick={() => pagination.onPageChange(pagination.page + 1)}
						>
							Sau
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
