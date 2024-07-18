import { ColumnDef } from '@tanstack/react-table';
import { Participation } from '../../Types/Participation';
import { DataTableColumnHeaderCheckbox } from '../tables/checkbox-menu';
import { DataTableColumnHeaderSearch } from '../tables/search-menu';
import { isSelectedFilterFn } from './filters';
import TicketDialog from './components/TicketDialog';

export const columns: ColumnDef<Participation>[] = [
	{
		accessorKey: 'priorityNumber',
		id: 'priorityNumber',
		header: ({ column }) => (
			<DataTableColumnHeaderSearch column={column} title="Num" />
		),
	},
	{
		accessorKey: 'datetime',
		header: 'Fecha',
		cell: ({ row }) => {
			let date = row.getValue('datetime');
			if (!(date instanceof Date)) {
				return null;
			}
			const padToTwoDigits = (num: number) => num.toString().padStart(2, '0');
			const formattedDate = `
	        ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear().toString().slice(-2)}
	        ${padToTwoDigits(date.getHours())}:${padToTwoDigits(date.getMinutes())}:${padToTwoDigits(date.getSeconds())}
            `;
			return <div>{formattedDate}</div>;
		},
	},
	{
		accessorKey: 'user.phone',
		id: 'phone',
		header: ({ column }) => (
			<DataTableColumnHeaderSearch column={column} title="Celular" />
		),
		cell: ({ row }) => {
			const phone = row.getValue<string>('phone');
			return phone ? <div>{phone.slice(-10)}</div> : null;
		},
	},
	{
		header: 'Ticket',
		accessorKey: 'id',
		cell: ({ row }) => {
			const participation = row.original;
			return participation ? (
				<TicketDialog participation={participation} />
			) : null;
		},
	},
	{
		accessorKey: 'prize',
		header: 'Premio',
	},
	{
		accessorKey: 'status',
		id: 'status',
		header: ({ column }) => (
			<DataTableColumnHeaderCheckbox
				column={column}
				title="Estado"
				options={[
					'fullfilled',
					'approved',
					'rejected',
					'incomplete',
					'complete',
				]}
			/>
		),
		filterFn: isSelectedFilterFn,
		cell: ({ row }) => {
			const status = row.getValue<string>('status');
			return status ? <div>{status.toUpperCase()}</div> : null;
		},
	},
];
