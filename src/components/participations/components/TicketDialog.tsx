import { useState } from 'react';
import { boolean, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '../../ui/alert-dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../../ui/select';
import { useToast } from '../../ui/use-toast';

import settings from '../../../settings';
import { Participation } from '../../../Types/Participation';

const ticketNumberSchema = z.object({
	ticketNumber: z.string(),
});

interface TicketDialogProps {
	participation: Participation;
	onTicketSend: () => Promise<void>;
}

const RejectButton = ({ disabled }: { disabled: boolean }) => (
	<div className="flex justify-center h-fit">
		<Button disabled={disabled} variant="destructive">
			Rechazar
		</Button>
	</div>
);

export default function TicketDialog({
	participation,
	onTicketSend,
}: TicketDialogProps) {
	const [reason, setReason] = useState<string>('');
	const [isOpen, setIsOpen] = useState(false);
	const [disabled, setDisabled] = useState<boolean>(
		participation.serial_number !== '',
	);
	const { toast } = useToast();

	const form = useForm<z.infer<typeof ticketNumberSchema>>({
		resolver: zodResolver(ticketNumberSchema),
		defaultValues: {
			ticketNumber: participation.serial_number || '',
		},
	});

	const handleReject = async () => {
		setDisabled(true);
		try {
			const url = `${settings.apiUrl}/api/dashboard/reject/`;
			console.log(url);
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					ticket_id: participation.id,
					rejection_reason: reason,
				}),
			});
			if (!response.ok) {
				toast({
					title: 'Error al rechazar ticket',
					description: response.status,
				});
			} else {
				toast({
					title: 'Ticket rechazado',
				});
				await onTicketSend();
				setIsOpen(false);
			}
		} catch (error) {
			console.error('Error rejecting ticket: ', error);
		}
		setDisabled(false);
	};

	const onSubmit = async (values: z.infer<typeof ticketNumberSchema>) => {
		setDisabled(true);
		try {
			const url = `${settings.apiUrl}/api/dashboard/accept`;
			console.log(url);
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					ticket_id: participation.id,
					serial_number: values.ticketNumber,
				}),
			});
			if (!response.ok) {
				toast({
					title: 'Folio repetido',
					description: response.status,
				});
			} else {
				toast({
					title: 'Ticket aceptado',
				});
				await onTicketSend();
				setIsOpen(false);
				form.reset();
			}
		} catch (error) {
			console.error('Error accepting ticket: ', error);
		}
		setDisabled(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Ticket</Button>
			</DialogTrigger>
			<DialogContent className="min-w-fit h-[700px] flex flex-col">
				<DialogHeader>
					<DialogTitle>Validación de Ticket</DialogTitle>
				</DialogHeader>
				<DialogDescription asChild>
					<div className="flex h-80">
						<div className="min-w-[500px]">
							<img
								className="max-h-[600px]"
								src={`${settings.bucketURL + participation.ticketUrl}`}
							/>
						</div>
						<div className="grid grid-cols-2 grid-rows-2 h-fit min-w-[260px] gap-3 m-5">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="contents"
								>
									<FormField
										control={form.control}
										name="ticketNumber"
										render={({ field }: { field: any }) => (
											<FormItem className="col-span-2 h-fit">
												<FormControl>
													<Input
														className="min-w-[250px]"
														placeholder="Num. de Ticket"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="flex justify-center">
										<Button
											variant="secondary"
											type="submit"
											disabled={disabled}
										>
											Aceptar
										</Button>
									</div>
								</form>
							</Form>
							{disabled ? (
								<RejectButton disabled={disabled} />
							) : (
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<RejectButton disabled={disabled} />
									</AlertDialogTrigger>
									<AlertDialogContent className="w-fit">
										<AlertDialogHeader>
											<AlertDialogTitle>Motivo de Rechazo</AlertDialogTitle>
											<AlertDialogDescription>
												<Select onValueChange={setReason} defaultValue={reason}>
													<SelectTrigger className="w-[180px]">
														<SelectValue placeholder="Motivo" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="No Legible">
															No Legible
														</SelectItem>
														<SelectItem value="Ticket invalido">
															Ticket invalido
														</SelectItem>
													</SelectContent>
												</Select>
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancelar</AlertDialogCancel>
											<AlertDialogAction
												onClick={handleReject}
												disabled={disabled}
											>
												Rechazar
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)}
						</div>
					</div>
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}
