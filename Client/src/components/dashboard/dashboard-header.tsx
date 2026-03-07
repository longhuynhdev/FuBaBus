import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface DashboardHeaderProps {
	title: string;
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
			<SidebarTrigger />
			<Separator orientation="vertical" className="mr-2 !h-4" />
			<h1 className="text-lg font-semibold">{title}</h1>
		</header>
	);
}
