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

const ReportsParticipant = props => {
	const { history } = props;
	const classes = useStyles();

	const breadcrumbs = [{ active: true, label: 'Finanse', href: '/reports_service' }, { active: true, label: 'Raporty', href: '#' }, { active: false, label: 'Raport sprawozdawczy z rekrutacji uczestników' }];
	const [name, setName] = useState('raport');
	const [rehabitationCenter, setRehabitationCenter] = useState(0);
	const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
	const [participant, setParticipant] = useState(null);
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

	const handleChangeName = (value) => {
		setName(value);
	}

	const handleChangeRehabitationCenter = (value) => {
		setRehabitationCenter(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.rehabitation_center = (parseInt(value) === 0);
		setError(_error);
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
		if (parseInt(rehabitationCenter) === 0 || !quater_from.id || !quater_to.id) {
			setHasAlert(true);
			setMessage('Proszę wypełnić wszystkie wymagane pola.');
			setIsSuccess(false);
		}
		else {
			setProgressStatus(true);
			report.getRecruitmentData(rehabitationCenter, quater_from.id, quater_to.id)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						handleExport(response.data.count_list);
					}
					setProgressStatus(false);
				})
		}
	}

	const handleExport = (data) => {
		let total_data = [];
		total_data.push(['Instytucja rekrutująca',
		'Liczba zakwalifikowanych uczestników']);
		total_data.push(['PFRON', data[0]]);
		total_data.push(['ZUS', data[1]]);
		total_data.push(['Powiat', data[2]]);

		const ws = XLSX.utils.aoa_to_sheet(total_data);
		var wscols = [
			{wch:40,alignment: {
				wrapText: '1', // any truthy value here
			},},
			{wch:80, alignment: {
				wrapText: '1', // any truthy value here
			},},
		];
		
		ws['!cols']	= wscols;
		
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
									</Grid>
									<Grid container spacing={2}>
										<Grid item md={4} xs={12}>
											<div className={classes.top_label} ><label htmlFor="quater_from">Wybierz kwartał od</label></div>
											<Autocomplete
												className={classes.name_select_box}
												id="quater_from"
												onChange={(event, value) => handleChangeQuaterFrom(value)}
												value={quater_from}
												options={quaterList}
												getOptionLabel={(option) => quaterList && option && option.start_date}
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
												getOptionLabel={(option) => quaterList && option && option.end_date}
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

export default ReportsParticipant;
