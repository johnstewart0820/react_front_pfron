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
	const [name, setName] = useState('Bilans IPR i nadwykonania');
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
		setQuaterFrom(0);
		setQuaterTo(0);
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
		setQuaterFrom(0);
		setQuaterTo(0);
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
						let wb = XLSX.utils.book_new();
						wb = handleExport(wb, response.data.candidate, response.data.start_order, response.data.end_order);
						wb = handleExportOld(wb, response.data.candidate, response.data.start_order, response.data.end_order)
						XLSX.writeFile(wb, `${name}.xlsx`);
					}
					setProgressStatus(false);
				})
		}
	}

	function numToAlpha(num) {

		var alpha = '';

		for (; num >= 0; num = parseInt(num / 26, 10) - 1) {
			alpha = String.fromCharCode(num % 26 + 0x41) + alpha;
		}

		return alpha;
	}

	function alphaToNum(alpha) {

		var i = 0,
			num = 0,
			len = alpha.length;

		for (; i < len; i++) {
			num = num * 26 + alpha.charCodeAt(i) - 0x40;
		}

		return num - 1;
	}

	const handleExportOld = (wb, data, start_order, end_order) => {
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
		data.map((candidate, index) => {
			let module_list = candidate.module;
			let count = 0;
			module_list.map((module_item, index) => {
				let service_lists = module_item.service_lists;
				
				service_lists.map((service, index) => {

					let item = [];
					let plan = service.plan;
					let schedule = service.schedule;
					let plan_total = Number(plan.trial) + Number(plan.basic);
					let schedule_total = 0;

					for (let i = 0; i < schedule.basic.length; i++) {
						schedule_total += (Number(schedule.basic[i]) + Number(schedule.trial[i]));
					}

					let sub = schedule_total - plan_total > 0 ? schedule_total - plan_total : 0;
					
					if (sub > 0) {
						item.push(service.number);

						item.push(count != 0 ? '' : candidate.participant_number);
						item.push(service.name);
						item.push(plan_total);
						for (let i = 0; i < schedule.basic.length; i++) {
							item.push(Number(schedule.basic[i]) + Number(schedule.trial[i]))
						}
						item.push(schedule_total);
						item.push(schedule_total - plan_total > 0 ? schedule_total - plan_total : 0)
						item.push('');
						total_data.push(item);
						count ++;
					}
						
				})
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
			let column = key.replace(new RegExp("[0-9]", "g"), "");
			let row = key.replace(/[^0-9]/ig, '');
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
						fgColor: { rgb: '94d451' } // Add background color
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

			if(ws[`${column}1`].v == 'Plan IPR1+IPR2' || ws[`${column}1`].v == 'Nadwykonanie') {
				ws[key].s = {
					...ws[key].s,
					fill: {
						fgColor: { rgb: '94d451' } // Add background color
					},
				}
			}
		}

		XLSX.utils.book_append_sheet(wb, ws, "Nadwykonania");
		/* generate XLSX file and send to client */
		return wb;
	}

	const handleExport = (wb, data, start_order, end_order) => {
		let romic_number = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
		let total_sum = ['', ''];
		let total_data = [];
		let header = [
			'Lp.',
			'Działanie',
			'Liczba Uczestników w okresie sprawozdawczym',
		];
		let sub_header = ['', '', ''];
		let merge = [];
		for (let i = 0; i < 3; i++)
			merge.push({ s: { r: 0, c: i }, e: { r: 1, c: i } });
		let start = 3;
		data.map((candidate, index) => {
			header.push(candidate.participant_number);
			for (let i = start_order; i <= end_order + 1; i++) {
				header.push('');
			}
			for (let i = start_order; i <= end_order; i++) {
				sub_header.push(`K${i}`);
			}
			sub_header.push('Suma');
			sub_header.push('Plan');
			merge.push({ s: { c: start, r: 0 }, e: { c: start + end_order - start_order + 2, r: 0 } });
			start = start + end_order - start_order + 3;
		});
		total_data.push(header);
		total_data.push(sub_header);

		let module = data[0].module;
		let green_field_index_arr = [];
		let green_field_index = 3;
		let sum_field_index_arr = [];

		for (let i = 0; i < module.length; i++) {
			let item = [];
			item.push('');
			item.push(romic_number[i] + '. ' + module[i].name);
			for (let j = 0; j <= data.length * (end_order - start_order + 3); j++) {
				item.push('');
			}

			total_data.push(item);

			green_field_index_arr.push(green_field_index);
			green_field_index++;

			let service_list = module[i].service_lists;

			for (let j = 0; j < service_list.length; j++) {
				let item = [];
				item.push(service_list[j].number);
				item.push(service_list[j].name);
				item.push('');
				for (let k = 0; k < data.length; k++) {
					let schedule = data[k].module[i].service_lists[j].schedule;
					let plan = data[k].module[i].service_lists[j].plan;
					for (let l = 0; l < schedule.trial.length; l++) {
						item.push(Number(schedule.trial[l]) + Number(schedule.basic[l]));
					}
					item.push('xxx');
					item.push(Number(plan.trial) + Number(plan.basic));
				}
				total_data.push(item);
				green_field_index++;
			}
		}
		let item = [];
		for (let i = 0; i < total_data[0].length; i++) {
			item.push('')
		}
		total_data.push(item);

		const ws = XLSX.utils.aoa_to_sheet(total_data);
		if (!ws['!merges']) ws['!merges'] = [];
		for (let i = 0; i < merge.length; i++)
			ws['!merges'].push(merge[i]);
		var wscols = [
			{
				wch: 6, alignment: {
					wrapText: '1', // any truthy value here
				}
			},
			{
				wch: 80, alignment: {
					wrapText: '1', // any truthy value here
				}
			},
		];
		for (let i = 0; i <= data.length * (end_order - start_order + 3); i++) {
			wscols.push({
				wch: 10, alignment: {
					wrapText: '1', // any truthy value here
				}
			});
		}
		ws['!cols'] = wscols;
		ws["!rows"] = [ // just demo, should use for-loop
			{ hpx: 50, },
		]

		for (const key in ws) {
			// first row
			if (key == '!ref')
				break;
			let column = key.replace(new RegExp("[0-9]", "g"), "");
			let row = key.replace(/[^0-9]/ig, '');
			ws[key].s = {
				...ws[key].s,
				alignment: {
					wrapText: '1', // any truthy value here
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
			};

			if (ws[key].v === 'xxx') {
				ws[key].f = `SUM(${numToAlpha(alphaToNum(column) - end_order + start_order - 1)}${row}:${numToAlpha(alphaToNum(column) - 1)}${row})`;
				ws[key].s = {
					...ws[key].s,
					fill: {
						fgColor: { rgb: 'FFFFD1' }
					}
				}
				ws[`${numToAlpha(alphaToNum(column) + 1)}${row}`].s = {
					...ws[`${numToAlpha(alphaToNum(column) + 1)}${row}`].s,
					fill: {
						fgColor: { rgb: 'B0CE94' } // Add background color
					},
				}
				let sum = 0;
				let plan = Number(ws[`${numToAlpha(alphaToNum(column) + 1)}${row}`].v);
				for (let k = end_order - start_order; k >= 0; k--) {
					sum += Number(ws[`${numToAlpha(alphaToNum(column) - k - 1)}${row}`].v);
					if (sum > plan) {
						ws[`${numToAlpha(alphaToNum(column) - k - 1)}${row}`].s = {
							...ws[`${numToAlpha(alphaToNum(column) - k - 1)}${row}`].s,
							fill: {
								fgColor: { rgb: 'DA3323' } // Add background color
							},
						}
					}
				}
			}

			if (column != 'A' && column != 'B' && Number(row) > 2) {
				ws[key].t = 'n';
				ws[key].s = { ...ws[key].s, numFmt: "0.00" };
			}

			if (parseInt(row) === total_data.length && column != 'A' && column != 'B' && column != 'C') {
				ws[key].f = `SUM(${column}3:${column}${row - 1})`;
			}

			for (let i = 0; i < green_field_index_arr.length; i++) {
				if (green_field_index_arr[i] === parseInt(row)) {
					ws[key].s = {
						...ws[key].s,
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
							fgColor: { rgb: 'FFC000' } // Add background color
						},
					}
				}
			}
		}

		XLSX.utils.book_append_sheet(wb, ws, "Zestawienie dodatkowe");
		/* generate XLSX file and send to client */
		return wb;
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
									<Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleGenerate} title="Generuj raport - Kliknij aby pobrać plik poniżej 1MB">
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
