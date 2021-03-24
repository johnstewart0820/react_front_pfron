import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
	Button, Grid, Card, CircularProgress, TextareaAutosize, FormControl, RadioGroup, Radio, FormControlLabel, Checkbox
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'
import { Link } from 'react-router-dom';
import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import candidate from '../../apis/candidate';
import {
	KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { pl } from 'date-fns/locale'
import DateFnsUtils from '@date-io/date-fns';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './tab.css';
import clsx from 'clsx';
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined';
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import { DeleteModal } from '../Candidates/components';
import { FirstStepView, FourthStepView, SecondStepView, ThirdStepView } from './components';
import { useTheme } from '@material-ui/styles';
const CandidatesFourthStep = props => {
	const { children } = props;
	const id = props.match.params.id;
	const { history } = props;
	const classes = useStyles();
	const { addToast } = useToasts()
	const breadcrumbs = [{ active: true, label: 'Kandydaci', href: '/candidates' }, { active: false, label: 'Karta informacyjna' }];
	const [stage, setStage] = useState(0);
	const [stageList, setStageList] = useState([]);
	const [status, setStatus] = useState(0);
	const [statusList, setStatusList] = useState([]);
	const [comment, setComment] = useState('');
	const [date_referal, setDateReferal] = useState(new Date());
	const [rehabitation_center, setRehabitationCenter] = useState(0);
	const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
	const [participant_number, setParticipantNumber] = useState('');
	const [date_rehabitation_center, setDateRehabitationCenter] = useState(new Date());
	const [typeToStayList, setTypeToStayList] = useState([{ id: 1, name: 'Stacjonarny' }, { id: 2, name: 'Niestacjonarny' }])
	const [type_to_stay, setTypeToStay] = useState(0);
	const [participant_remark, setParticipantRemark] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);
	const [error, setError] = useState({});
	const [openModal, setOpenModal] = useState(false);
	const theme = useTheme();

	const handleHistory = () => {
		history.push(`/candidates/history/${id}`)
	}

	const handlePreview = () => {
		history.push(`/candidates/preview_info/${id}`);
	}

	const handleDelete = () => {
		setProgressStatus(true);
		candidate
			.delete(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true })
					if (response.code === 200) {
						setTimeout(function () { history.push('/candidates'); }, 1000);
					}
					setProgressStatus(false);
				}
			})
	}

	const handleCloseModal = () => {
		setOpenModal(false);
	}

	useEffect(() => {
		candidate.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setStageList(response.data.stage);
					setStatusList(response.data.status);
					setRehabitationCenterList(response.data.rehabitation_center);
				}
			})
	}, []);

	useEffect(() => {
		setProgressStatus(true);
		candidate.getCandidateInfo(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setStage(response.data.candidate.stage);
					setStatus(response.data.candidate.id_status);
					setDateReferal(response.data.candidate_info.date_referal);
					setRehabitationCenter(response.data.candidate_info.rehabitation_center);
					setParticipantNumber(response.data.candidate_info.participant_number);
					setDateRehabitationCenter(response.data.candidate_info.date_rehabitation_center);
					setTypeToStay(response.data.candidate_info.type_to_stay);
					setParticipantRemark(response.data.candidate_info.participant_remark ? response.data.candidate_info.participant_remark : '');
				}
				setProgressStatus(false);
			})

	}, [rehabitationCenterList]);

	const handleBack = () => {
		history.push('/candidates');
	}

	const handleProfile = () => {
		history.push(`/candidates/edit/${id}`)
	}

	const handleSave = () => {
		if (checkError()) {
			addToast(<label>Proszę wypełnić wszystkie wymagane pola.</label>, { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
			handleError();
		} else {
			setProgressStatus(true);
			if (parseInt(rehabitation_center) == 0 || isNaN(rehabitation_center))
				candidate.updateCandidateStep4(
					comment, false, date_referal,
					rehabitation_center, participant_number, date_rehabitation_center, type_to_stay, participant_remark, id)
					.then(response => {
						if (response.code === 401) {
							history.push('/login');
						} else {
							addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true })
							if (response.code === 200) {
								setTimeout(function () { history.push('/candidates'); }, 1000);
							}
							setProgressStatus(false);
						}
					})
			else
				candidate.updateCandidateStep4(
					comment, true, date_referal,
					rehabitation_center, participant_number, date_rehabitation_center, type_to_stay, participant_remark, id)
					.then(response => {
						if (response.code === 401) {
							history.push('/login');
						} else {
							addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true })
							if (response.code === 200) {
								setTimeout(function () { history.push('/candidates'); }, 1000);
							}
							setProgressStatus(false);
						}
					})
		}
	}

	const handleError = () => {
		let _error = {}
		_error.comment = (comment.length === 0);
		_error.stage = (parseInt(stage) === 0);
		setError(_error);
	}

	const checkError = () => {
		return (comment.length === 0) || (parseInt(stage) === 0);
	}

	const handleChangeComment = (value) => {
		setComment(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.comment = (value.length === 0);
		setError(_error);
	}

	const handleChangeStage = (value) => {
		setStage(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.stage = (parseInt(value) === 0);
		setError(_error);
	}

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Breadcrumb list={breadcrumbs} />
					<div style={{ display: 'flex' }}>
						<Button variant="outlined" color="secondary" className={classes.btnProfile} onClick={handleProfile}>
							Wróć do edycji profilu
          </Button>
						<Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleBack}>
							Wróć do listy kandydatow
          </Button>
					</div>
				</div>
				<Grid container spacing={3} className={classes.formBlock}>
					<Grid item xs={9}>
						<Tabs defaultIndex={3}>
							<TabList>
								<Tab disabled><Link to={`#`} className={classes.button}>ETAP 1</Link></Tab>
								<Tab disabled><Link to={`#`} className={classes.button} disabled>ETAP 2</Link></Tab>
								<Tab disabled><Link to={`#`} className={classes.button} disabled>ETAP 3</Link></Tab>
								<Tab><Link to={`#`} className={classes.button} disabled>ETAP 4</Link></Tab>
							</TabList>
							<TabPanel>
							</TabPanel>
							<TabPanel>
							</TabPanel>
							<TabPanel>
							</TabPanel>
							<TabPanel style={{ backgroundColor: theme.palette.black_white }}>
								<FourthStepView
									date_referal={date_referal}
									setDateReferal={setDateReferal}
									rehabitation_center={rehabitation_center}
									setRehabitationCenter={setRehabitationCenter}
									rehabitationCenterList={rehabitationCenterList}
									participant_number={participant_number}
									setParticipantNumber={setParticipantNumber}
									date_rehabitation_center={date_rehabitation_center}
									setDateRehabitationCenter={setDateRehabitationCenter}
									typeToStayList={typeToStayList}
									type_to_stay={type_to_stay}
									setTypeToStay={setTypeToStay}
									participant_remark={participant_remark}
									setParticipantRemark={setParticipantRemark}
								/>
							</TabPanel>
						</Tabs>
					</Grid>
					<Grid item xs={3}>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Card className={classes.form}>
									<Grid container spacing={3}>
										<Grid item xs={12}>
											<div className={classes.top_label} htmlFor="name">Etap</div>
											<SingleSelect value={stage} list={stageList} disabled={true} />
											<div className={classes.top_label} htmlFor="name">Status</div>
											<SingleSelect value={status} list={statusList} disabled={true} />
											<div className={classes.input_box_label} htmlFor="name">Komentarz dotyczący edycji (max 100 znaków)</div>
											<TextareaAutosize className={clsx({ [classes.textArea]: true, [classes.error]: error.comment })} value={comment} rowsMin={10} onChange={(e) => handleChangeComment(e.target.value)} placeholder="Utworzenie profilu uczestnika" />
											<Grid container spacing={2}>
												<Grid item xs={4}>
													<Button variant="outlined" color="secondary" className={classes.btnOption} onClick={handleHistory}>
														<HistoryOutlinedIcon />
													</Button>
												</Grid>
												<Grid item xs={4}>
													<Button variant="outlined" color="secondary" className={classes.btnOption} onClick={handlePreview}>
														<FindInPageOutlinedIcon />
													</Button>
												</Grid>
												<Grid item xs={4}>
													<Button variant="outlined" color="secondary" className={classes.btnOption} onClick={handleDelete}>
														<DeleteIcon />
													</Button>
												</Grid>
											</Grid>
											<Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleSave}>
												Zapisz
                    </Button>
										</Grid>
									</Grid>
								</Card>
							</Grid>
						</Grid>
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

export default CandidatesFourthStep;
