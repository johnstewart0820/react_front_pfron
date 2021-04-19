import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Grid, Card, CircularProgress, TextField
} from '@material-ui/core';

import XLSX from "xlsx-style-tw";
import { Breadcrumb, SingleSelect } from 'components';
import report from '../../apis/report';
import { Autocomplete } from '@material-ui/lab';

const ReportsFinancial = props => {
	const { history } = props;
	const classes = useStyles();

	const breadcrumbs = [{ active: true, label: 'Finanse', href: '/reports_service' }, { active: true, label: 'Raport', href: '#' }, { active: false, label: 'Raport finansowy' }];
	const [name, setName] = useState('raport');
	const [rehabitationCenter, setRehabitationCenter] = useState(0);
	const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
	const [participant, setParticipant] = useState(null);
	const [participantList, setParticipantList] = useState([]);
	const [quater, setQuater] = useState([]);
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
							item.start_date = `Kwartał ${index + 1} (${item.start_date})`;
							item.end_date = `Kwartał ${index + 1} (${item.end_date})`;
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
							item.start_date = `Kwartał ${index + 1} (${item.start_date})`;
							item.end_date = `Kwartał ${index + 1} (${item.end_date})`;
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

	const handleChangeQuater = (value) => {
		setQuater(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.quater_from = (value === null);
		_error.quater_to = (value === null);
		setError(_error);
	}

	const checkError = () => {
		return parseInt(rehabitationCenter) === 0
	}

	const handleGenerate = () => {
		if ((participant === null && parseInt(rehabitationCenter) === 0) || !quater.id) {
			setHasAlert(true);
			setMessage('Proszę wypełnić wszystkie wymagane pola.');
			setIsSuccess(false);
		}
		else {
			setProgressStatus(true);
			report.getServiceData(rehabitationCenter, participant === null ? 0 : participant.id, quater.id)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						handleExport(response.data.candidate);
					}
					setProgressStatus(false);
				})
		}
	}

	const handleExport = (data) => {
		let romic_number = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
		let total_sum = ['', ''];
		let header = [
			'Lp.',
			'Działanie'
		];
		let total_data = { cols: [], data: [] };
		let column = ['', ''];
		for (let i = 0; i < data.length; i++) {
			column.push('');
			header.push(data[i].participant_number);
		}
		column.push('');
		column.push('');
		column.push('');
		column.push('');
		column.push('');
		column.push('');
		column.push('');
		header.push( 'Liczba Uczestników w okresie sprawozdawczym');
		header.push('Jednostka');
		header.push('Liczba zrealizowanych jednostek na jednego Uczestnika (średnio)');
		header.push('Liczba zrealizowanych jednostek w okresie 8.12.19-07.03.2020 (C x E)');
		header.push('Stawka jednostkowa netto (PLN)');
		header.push('Cena netto (F x G)');
		header.push('Cena brutto (H x (1+J))');
		total_data.cols = column;
		total_data.data.push(header);

		let sub_header = [
			'A',
			'B',
		];
		for (let i = 0; i < data.length; i++) {
			sub_header.push('');
		}
		sub_header.push('C');
		sub_header.push('D');
		sub_header.push('E');
		sub_header.push('F');
		sub_header.push('G');
		sub_header.push('H');
		sub_header.push('I');

		total_data.data.push(sub_header);
		let index = 0;
		let module_index = 3;
		let arr = [];
		let total_price = 0;
		if (data.length > 0) {
			let module = data[0].module;
			for (let i = 0; i < module.length; i++) {
				let item = [];
				item.push('');
				item.push(romic_number[i] + '. ' + module[i].name);
				for (let j = 0; j < data.length + 7; j ++) {
					item.push('');
				}
				total_data.data.push(item);
				let service_list = module[i].service_lists;
				arr.push(module_index);
				module_index ++;
				for (let j = 0; j < service_list.length; j++) {
					let item = [];
					item.push(++index);
					item.push(service_list[j].name);
					let count = 0;
					let sum = 0;
					let cost = data[0].module[i].service_lists[j].cost;
					for (let k = 0; k < data.length; k++) {
						let schedule = data[k].module[i].service_lists[j].schedule;
						let value = (parseFloat(schedule.trial) + parseFloat(schedule.basic));
						let money = value * cost;
						
						if (!total_sum[k + 2])
							total_sum[k + 2] = 0;
						total_sum[k + 2] += money;

						if (!total_sum[2 + data.length])
							total_sum[2 + data.length] = 0;
						total_sum[2 + data.length] += value;

						item.push(value === 0 ? '' : money.toFixed(2) + 'xxx');
						if (value !== 0)
							count++;
						sum += value;
					}
					let average = sum / data.length;

					item.push(count === 0 ? 'nd' : count + '' );
					item.push(data[0].module[i].service_lists[j].unit_name );
					item.push(average === 0 ? 'nd' : average.toFixed(2) );
					item.push(
						sum === 0 ? 'nd' : sum.toFixed(2));

					
					item.push(parseFloat(cost).toFixed(2));
					let sum_value = (cost * sum);
					total_price += sum_value;
					if (!total_sum[5 + data.length])
						total_sum[5 + data.length] = 0;
					total_sum[5 + data.length] += parseFloat(sum);
					item.push(sum_value === 0 ? 'nd' : sum_value.toFixed(2));
					item.push(sum_value === 0 ? 'nd' : sum_value.toFixed(2));
					total_data.data.push(item);
					module_index ++;
				}
			}
		}
		// export_data.push(total_sum);
		let item = [];
		item.push('');
		item.push('VIII. ŁĄCZNIE W KWARTALE')
		for (let i = 1; i < data.length + 7; i++) {
			item.push('');
		}
		item.push(total_price);
		total_data.data.push(item);
		let item_last = [];
		for (let i = 0; i < total_sum.length; i++) {
			let value = total_sum[i];
			item_last.push(total_sum[i] === undefined ? '' : parseFloat(value).toFixed(2) + '' );
		}
		total_data.data.push(item_last);
		const ws = XLSX.utils.aoa_to_sheet(total_data.data);
		var wscols = [
			{wch:6,alignment: {
				wrapText: '1', // any truthy value here
			},},
			{wch:120, alignment: {
				wrapText: '1', // any truthy value here
			},},
		];
		for (let i = 0; i <= data.length; i++) {
			wscols.push({wch: 10});
		}
		wscols.push({wch: 30});
		wscols.push({wch: 20});
		wscols.push({wch: 20});
		wscols.push({wch: 20});
		wscols.push({wch: 20});
		wscols.push({wch: 20});
		ws['!cols']	= wscols;
		ws["!rows"] = [ // just demo, should use for-loop
			{ hpx: 120, },
			
		]
		arr.push(module_index);
		for (const key in ws) {
			// first row
			if (key == '!ref')
					break;
			if(key.replace(/[^0-9]/ig, '') === '1' || key.replace(/[^0-9]/ig, '') === '2') {
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
			}
			for (let i = 0; i < arr.length; i ++) {
				if (arr[i] === parseInt(key.replace(/[^0-9]/ig, ''))) {
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
							fgColor: { rgb: 'D8E4B2' } // Add background color
						},
					}
				}
			}
			if (ws[key].v.toString().endsWith('xxx')) {
				ws[key].s = {
					fill: {
						fgColor: { rgb: '0000FF' } // Add background color
					},
				}
				ws[key].v = ws[key].v.split('xxx')[0]
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
								<Grid item md={3} xs={12} className={classes.form_title}>
									Zdefiniuj dane raportu
              </Grid>
								<Grid item md={9} xs={12}>
									<div className={classes.top_label} ><label htmlFor="name">Nazwa raportu</label></div>
									<input className={classes.input_box} id="name" type="name" value={name} name="name" onChange={(e) => handleChangeName(e.target.value)} />
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item md={3} xs={12} className={classes.form_title}>
									Okres
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
												onChange={(event, value) => handleChangeQuater(value)}
												value={quater}
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
												onChange={(event, value) => handleChangeQuater(value)}
												value={quater}
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
									<Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleGenerate}>
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

export default ReportsFinancial;
