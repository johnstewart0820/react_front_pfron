import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useStyles from './style';
import {
	Button, Grid, Card, TextField, CircularProgress
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'
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
import moment from 'moment';
import PictureAsPdfOutlinedIcon from '@material-ui/icons/PictureAsPdfOutlined';
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@material-ui/icons/ExpandLessOutlined';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './tab.css';

const IprBalance = props => {
	const id = props.match.params.id;
	const [openModal, setOpenModal] = useState(false);
	const { history } = props;
	const classes = useStyles();
	const { addToast } = useToasts()
	const breadcrumbs = [{ active: true, label: 'Uczestnicy', href: '/participants' }, { active: true, label: 'Lista IPR', href: '/ipr_list' }, { active: false, label: 'Bilans realizacji IPR' }];
	const [show_status, setShowStatus] = useState(false);
	const [participant_number, setParticipantNumber] = useState('');
	const [participant_name, setParticipantName] = useState('');
	const [participant, setParticipant] = useState(0);
	const [participantList, setParticipantList] = useState([]);
	const [moduleList, setModuleList] = useState([]);
	const [ipr_type, setIprType] = useState(0);
	const [iprTypeList, setIprTypeList] = useState([]);
	const [number, setNumber] = useState(0);
	const [schedule_date, setScheduleDate] = useState(new Date());
	const [ork_person, setOrkPerson] = useState(null);
	const [orkPersonList, setOrkPersonList] = useState([]);
	const [profession, setProfession] = useState('');

	const [dataList, setDataList] = useState([]);
	const [sumPlanTrial, setSumPlanTrial] = useState(0);
	const [sumScheduleTrial, setSumScheduleTrial] = useState(0);
	const [sumPlanBasic, setSumPlanBasic] = useState(0);
	const [sumScheduleBasic, setSumScheduleBasic] = useState(0);
	const [sumBalance, setSumBalance] = useState(0);
	const [progressStatus, setProgressStatus] = useState(false);
	const [error, setError] = useState({});

	useEffect(() => {
		ipr.getBalanceInfo(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setDataList(response.data.module);
				}
			})
	}, []);

	useEffect(() => {
		let _a = 0, _b = 0, _c = 0, _d = 0, _e = 0;
		for (let i = 0; i < dataList.length; i ++) {
			let service = dataList[i].service_lists;
			for (let j = 0; j < service.length; j ++) {
				let schedule = service[j].schedule;
				let plan = service[j].plan;
				let balance = service[j].balance;
				_a += plan ? plan.trial ? parseInt(plan.trial) : 0 :0;
				_b += plan ? plan.basic ? parseInt(plan.basic) : 0 :0;
				_c += schedule ? schedule.trial ? parseInt(schedule.trial) : 0 :0;
				_d += schedule ? schedule.basic ? parseInt(schedule.basic) : 0 :0;
				_e += balance ? balance.amount ? parseInt(balance.amount) : 0 :0;
			}
		}
		setSumPlanTrial(_a);
		setSumPlanBasic(_b);
		setSumScheduleTrial(_c);
		setSumScheduleBasic(_d);
		setSumBalance(_e);
	}, [dataList])

	useEffect(() => {

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
					// setOrkPerson(response.data.ipr.id_ork_person);
					setProfession(response.data.ipr.profession);
					setScheduleDate(new Date(response.data.ipr.schedule_date));
				}
			})
	}, [participantList]);

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

	const handleSave = () => {
		setProgressStatus(true);
		ipr.updateBalance(dataList, id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true })
					if (response.code === 200) {
						setTimeout(function () { history.push('/ipr_list'); }, 1000);
					}
					setProgressStatus(false);
				}
			})
	}

	const handleDelete = () => {
		setProgressStatus(true);
		ipr
			.delete(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true })
					if (response.code === 200) {
						setTimeout(function () { history.push('/ipr_list'); }, 1000);
					}
					setProgressStatus(false);
				}
			})
	}

	const toggleView = () => {
		setShowStatus(!show_status);
	}

	const handleCloseModal = () => {
		setOpenModal(false);
	}

	const getPlanTrial = (item) => {
		return item.plan ? item.plan.trial ? item.plan.trial : 0 : 0;
	}
	const getScheduleTrial = (item) => {
		return item.schedule ? item.schedule.trial ? item.schedule.trial : 0 : 0;
	}
	const getPlanBasic = (item) => {
		return item.plan ? item.plan.basic ? item.plan.basic : 0 : 0;
	}
	const getScheduleBasic = (item) => {
		return item.schedule ? item.schedule.basic ? item.schedule.basic : 0 : 0;
	}

	const handleChangeBalanceAmount = (value, index_module, index_service) => {
		let _dataList = JSON.parse(JSON.stringify(dataList));
		_dataList[index_module].service_lists[index_service].balance.amount = value;
		setDataList(_dataList);
	}

	const handleChangeBalanceRemark = (value, index_module, index_service) => {
		let _dataList = JSON.parse(JSON.stringify(dataList));
		_dataList[index_module].service_lists[index_service].balance.remarks = value;
		setDataList(_dataList);	
	}

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Breadcrumb list={breadcrumbs} />
					<Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleBack}>
						Wróć do listy IPR
				</Button>
				</div>
				<Grid container spacing={3} className={classes.formBlock}>
					<Grid item xs={9}>
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
													<div className={classes.top_label}><label htmlFor="date">Data wypełnienia</label></div>
													<KeyboardDatePicker
														disableToolbar
														disabled={true}
														id="date"
														variant="inline"
														format="dd.MM.yyyy"
														margin="normal"
														id="date-picker-inline"
														value={schedule_date}
														onChange={setScheduleDate}
														KeyboardButtonProps={{
															'aria-label': 'change date',
														}}
													/>
												</Grid>
												<Grid item xs={12}>
													<div className={classes.top_label}><label htmlFor="name">Specjalista ds. zarządzania rehabilitacją</label></div>
													<Autocomplete
														disabled={true}
														className={classes.name_select_box}
														id="name"
														onChange={(event, value) => setOrkPerson(value)}
														value={ork_person}
														options={orkPersonList}
														getOptionLabel={(option) => participantList && option && option.name}
														renderInput={(params) => <TextField {...params} variant="outlined" InputLabelProps={{ shrink: false }} />}
													/>
												</Grid>
												<Grid item xs={12}>
													<div className={classes.top_label}><label htmlFor="profession">Wybrany zawod</label></div>
													<input className={classes.input_box} type="name" value={profession} name="name" id="profession" disabled={true} />
												</Grid>
											</Grid>
										</Grid>
									</Grid>
									:
									<></>
							}
						</Card>
						<div className={classes.second_form}>
							<Card className={classes.form}>
								<Grid container spacing={3}>
									<Grid item xs={3}/>
									<Grid item xs={6}>
										<Grid container spacing={2}>
											<Grid item xs={4} className={classes.service}>
												<div style={{display: 'flex', justifyContent: 'center'}}>
													Okres probny
												</div>
												<Grid container spacing={3} className={classes.form_service_title}>
													<Grid item xs={6}>
														plan
													</Grid>
													<Grid item xs={6}>
														realizacja
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={4} className={classes.service}>
												<div style={{display: 'flex', justifyContent: 'center'}}>
													Okres podstawowy
												</div>
												<Grid container spacing={3} className={classes.form_service_title}>
													<Grid item xs={6}>
														plan
													</Grid>
													<Grid item xs={6}>
														realizacja
													</Grid>
												</Grid>
											</Grid>
											<Grid item xs={2} className={classes.service}>
												suma wsparcia w ORK
											</Grid>
										</Grid>
									</Grid>
									<Grid item xs={3} className={classes.service}>
										<div className={classes.form_service_title_end}>
											<label htmlFor="value_balance">
												Działania zaplanowane po wyjściu
											</label>
										</div>
									</Grid>
									{
										dataList.map((module, index_module) => (
											<>
												<Grid item xs={3} className={classes.module}>
													{module.name}
												</Grid>
												<Grid item xs={9}/>
												{
													module.service_lists.map((item, index_service) => (
														<>
															<Grid item xs={3} className={classes.service}>{item.name}</Grid>
															<Grid item xs={6}>
																<Grid container spacing={3}>
																	<Grid item xs={2}>
																		{
																			getPlanTrial(item)
																		}
																	</Grid>
																	<Grid item xs={2}>
																		{
																			getScheduleTrial(item)
																		}
																	</Grid>
																	<Grid item xs={2}>
																		{
																			getPlanBasic(item)
																		}
																	</Grid>
																	<Grid item xs={2}>
																		{
																			getScheduleBasic(item)
																		}
																	</Grid>
																	<Grid item xs={2}>
																		{
																			parseInt(getScheduleTrial(item)) + parseInt(getScheduleBasic(item))
																		}
																	</Grid>
																</Grid>
															</Grid>
															<Grid item xs={3}>
																<input className={classes.input_box} type="name" value={item.balance.amount} name="name" id="value_balance" onChange={(e) => handleChangeBalanceAmount(e.target.value, index_module, index_service)}/>
															</Grid>
															<Grid item xs={4} className={classes.service}>Uwagi dotyczace realizacji wsparcia (zmiany, odstepstwa od IPR, powody opoznien realizacji ...)</Grid>
															<Grid item xs={8}>
																<input className={classes.input_box} aria-label="remark" type="name" value={item.balance.remarks} name="name" onChange={(e) => handleChangeBalanceRemark(e.target.value, index_module, index_service)}/>
															</Grid>
															<div className={classes.divide}/>
														</>
													))
												}
											</>
										))
									}
									<Grid item xs={3} className={classes.total_label}>
										<Grid container justifyContent="end">
											Podsumowanie wsparcia
										</Grid>
									</Grid>
									<Grid item xs={6}>
										<Grid container spacing={3}>
											<Grid item xs={2}>
												{sumPlanTrial}
											</Grid>
											<Grid item xs={2}>
												{sumScheduleTrial}
											</Grid>
											<Grid item xs={2}>
												{sumPlanBasic}
											</Grid>
											<Grid item xs={2}>
												{sumScheduleBasic}
											</Grid>
											<Grid item xs={2}>
												{parseInt(sumScheduleBasic) + parseInt(sumScheduleTrial)}
											</Grid>
										</Grid>
									</Grid>
									<Grid item xs={3}>
										{sumBalance}
									</Grid>
								</Grid>
							</Card>
						</div>

					</Grid>
					<Grid item xs={3}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item xs={6}>
									<Button variant="outlined" color="secondary" className={classes.btnOption} onClick={handleDelete}>
										<DeleteIcon />
									</Button>
								</Grid>
								<Grid item xs={6}>
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

export default IprBalance;
