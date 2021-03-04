import React, { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
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

import PictureAsPdfOutlinedIcon from '@material-ui/icons/PictureAsPdfOutlined';
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreOutlinedIcon from '@material-ui/icons/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@material-ui/icons/ExpandLessOutlined';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './tab.css';

import {PlanView, ScheduleView} from './components';

const IprPlan = props => {
	const id = props.match.params.id;
	const [openModal, setOpenModal] = useState(false);
	const { history } = props;
	const classes = useStyles();
	const { addToast } = useToasts()
	const breadcrumbs = [{ active: true, label: 'Uczestnicy', href: '/participants' }, { active: true, label: 'Lista IPR', href: '/ipr_list' }, { active: false, label: 'Plan realizacji IPR' }];
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

	const [progressStatus, setProgressStatus] = useState(false);
	const [error, setError] = useState({});

	useEffect(() => {
		ipr.getPlanInfo(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					let _arr = [];
					for (let i = 0; i < response.data.module.length; i ++) {
						let item = response.data.module[i];
						item.plan = [];
						for (let j = 0; j < response.data.plan.length; j ++) {
							if (response.data.module[i].id === response.data.plan[j].module) {
								response.data.plan[j].new = 'false';
								if (response.data.plan[j].start_date === null) {
									let _date = new Date();
									response.data.plan[j].start_date = _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' +_date.getDate()
								} else {
									let _date = new Date(response.data.plan[j].start_date);
									response.data.plan[j].start_date = _date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' +_date.getDate()
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
					for (let i = 0; i < participantList.length; i ++) {
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
					for (let i = 0; i < response.data.ork_person.length; i ++) {
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
		if (selectedItem == 0) {
			setProgressStatus(true);
			ipr.updatePlan(moduleList, id)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						addToast(response.message, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true })
						if (response.code === 200) {
							setTimeout(function () { history.push('/ipr_list'); }, 1000);
						}
						setProgressStatus(false);
					}
				})
		} else {
			
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
					addToast(response.message, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true })
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

	}

	const toggleView = () => {
		setShowStatus(!show_status);
	}

	const handleCloseModal = () => {
		setOpenModal(false);
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
								<div style={{display: 'flex', justifyContent: 'space-between'}}>
									<div>Dane IPR</div>
									<div onClick={toggleView}>
										{ show_status ? <ExpandLessOutlinedIcon/> : <ExpandMoreOutlinedIcon/>}
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
										<SingleSelect value={ipr_type} list={iprTypeList} disabled={true}/>
									</Grid>
									<Grid item xs={2}>
										<div className={classes.top_label} htmlFor="name">Numer</div>
										<div className={classes.number}>{number}</div>
									</Grid>
									<Grid item xs={5}>
										<div className={classes.top_label} htmlFor="name">Data wypelnienia</div>
										<KeyboardDatePicker
											disableToolbar
											disabled={true}
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
										<div className={classes.top_label} htmlFor="name">Specjalista ds. zarzadzania rehabilitacja</div>
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
										<div className={classes.top_label} htmlFor="name">Wybrany zawod</div>
										<input className={classes.input_box} type="name" value={profession} name="name" disabled={true}/>
									</Grid>
								</Grid>
							</Grid>
							</Grid>
							:
							<></>
						}
					</Card>
					<div className={classes.second_form	}>
						<Tabs onSelect={setSelectedItem}>
							<TabList >
								<Tab style={{width: '50%'}}>PLAN REALIZACJI</Tab>
								<Tab style={{width: '50%'}}>HARMONOGRAMY TYGODNIOWE</Tab>
							</TabList>
							<TabPanel>
								<PlanView
									moduleList={moduleList}
									setModuleList={setModuleList}
								/>
							</TabPanel>
							<TabPanel>
								<ScheduleView/>
							</TabPanel>
						</Tabs>
					</div>
					
				</Grid>
				<Grid item xs={3}>
					<Card className={classes.form}>
						<Grid container spacing={3}>
							<Grid item xs={4}>
								<Button variant="outlined" color="secondary" className={classes.btnOption} onClick={handleExportPdf}>
								<PictureAsPdfOutlinedIcon/>
								</Button>
							</Grid>
							<Grid item xs={4}>
								<Button variant="outlined" color="secondary" className={classes.btnOption} onClick={handlePreview}>
								<FindInPageOutlinedIcon/>
								</Button>
							</Grid>
							<Grid item xs={4}>
								<Button variant="outlined" color="secondary" className={classes.btnOption} onClick={handleDelete}>
								<DeleteIcon/>
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
