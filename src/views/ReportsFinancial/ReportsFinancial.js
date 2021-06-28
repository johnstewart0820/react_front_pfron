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

const ReportsFinancial = props => {
	const { history } = props;
	const classes = useStyles();

	const breadcrumbs = [{ active: true, label: 'Finanse', href: '/reports_service' }, { active: true, label: 'Raport', href: '#' }, { active: false, label: 'Raport finansowy' }];
	const [name, setName] = useState('Indywidualna Kartoteka Uczestnika - finanse');
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
			report.getServiceData(rehabitationCenter, participant === null ? 0 : participant.id, quater_from.id, quater_to.id)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						handleExport(response.data.candidate, participant === null ? rehabitationCenter : participant.rehabitation_center, quater_from, quater_to);
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


	const getPolishMonth = (str_date) => {
		let _str = str_date.split('Kw. ')[1].split(')')[0];
		let arr = _str.split(' (');
		let id = arr[0];
		let _arr = arr[1].split('-');
		return { id: id, date: `${_arr[2]}.${_arr[1]}.${_arr[0]}` };
	}

	const handleExport = (data, rehabitation_center, quater_from, quater_to) => {
		let romic_number = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
		let total_sum = ['', ''];
		let header = [
			'Lp.',
			'Działanie'
		];
		let start_date_info = getPolishMonth(quater_from.start_date);
		let end_date_info = getPolishMonth(quater_to.end_date);

		let total_data = { cols: [], data: [] };

		total_data.data.push([`${rehabitationCenterList[rehabitation_center - 1].name} - 
			Raport finansowy, Kwartał ${start_date_info.id} 
			(${start_date_info.date}) - ${end_date_info.id} (${end_date_info.date})`]);

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
		header.push('Liczba Uczestników w okresie sprawozdawczym');
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
		let module_index = 4;
		let arr = [];
		let total_price = 0;
		let module_index_arr = [];
		if (data.length > 0) {
			let module = data[0].module;
			for (let i = 0; i < module.length; i++) {
				module_index_arr.push({ from: total_data.data.length + 1, to: total_data.data.length + module[i].service_lists.length });
				let item = [];
				item.push('');
				item.push(romic_number[i] + '. ' + module[i].name);
				for (let j = 0; j < data.length + 7; j++) {
					item.push('');
				}
				total_data.data.push(item);
				let service_list = module[i].service_lists;
				arr.push(module_index);
				module_index++;
				for (let j = 0; j < service_list.length; j++) {
					let item = [];
					item.push(service_list[j].number);
					item.push(service_list[j].name);
					let count = 0;
					let sum = 0;
					let cost = data[0].module[i].service_lists[j].cost;
					for (let k = 0; k < data.length; k++) {
						let schedule = data[k].module[i].service_lists[j].schedule;
						let value = (Number(schedule.trial) + Number(schedule.basic));
						let money = value * cost;

						if (!total_sum[k + 2])
							total_sum[k + 2] = 0;
						total_sum[k + 2] += money;

						if (!total_sum[2 + data.length])
							total_sum[2 + data.length] = 0;
						total_sum[2 + data.length] += value;

						item.push(value === 0 ? '' : money);
						if (value !== 0)
							count++;
					}

					item.push(count === 0 ? 'nd' : count);
					item.push(data[0].module[i].service_lists[j].unit_name);
					item.push('');
					if (data[0].module[i].service_lists[j].total_quater_amount === null)
						item.push('null');
					else
						item.push(Number(data[0].module[i].service_lists[j].total_quater_amount));

					item.push(Number(cost));
					let sum_value = (cost * sum);
					total_price += sum_value;
					if (!total_sum[5 + data.length])
						total_sum[5 + data.length] = 0;
					total_sum[5 + data.length] += Number(sum);
					item.push(sum_value === 0 ? 'nd' : sum_value);
					item.push(sum_value === 0 ? 'nd' : sum_value);
					total_data.data.push(item);
					module_index++;
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
			item_last.push(total_sum[i] === undefined || !total_sum[i] ? '' : Number(value));
		}
		// total_data.data.push(item_last);
		const ws = XLSX.utils.aoa_to_sheet(total_data.data);
		var wscols = [
			{
				wch: 6, alignment: {
					wrapText: '1', // any truthy value here
				},
			},
			{
				wch: 120, alignment: {
					wrapText: '1', // any truthy value here
				},
			},
		];
		for (let i = 0; i <= data.length; i++) {
			wscols.push({ wch: 10 });
		}
		wscols.push({ wch: 30 });
		wscols.push({ wch: 20 });
		wscols.push({ wch: 20 });
		wscols.push({ wch: 20 });
		wscols.push({ wch: 20 });
		wscols.push({ wch: 20 });
		ws['!cols'] = wscols;
		ws["!rows"] = [ // just demo, should use for-loop
			{ hpx: 120, },

		]

		var merge = { s: { r: 0, c: 0 }, e: { r: 0, c: data.length + 8 } };
		if (!ws['!merges']) ws['!merges'] = [];
		ws['!merges'].push(merge);

		arr.push(module_index);

		for (let i = 2; i < sub_header.length; i++) {
			if (i != sub_header.length - 6) {
				for (let j = 0; j < module_index_arr.length; j++) {
					ws[`${numToAlpha(i)}${module_index_arr[j].from}`].f = `SUM(${numToAlpha(i)}${module_index_arr[j].from + 1}:${numToAlpha(i)}${module_index_arr[j].to + 1})`;
				}
			}
		}

		for (const key in ws) {
			// first row
			if (key == '!ref')
				break;

			let column = key.replace(new RegExp("[0-9]", "g"), "");
			let row = key.replace(/[^0-9]/ig, '');

			if ((ws[column + '2'].v.startsWith("M")
				|| ws[column + '2'].v.startsWith("Liczba Uczestnikó")
				|| ws[column + '2'].v.startsWith("Liczba zrealizowanych jednostek w okresie")
				|| ws[column + '2'].v.startsWith("Cena brutto")
			) && row == total_data.data.length) {
				let bonus = '';
				for (let j = 0; j < module_index_arr.length; j++) {
					bonus += `-${column}${module_index_arr[j].from}`;
				}
				ws[key].f = `SUMIF(${column}3:${column}${total_data.data.length - 1}, "<>nd", ${column}3:${column}${total_data.data.length - 1})${bonus}`
			}
			if (ws[column + '2'].v.startsWith('Liczba zrealizowanych jednostek w okresie')) {
				let start = 2;
				let end = 2 + data.length - 1;
				if (ws[`A${row}`].v != '' && row >= 4) {
					if (ws[key].v === 'null')
						ws[key].f = `IF(${numToAlpha(alphaToNum(column) + 1)}${row}=0, "nd", SUM(${numToAlpha(start)}${row}:${numToAlpha(end)}${row})/${numToAlpha(alphaToNum(column) + 1)}${row})`;
					ws[`${numToAlpha(alphaToNum(column) - 1)}${row}`].f = `IF(${numToAlpha(alphaToNum(column) - 3)}${row}="nd", "nd", ${key}/${numToAlpha(alphaToNum(column) - 3)}${row})`
					ws[`${numToAlpha(alphaToNum(column) + 2)}${row}`].f = `IF(${key}="nd", "nd", ${key}*${numToAlpha(alphaToNum(column) + 1)}${row})`
					ws[`${numToAlpha(alphaToNum(column) + 3)}${row}`].f = `${numToAlpha(alphaToNum(column) + 2)}${row}`
				}
			}

			if (!isNaN(ws[key].v) && column != 'A') {
				ws[key].t = 'n';
				ws[key].s = { numFmt: "0.00" };
			}

			if (key.replace(/[^0-9]/ig, '') === '1') {
				ws[key].s = {
					...ws[key].s,
					font: {
						sz: 12, // font size
						bold: true // bold
					},
				}
			}

			if (key.replace(/[^0-9]/ig, '') === '2' || key.replace(/[^0-9]/ig, '') === '3') {
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
						fgColor: { rgb: 'FFB8CCD4' } // Add background color
					},
				}
			}
			for (let i = 0; i < arr.length; i++) {
				if (arr[i] === parseInt(key.replace(/[^0-9]/ig, ''))) {
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
							fgColor: { rgb: 'D8E4B2' } // Add background color
						},
					}
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

export default ReportsFinancial;
