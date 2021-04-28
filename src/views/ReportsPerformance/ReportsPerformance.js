import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Grid, Card, CircularProgress, TextField, Typography
} from '@material-ui/core';

import XLSX from "xlsx-style-tw";
import { Breadcrumb, SingleSelect } from 'components';
import report from '../../apis/report';
import { Autocomplete } from '@material-ui/lab';

const ReportsPerformance = props => {
	const { history } = props;
	const classes = useStyles();

	const breadcrumbs = [{ active: true, label: 'Finanse', href: '/reports_service' }, { active: true, label: 'Raport', href: '#' }, { active: false, label: 'Nadwykonania' }];
	const [name, setName] = useState('raport');
	const [rehabitationCenter, setRehabitationCenter] = useState(0);
	const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
	const [participant, setParticipant] = useState(null);
	const [participantList, setParticipantList] = useState([]);
	const [quater_from, setQuaterFrom] = useState([]);
	const [quater_to, setQuaterTo] = useState([]);
	const [quaterList, setQuaterList] = useState([]);
	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);
	const [result, setResult] = useState(null);
	const [error, setError] = useState({});

	useEffect(() => {
		report.getServiceInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setParticipantList(response.data.participant);
					setRehabitationCenterList(response.data.rehabitation_center);
				}
			})
	}, []);

	useEffect(() => {
		if (parseInt(rehabitationCenter) != 0) {
			report.getServiceQuarter(rehabitationCenter)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						let quater_list = response.data.quater;
						quater_list = quater_list.map((item, index) => {
							item.start_date = `Kw. ${index + 1} (${item.start_date})`;
							item.end_date = `Kw. ${index + 1} (${item.end_date})`;
							return item;
						})
						setQuaterList(quater_list);
					}
				})
		}
	}, [rehabitationCenter]);

	useEffect(() => {
		if (participant != null) {
			report.getServiceQuarter(participant.rehabitation_center)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						let quater_list = response.data.quater;
						quater_list = quater_list.map((item, index) => {
							item.start_date = `Kw. ${index + 1} (${item.start_date})`;
							item.end_date = `Kw. ${index + 1} (${item.end_date})`;
							return item;
						})
						setQuaterList(quater_list);
					}
				})
		}
	}, [participant]);

	useEffect(() => {

	}, [result]);

	const handleError = () => {
		let _error = {}
		_error.rehabitation_center = (parseInt(rehabitationCenter) === 0);
		setError(_error);
	};

	const handleChangeName = (value) => {
		setName(value);
	}

	const handleChangeRehabitationCenter = (value) => {
		setRehabitationCenter(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.rehabitation_center = (parseInt(value) === 0);
		setError(_error);
	}

	const handleChangeParticipant = (value) => {
		setParticipant(value);
	}

	const handleChangeQuaterFrom = (value) => {
		setQuaterFrom(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.quater_from = (value === null);
		setError(_error);
	}

	const handleChangeQuaterTo = (value) => {
		setQuaterTo(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.quater_to = (value === null);
		setError(_error);
	}

	const checkError = () => {
		return parseInt(rehabitationCenter) === 0
	}

	const handleGenerate = () => {
		if ((participant === null && parseInt(rehabitationCenter) === 0) || !quater_from.id || !quater_to.id) {
			setHasAlert(true);
			setMessage('Proszę wypełnić wszystkie wymagane pola.');
			setIsSuccess(false);
		}
		else {
			setProgressStatus(true);
			report.getOverdoneData(rehabitationCenter, participant === null ? 0 : participant.id, quater_from.id, quater_to.id)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						handleExport(response.data.candidate, response.data.start_order, response.data.end_order);
					}
					setProgressStatus(false);
				})
		}
	}

	const handleExport = (data, start_order, end_order) => {
		let total_sum = ['', ''];
		let total_data = [];
		let header = [
			'Lp.',
			'Kod uczestnika',
			'Działanie',
			'Plan IPR1+IPR2',
		];

		for (let i = start_order; i <= end_order; i++) {
			header.push(`Realizacja Kwartał ${i}`);
		}

		header.push(`Realizacja Kwartał ${start_order} - ${end_order}`)
		header.push('Nadwykonanie');
		header.push('Wartość ostateczna rozliczenia danej pozycji budżetowej w V kwartale');
		total_data.push(header);
		let count = 1;
		data.map((candidate, index) => {

			let service_lists = candidate.service_lists;

			service_lists.map((service, index) => {

				let item = [];
				let plan = service.plan;
				let schedule = service.schedule;
				let plan_total = plan.trial + plan.basic;
				let schedule_total = 0;

				item.push(count++);

				item.push(index != 0 ? '' : candidate.participant_number);
				item.push(service.name);
				item.push(plan_total);

				for (let i = 0; i < schedule.basic.length; i++) {
					schedule_total += (schedule.basic[i] + schedule.trial[i]);
					item.push(schedule.basic[i] + schedule.trial[i])
				}

				item.push(schedule_total);
				item.push(schedule_total - plan_total > 0 ? schedule_total - plan_total : 0)
				item.push('');

				total_data.push(item);
			})
		})
		const ws = XLSX.utils.aoa_to_sheet(total_data);
		var wscols = [
			{
				wch: 10, alignment: {
					wrapText: '1', // any truthy value here
				}
			},
			{
				wch: 10, alignment: {
					wrapText: '1', // any truthy value here
				}
			},
			{
				wch: 40, alignment: {
					wrapText: '1', // any truthy value here
				}
			},
		];
		for (let i = start_order; i <= end_order + 4; i++) {
			wscols.push({
				wch: 10, alignment: {
					wrapText: '1', // any truthy value here
				}
			});
		}
		ws['!cols'] = wscols;
		ws["!rows"] = [ // just demo, should use for-loop
			{ hpx: 80, },
		]
		for (const key in ws) {
			// first row
			if (key == '!ref')
				break;
			if (key.replace(/[^0-9]/ig, '') === '1') {
				ws[key].s = {
					alignment: {
						wrapText: '1', // any truthy value here
					},
					font: {
						sz: 12, // font size
						bold: true // bold
					},
					border: {
						// underscore
						bottom: {
							style: 'thin',
							color: 'FF000000'
						},
						left: {
							style: 'thin',
							color: 'FF000000'
						},
						right: {
							style: 'thin',
							color: 'FF000000'
						},
						top: {
							style: 'thin',
							color: 'FF000000'
						},
					},
					fill: {
						fgColor: { rgb: 'FFB8CCD4' } // Add background color
					},
				}
			} else {
				ws[key].s = {
					alignment: {
						wrapText: '1', // any truthy value here
					},
					font: {
						sz: 12, // font size
						bold: true // bold
					},
					border: {
						// underscore
						bottom: {
							style: 'thin',
							color: 'FF000000'
						},
						left: {
							style: 'thin',
							color: 'FF000000'
						},
						right: {
							style: 'thin',
							color: 'FF000000'
						},
						top: {
							style: 'thin',
							color: 'FF000000'
						},
					},

				}
			}
		}
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "SheetJS");
		/* generate XLSX file and send to client */
		XLSX.writeFile(wb, `${name}.xlsx`);
	}

	return (
		<>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Breadcrumb list={breadcrumbs} />
				</div>
				<Alert
					hasAlert={hasAlert}
					setHasAlert={setHasAlert}
					isSuccess={isSuccess}
					message={message}
				/>
				<Grid container spacing={3} className={classes.formBlock}>
					<Grid item md={9} xs={12}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<Typography variant="h2" className={classes.form_title}>
										Zdefiniuj dane raportu
									</Typography>
								</Grid>
								<Grid item md={9} xs={12}>
									<div className={classes.top_label} ><label htmlFor="name">Nazwa raportu</label></div>
									<input className={classes.input_box} id="name" type="name" value={name} name="name" onChange={(e) => handleChangeName(e.target.value)} />
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
									<Typography variant="h2" className={classes.form_title}>
										Okres
									</Typography>
								</Grid>
								<Grid item md={9} xs={12}>
									<Grid container spacing={2}>
										<Grid item md={5} xs={12}>
											<div className={classes.top_label} ><label htmlFor="rehabilitation_centers">Wybierz ORK</label></div>
											<SingleSelect value={rehabitationCenter} handleChange={(value) => handleChangeRehabitationCenter(value)} list={rehabitationCenterList} />
										</Grid>
										<Grid item md={2} xs={12} className={classes.center}>
											lub
									</Grid>
										<Grid item md={5} xs={12}>
											<div className={classes.top_label} ><label htmlFor="participants">Wybierz uczestnika</label></div>
											<Autocomplete
												className={classes.name_select_box}
												id="participants"
												onChange={(event, value) => handleChangeParticipant(value)}
												value={participant}
												options={participantList}
												getOptionLabel={(option) => participantList && option && option.name}
												renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
											/>
										</Grid>
										<Grid item md={4} xs={12}>
											<div className={classes.top_label} ><label htmlFor="quater_from">Wybierz kwartał od</label></div>
											<Autocomplete
												className={classes.name_select_box}
												id="quater_from"
												onChange={(event, value) => handleChangeQuaterFrom(value)}
												value={quater_from}
												options={quaterList}
												getOptionLabel={(option) => participantList && option && option.start_date}
												renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
											/>
										</Grid>
										<Grid item md={4} xs={12}>
											<div className={classes.top_label} ><label htmlFor="quater_to">Wybierz kwartał do</label></div>
											<Autocomplete
												className={classes.name_select_box}
												id="quater_to"
												onChange={(event, value) => handleChangeQuaterTo(value)}
												value={quater_to}
												options={quaterList}
												getOptionLabel={(option) => participantList && option && option.end_date}
												renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
											/>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Card>
					</Grid>
					<Grid item md={3} xs={12}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleGenerate}  title="Generuj raport - Kliknij aby pobrać plik poniżej 1MB">
										Generuj raport
                	</Button>
								</Grid>
							</Grid>
						</Card>
					</Grid>
				</Grid>
			</div>
			{
				progressStatus ?
					<>
						<div className={classes.progressContainer}>
							<CircularProgress className={classes.progress} />
						</div>
					</>
					:
					<></>
			}
		</>
	);
};

export default ReportsPerformance;
