import { FunctionComponent } from "react";
import { HeadCell } from "./SortableTableHeader/types";

export type Order = 'asc' | 'desc';

type SortableTableProps = {
	rows: any,
	type?: string,
	headCells: HeadCell[],
	onCheck: any,
	clearAll: boolean,
	updateStatus?: (id: number, status: string) => void,
	onRowClick?: any,
	onSortChange?: (property:  keyof any, order: string) => void,
}

export type SortableTableTemplateType = FunctionComponent<SortableTableProps>