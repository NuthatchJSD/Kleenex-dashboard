import { ColumnDef } from '@tanstack/react-table';
import { Participation, Status } from '../../Types/Participation';
import { DataTableColumnHeaderCheckbox } from '../tables/checkbox-menu';
import { DataTableColumnHeaderSearch } from '../tables/search-menu';
import { isSelectedFilterFn } from './filters';
import MessageHistory from './components/MessageHistory';

const StatusDisplayOptions: Record<Status, string> = {
	complete: 'Completo',
	pending: 'Pendiente',
	incomplete: 'Incompleto',
	rejected: 'Rechazado',
	approved: 'Aprobado',
	fullfiled: 'Entregado',
};

export const columns: ColumnDef<Participation>[] = [
	{
		accessorKey: 'priorityNumber',
		id: 'priorityNumber',
		header: ({ column }) => (
			<DataTableColumnHeaderSearch column={column} title="Num" />
		),
		cell: ({ row }) => {
			const priorityNumber = row.getValue<number>('priorityNumber');
			return <div>{priorityNumber > 0 ? priorityNumber : ''}</div>;
		},
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
		id: 'phone',
		header: ({ column }) => (
			<DataTableColumnHeaderSearch column={column} title="Celular" />
		),
		cell: ({ row }) => {
			const participation = row.original;
			return participation ? (
				<MessageHistory participation={participation} />
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
					'complete',
					'pending',
					'incomplete',
					'rejected',
					'approved',
					'fullfiled',
				]}
				displayOptions={StatusDisplayOptions}
			/>
		),
		filterFn: isSelectedFilterFn,
		cell: ({ row }) => {
			const status = row.getValue<string>('status').toLowerCase() as Status;
			return status ? (
				<div>
					{StatusDisplayOptions[status] ? StatusDisplayOptions[status] : status}
				</div>
			) : null;
		},
	},
];
