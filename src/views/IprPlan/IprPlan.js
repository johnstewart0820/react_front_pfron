import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Grid, Card, TextField, CircularProgress
} from '@material-ui/core';

import { Autocomplete } from '@material-ui/lab';

import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import { DeleteModal } from '../QualificationPoints/components';
import ipr from '../../apis/ipr';
import clsx from 'clsx';
import {
	KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { pl } from 'date-fns/locale';
import DateFnsUtils from '@date-io/date-fns';
import { PDFDownloadLink, Document, Page } from "@react-pdf/renderer";
import moment from 'moment';
import PictureAsPdfOutlinedIcon from '@material-ui/icons/PictureAsPdfOutlined';
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@material-ui/icons/ExpandLessOutlined';
import domtopdf from 'dom-to-pdf';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './tab.css';

import { PlanView, ScheduleView, PdfTemplate, PdfTemplateSchedule } from './components';

const IprPlan = props => {
	const id = props.match.params.id;
	const [openModal, setOpenModal] = useState(false);
	const { history } = props;
	const classes = useStyles();

	const breadcrumbs = [{ active: true, label: 'Uczestnicy', href: '/participants' }, { active: true, label: 'Lista IPR', href: '/ipr_list' }, { active: false, label: 'Plan realizacji IPR' }];
	const [iprWeekData, setIprWeekData] = useState([]);
	const [iprWeekDates, setIprWeekDates] = useState([]);
	const [show_status, setShowStatus] = useState(false);
	const [moduleList, setModuleList] = useState([]);
	const [selectedItem, setSelectedItem] = useState(0);

	const [participant_number, setParticipantNumber] = useState('');
	const [participant_name, setParticipantName] = useState('');
	const [participant, setParticipant] = useState(0);
	const [participantList, setParticipantList] = useState([]);
	const [ipr_type, setIprType] = useState(0);
	const [iprTypeList, setIprTypeList] = useState([]);
	const [number, setNumber] = useState(0);
	const [schedule_date, setScheduleDate] = useState(new Date());
	const [ork_person, setOrkPerson] = useState(null);
	const [orkPersonList, setOrkPersonList] = useState([]);
	const [profession, setProfession] = useState('');

	const [scheduleData, setScheduleData] = useState([]);
	const [week, setWeek] = useState(-1);
	const [weeks, setWeeks] = useState([]);
	const [status, setStatus] = useState([]);
	const [dateList, setDateList] = useState([]);
	const [selectedScheduleItem, setSelectedScheduleItem] = useState(0);
	const plan_ref = useRef(null);
	const schedule_ref = useRef(null);
	const ref = useRef(null);
	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);
	const [error, setError] = useState({});

	useEffect(() => {
		ipr.getPlanInfo(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					let _arr = [];
					for (let i = 0; i < response.data.module.length; i++) {
						let item = response.data.module[i];
						item.plan = [];
						for (let j = 0; j < response.data.plan.length; j++) {
							if (response.data.module[i].id === response.data.plan[j].module) {
								response.data.plan[j].new = 'false';
								if (response.data.plan[j].start_date === null) {
									let _date = new Date();
									response.data.plan[j].start_date = _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + _date.getDate()
								} else {
									let _date = new Date(response.data.plan[j].start_date);
									response.data.plan[j].start_date = _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + _date.getDate()
								}
								item.plan.push(response.data.plan[j]);
							}
						}
						_arr.push(item);
					}
					setModuleList(_arr);
				}
			})

		ipr.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setIprTypeList(response.data.ipr_type);
					setParticipantList(response.data.participant);
				}
			})
	}, []);


	useEffect(() => {
		ipr.get(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setParticipant(response.data.ipr.id_candidate);
					getOrkPersonData(response.data.ipr.id_candidate, response.data.ipr.id_ork_person);
					for (let i = 0; i < participantList.length; i++) {
						if (participantList[i].id === response.data.ipr.id_candidate) {
							setParticipantName(participantList[i].name + ' ' + participantList[i].surname);
							setParticipantNumber(participantList[i].participant_number);
						}
					}
					setIprType(response.data.ipr.ipr_type);
					setNumber(response.data.ipr.number);
					setOrkPerson(response.data.ipr.id_ork_person);
					setProfession(response.data.ipr.profession);
					setScheduleDate(new Date(response.data.ipr.schedule_date));
				}
			})
	}, [participantList]);

	const handleGetScheduleData = (date) => {
		const format2 = "YYYY-MM-DD";
		let _date = moment(date).format(format2);
		ipr.getScheduleData(id, _date)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					let _schedule_data = response.data.module;
					for (let i = 0; i < _schedule_data.length; i++) {
						for (let j = 0; j < _schedule_data[i].service_list.length; j++) {
							if (!_schedule_data[i].service_list[j].schedule)
								_schedule_data[i].service_list[j].schedule = { start_time: '00:00', end_time: '00:00', break_time: '0', total_time: '0', total_amount: '0' }
						}
					}
					setScheduleData(_schedule_data);
				}
			})
	}

	const getOrkPersonData = (data, id_ork_person) => {
		ipr.getOrkPerson(data)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setNumber(response.data.count);
					setOrkPersonList(response.data.ork_person);
					for (let i = 0; i < response.data.ork_person.length; i++) {
						if (response.data.ork_person[i].id == id_ork_person)
							setOrkPerson(response.data.ork_person[i]);
					}
				}
			})
	}

	const handleBack = () => {
		history.push('/ipr_list');
	}

	const checkScheduleData = (scheduleData) => {
		for (let i = 0; i < scheduleData.length; i++) {
			let service_list = scheduleData[i].service_list;
			for (let j = 0; j < service_list.length; j++) {
				if (service_list[j].schedule.error === true || service_list[j].error_amount === true)
					return false;
			}
		}
		return true;
	}

	const handleSave = () => {

		if (selectedItem == 0) {
			setProgressStatus(true);
			ipr.updatePlan(moduleList, id)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						setHasAlert(true);
						setMessage(response.message);
						setIsSuccess(response.code === 200);
						if (response.code === 200) {
							setTimeout(function () { history.push('/ipr_list'); }, 1000);
						}
						setProgressStatus(false);
					}
				})
		} else {
			if (!checkScheduleData(scheduleData)) {
				setHasAlert(true);
				setMessage('Proszę wypełnić poprawne pola.');
				setIsSuccess(false);
				return;
			}
			setProgressStatus(true);
			let date = dateList[selectedScheduleItem].date;
			const format2 = "YYYY-MM-DD";
			let _date = moment(dateList[selectedScheduleItem].date).format(format2);
			ipr.updateSchedule(scheduleData, _date, status, id)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						setHasAlert(true);
						setMessage(response.message);
						setIsSuccess(response.code === 200);
						if (response.code === 200) {
							// setTimeout(function () { history.push('/ipr_list'); }, 1000);
						}
						setProgressStatus(false);
					}
				})
		}
	}

	const handleDelete = () => {

		setProgressStatus(true);
		ipr
			.delete(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setHasAlert(true);
					setMessage(response.message);
					setIsSuccess(response.code === 200);
					if (response.code === 200) {
						setTimeout(function () { history.push('/ipr_list'); }, 1000);
					}
					setProgressStatus(false);
				}
			})
	}

	const handlePreview = () => {

	}

	const handleExportPdf = () => {
		// const plan_dom = plan_ref.current;
		// const schedule_dom = schedule_ref.current;
		// var options = {
		// 	filename: 'download.pdf',
		// };

		// domtopdf(selectedItem === 0 ? plan_dom : schedule_dom, options, function () {
		// });
		if (selectedItem === 0)
			document.getElementById('export-pdf').click();
		else
			document.getElementById('week-pdf').click();
	}

	const toggleView = () => {
		setShowStatus(!show_status);
	}

	const handleCloseModal = () => {
		setOpenModal(false);
	}

	const getOrkPerson = (ork_person) => {
		let obj = orkPersonList.find((item) => {return item.id == ork_person || item.id == ork_person.id});
		return obj.name;
	}

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
			<PDFDownloadLink
				document={
					<PdfTemplate 
						participant_number={participant_number}
						participant_name={participant_name}
						ipr_type={iprTypeList.length > 0 && ipr_type > 0 ? iprTypeList[ipr_type - 1].name : ''}
						number={number}
						schedule_date={schedule_date.getDate() + '.' + (schedule_date.getMonth() + 1)+ '.' + schedule_date.getFullYear()}
						ork_person={ork_person === 0 || ork_person === null || ork_person === undefined || orkPersonList.length === 0 ? '' : getOrkPerson(ork_person)}
						moduleList={moduleList}
					/>
				}
				fileName="download.pdf"
				style={{
					display: 'none'
				}}
			>
				{({ blob, url, loading, error }) => 
					<div id="export-pdf">
						aaa
					</div>
				}
			</PDFDownloadLink>
			<PDFDownloadLink
				document={
					<PdfTemplateSchedule
						participant_number={participant_number}
						participant_name={participant_name}
						ipr_type={iprTypeList.length > 0 && ipr_type > 0 ? iprTypeList[ipr_type - 1].name : ''}
						number={number}
						schedule_date={schedule_date.getDate() + '.' + (schedule_date.getMonth() + 1)+ '.' + schedule_date.getFullYear()}
						ork_person={ork_person === 0 || ork_person === null || ork_person === undefined || orkPersonList.length === 0 ? '' : getOrkPerson(ork_person)}
						moduleList={iprWeekData}
						dayList={iprWeekDates}
					/>
				}
				fileName="download.pdf"
				style={{
					display: 'none'
				}}
			>
				{({ blob, url, loading, error }) => 
					<div id="week-pdf">
						aaa
					</div>
				}
			</PDFDownloadLink>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Breadcrumb list={breadcrumbs} />
					<Button variant="outlined" color="secondary" id="main" className={classes.btnBack} onClick={handleBack}>					Wróć do listy IPR
				</Button>
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
								<Grid item xs={12} className={classes.form_title} >
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<div>Dane IPR</div>
										<div onClick={toggleView}>
											{show_status ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />}
										</div>
									</div>
								</Grid>
							</Grid>
							{
								show_status ?
									<Grid container spacing={3}>
										<Grid item xs={3}></Grid>
										<Grid item xs={9}>
											<Grid container spacing={3}>
												<Grid item xs={5}>
													<div className={classes.top_label} htmlFor="name">Numer uczestnika</div>
													<div className={classes.number}>{participant_number}</div>
												</Grid>
												<Grid item xs={7}>
													<div className={classes.top_label} htmlFor="name">Uczestnik</div>
													<div className={classes.number}>{participant_name}</div>
												</Grid>
												<Grid item xs={5}>
													<div className={classes.top_label} htmlFor="name">Typ</div>
													<SingleSelect value={ipr_type} list={iprTypeList} disabled={true} />
												</Grid>
												<Grid item xs={2}>
													<div className={classes.top_label} htmlFor="name">Numer</div>
													<div className={classes.number}>{number}</div>
												</Grid>
												<Grid item xs={5}>
													<div className={classes.top_label} htmlFor="name">Data wypełnienia</div>
													<KeyboardDatePicker
														disableToolbar
														disabled={true}
														variant="inline"
														format="dd.MM.yyyy"
                    				placeholder="Format wprowadzania daty DD.MM.RRRR"
														margin="normal"
														id="date-picker-inline"
														value={schedule_date}
														onChange={setScheduleDate}
														aria-label="Data wypełnienia"
														KeyboardButtonProps={{
															'aria-label': 'Zmień datę',
														}}
													/>
												</Grid>
												<Grid item xs={12}>
													<div className={classes.top_label} htmlFor="name">Specjalista ds. zarządzania rehabilitacją</div>
													<Autocomplete
														disabled={true}
														className={classes.name_select_box}
														onChange={(event, value) => setOrkPerson(value)}
														value={ork_person}
														options={orkPersonList}
														getOptionLabel={(option) => participantList && option && option.name}
														renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
													/>
												</Grid>
												<Grid item xs={12}>
													<div className={classes.top_label} htmlFor="name">Wybrany zawód</div>
													<input className={classes.input_box} type="name" value={profession} name="name" disabled={true} />
												</Grid>
											</Grid>
										</Grid>
									</Grid>
									:
									<></>
							}
						</Card>
						<div className={classes.second_form} ref={ref}>
							<Tabs onSelect={setSelectedItem}>
								<TabList >
									<Tab style={{ width: '50%' }}>PLAN REALIZACJI</Tab>
									<Tab style={{ width: '50%' }}>HARMONOGRAMY TYGODNIOWE</Tab>
								</TabList>
								<TabPanel>
									<div style={{ width: ref.current ? ref.current.clientWidth : '100%'}} ref={plan_ref}>
										<PlanView
											moduleList={moduleList}
											setModuleList={setModuleList}
										/>
									</div>
								</TabPanel>
								<TabPanel>
									<div style={{ width: ref.current ? ref.current.clientWidth : '100%'}} ref={schedule_ref}>
										<ScheduleView
											scheduleDate={schedule_date}
											scheduleData={scheduleData}
											setScheduleData={setScheduleData}
											handleGetScheduleData={handleGetScheduleData}
											week={week}
											setWeek={setWeek}
											weeks={weeks}
											setWeeks={setWeeks}
											status={status}
											setStatus={setStatus}
											dateList={dateList}
											setDateList={setDateList}
											selectedItem={selectedScheduleItem}
											setSelectedItem={setSelectedScheduleItem}
											handleWeekData={setIprWeekData}
											handleWeekDates={setIprWeekDates}
											id={id}
										/>
									</div>
								</TabPanel>
							</Tabs>
						</div>

					</Grid>
					<Grid item md={3} xs={12}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item xs={4}>
									<Button aria-label="Pobierz PDF" variant="outlined" color="secondary" className={classes.btnOption} onClick={handleExportPdf}>
										<PictureAsPdfOutlinedIcon />
									</Button>
								</Grid>
								<Grid item xs={4}>
									<Button aria-label="Podgląd"  variant="outlined" color="secondary" className={classes.btnOption} onClick={handlePreview}>
										<FindInPageOutlinedIcon />
									</Button>
								</Grid>
								<Grid item xs={4}>
									<Button aria-label="Usuń" variant="outlined" color="secondary" className={classes.btnOption} onClick={handleDelete}>
										<DeleteIcon />
									</Button>
								</Grid>
								<Grid item xs={12}>
									<Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleSave}>
										Zapisz
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
			<DeleteModal
				openModal={openModal}
				handleClose={handleCloseModal}
				handleDelete={handleDelete}
				selectedIndex={id}
			/>
		</MuiPickersUtilsProvider>
	);
};

export default IprPlan;
