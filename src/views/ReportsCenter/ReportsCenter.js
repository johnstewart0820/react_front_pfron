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
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import template_zip from './ork_template.docx';
const ReportsCenter = props => {
	const { history } = props;
	const classes = useStyles();

	const breadcrumbs = [{ active: true, label: 'Finanse', href: '/reports_service' }, { active: true, label: 'Raporty', href: '#' }, { active: false, label: 'Raport sprawozdawczy z rekrutacji uczestników' }];
	const [name, setName] = useState('Raport sprawozdawczy z działalności ośrodka');
	const [rehabitationCenter, setRehabitationCenter] = useState(0);
	const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
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

	const loadFile = (url, callback) => {
		PizZipUtils.getBinaryContent(url, callback);
	}

	const generateDocument = (data) => {
		loadFile(template_zip, function (
			error,
			content
		) {
			if (error) {
				throw error;
			}
			var zip = new PizZip(content);
			var doc = new Docxtemplater().loadZip(zip);
			doc.setData({
				rehabitation_name: data.rehabitation_center.name,
				rehabitation_contact_number: data.rehabitation_center.contact_number,
				rehabitation_leader_name: data.rehabitation_center.leader_name,
				rehabitation_leader_regon_number: data.rehabitation_center.leader_regon_number,
				rehabitation_leader_nip_number: data.rehabitation_center.leader_nip_number,
				rehabitation_macroregion_number: data.rehabitation_center.macroregion_number,
				rehabitation_partner_count: data.rehabitation_partners.length,
				partner_name: data.rehabitation_partners.length > 0 ? data.rehabitation_partners[0].name : '',
				partner_regon: data.rehabitation_partners.length > 0 ? data.rehabitation_partners[0].regon : '',
				partner_nip: data.rehabitation_partners.length > 0 ? data.rehabitation_partners[0].nip : '',
				partner_contact: data.rehabitation_center.contact,
				partner_position: data.rehabitation_center.position,
				partner_phone: data.rehabitation_center.phone,
				partner_email: data.rehabitation_center.email,
				participants: data.participants,
				table_data: data.table_data,
			});
			try {
				// render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
				doc.render();
			} catch (error) {
				// The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
				function replaceErrors(key, value) {
					if (value instanceof Error) {
						return Object.getOwnPropertyNames(value).reduce(function (
							error,
							key
						) {
							error[key] = value[key];
							return error;
						},
							{});
					}
					return value;
				}

				if (error.properties && error.properties.errors instanceof Array) {
					const errorMessages = error.properties.errors
						.map(function (error) {
							return error.properties.explanation;
						})
						.join("\n");
					// errorMessages is a humanly readable message looking like this :
					// 'The tag beginning with "foobar" is unopened'
				}
				throw error;
			}
			var out = doc.getZip().generate({
				type: "blob",
				mimeType:
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document"
			}); //Output the document using Data-URI
			saveAs(out, `${name}.docx`);
		});
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
			report.getRehabitationData(rehabitationCenter, quater_from.id, quater_to.id)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						generateDocument(response.data);
					}
					setProgressStatus(false);
				})
		}
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

export default ReportsCenter;
