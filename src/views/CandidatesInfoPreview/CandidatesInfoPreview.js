import React, { useState, useRef, useEffect } from 'react';
import useStyles from './style';
import {
	Button, Grid, Card, CircularProgress, TextareaAutosize, FormControl, RadioGroup, Radio, FormControlLabel, Checkbox
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'

import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import candidate from '../../apis/candidate';
import {
	KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { pl } from 'date-fns/locale'
import DateFnsUtils from '@date-io/date-fns';
import 'react-phone-input-2/lib/plain.css'
import PictureAsPdfOutlinedIcon from '@material-ui/icons/PictureAsPdfOutlined';
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import { DeleteModal } from '../Candidates/components';
import domtopdf from 'dom-to-pdf';

const CandidatesInfoPreview = props => {
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
	
	const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [person_id, setPersonId] = useState('');
	const [qualification_point, setQualificationPoint] = useState(0);
  const [qualificationPointList, setQualificationPointList] = useState([]);
  const [gender, setGender] = useState(0);
	
	const [doctor, setDoctor] = useState(0);
  const [doctorList, setDoctorList] = useState([]);
  const [psycology, setPsycology] = useState(0);
  const [psycologyList, setPsycologyList] = useState([]); 
  const [admission, setAdmission] = useState(0);
  const [doctor_recommendation, setDoctorRecommendation] = useState(0);
  const [doctor_date, setDoctorDate] = useState(new Date());
  const [doctor_remark, setDoctorRemark] = useState('');
  const [psycology_recommendation, setPsycologyRecommendation] = useState(0);
  const [psycology_date, setPsycologyDate] = useState(new Date());
  const [psycology_remark, setPsycologyRemark] = useState('');

	const [decision_central_commision, setDecisionCentralCommision] = useState(0);
  const [date_central_commision, setDateCentralCommision] = useState(new Date());
  const [general_remark, setGeneralRemark] = useState('');

	const [date_referal, setDateReferal] = useState(new Date());
	const [rehabitation_center, setRehabitationCenter] = useState(0);
	const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
	const [participant_number, setParticipantNumber] = useState('');
	const [date_rehabitation_center, setDateRehabitationCenter] = useState(new Date());
	const [typeToStayList, setTypeToStayList] = useState([{ id: 1, name: 'Stacjonarny' }, { id: 2, name: 'Niestacjonarny' }])
	const [type_to_stay, setTypeToStay] = useState(0);
	const [participant_remark, setParticipantRemark] = useState('');

	const [progressStatus, setProgressStatus] = useState(false);
	const [openModal, setOpenModal] = useState(false);
  const chart = useRef(null);

	const handleExportPdf = () => {
		const dom = chart.current;
    var options = {
      filename: 'download.pdf'
    };
    domtopdf(dom, options, function() {
    });
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
          setQualificationPointList(response.data.qualification_point);
					setRehabitationCenterList(response.data.rehabitation_center);
        }
      })
  }, []);

	useEffect(() => {
		candidate.getMarker(qualification_point)
		.then(response => {
			if (response.code === 401) {
				history.push('/login');
			} else {
				setDoctorList(response.data.doctor);
				setPsycologyList(response.data.psycology);
			}
		});
	}, [qualification_point]);

  useEffect(() => {
    setProgressStatus(true);

    candidate.getCandidateInfo(id)
    .then(response => {
      if (response.code === 401) {
        history.push('/login');
      } else {
        setStage(response.data.candidate.stage);
				setStatus(response.data.candidate.status);
        setQualificationPoint(response.data.candidate.qualification_point);
        setName(response.data.candidate.name);
        setSurname(response.data.candidate.surname);
        setPersonId(response.data.candidate.person_id);
        setGender(parseInt(response.data.candidate_info.gender));

				setAdmission(parseInt(response.data.candidate_info.admission));
        setDoctorRecommendation(parseInt(response.data.candidate_info.doctor_recommendation));
        setDoctorRemark(response.data.candidate_info.doctor_remark ? response.data.candidate_info.doctor_remark : '');
        setDoctor(response.data.candidate_info.doctor);
        setDoctorDate(response.data.candidate_info.doctor_date);
        setPsycologyRecommendation(parseInt(response.data.candidate_info.psycology_recommendation));
        setPsycologyRemark(response.data.candidate_info.psycology_remark ? response.data.candidate_info.psycology_remark : '');
        setPsycology(response.data.candidate_info.psycology);
        setPsycologyDate(response.data.candidate_info.psycology_date);

				setDecisionCentralCommision(parseInt(response.data.candidate_info.decision_central_commision));
        setDateCentralCommision(response.data.candidate_info.date_central_commision);
        setGeneralRemark(response.data.candidate_info.general_remark ? response.data.candidate_info.general_remark : '');

				setDateReferal(response.data.candidate_info.date_referal);
				setRehabitationCenter(response.data.candidate_info.rehabitation_center);
				setParticipantNumber(response.data.candidate_info.participant_number);
				setDateRehabitationCenter(response.data.candidate_info.date_rehabitation_center);
				setTypeToStay(response.data.candidate_info.type_to_stay);
				setParticipantRemark(response.data.candidate_info.participant_remark ? response.data.candidate_info.participant_remark : '');
			}
			setProgressStatus(false);
    })
   
  }, [qualificationPointList]);

	const handleBack = () => {
		history.push('/candidates');
	}

	const handleEdit = () => {
		history.push(`/candidates/info/step${stage}/${id}`)
	}
	const getDateStr = (value) => {
		let _date = new Date(value);
		let date = _date.getDate();
		let month = _date.getMonth() + 1;
		let year = _date.getFullYear();
		if (parseInt(date) < 10)
			date = '0' + date;
		if (parseInt(month) < 10)
			month = '0' + month;
		return date + '/' + month + '/' + year;
	}

	const getSingleSelectName = (list, index) => {
		let result = '';
		if (list.length === 0 || index === 0)
			return result;
		for (let i = 0; i < list.length; i ++) {
			if (parseInt(list[i].id) === parseInt(index)) {
				return list[i].name;
			}
		}
		return result;
	}

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Breadcrumb list={breadcrumbs} />
					<div>
						<Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleEdit}>
							Edytuj kartę informacyjną
						</Button>
						<Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleBack}>
							Wróć do listy kandydatow
						</Button>
					</div>
				</div>
				<Grid container spacing={3} className={classes.formBlock}>
					<Grid item xs={9}>
						<Card className={classes.form} ref={chart}>
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Dane kandydata
              	</Grid>
								<Grid item xs={9}>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Imię(Imiona)</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{name}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Nazwisko</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{surname}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">PESEL</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{person_id}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Płeć</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{parseInt(gender) === 1 ? 'Kobieta' : parseInt(gender) === 2 ? 'Męźczyzna' : ''}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Punkt kwalifikacyjny</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{getSingleSelectName(qualificationPointList, qualification_point)}</div></Grid>
									</Grid>
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Decyzje
              	</Grid>
								<Grid item xs={9}>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Rekomendacja lekarza</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{doctor_recommendation === 1 ? 'TAK' : doctor_recommendation === 2 ? 'NIE' : 'NIE MOŻNA STWIERDZIĆ'}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Orzeczenie o kwalifikacji z dnia</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{getDateStr(doctor_date)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Imię i nazwisko lekarza</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{getSingleSelectName(doctorList, doctor)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label_header} htmlFor="name">Uwagi od lekarza</div></Grid>
										<Grid item xs={12}><div className={classes.top_label} htmlFor="name" dangerouslySetInnerHTML={{__html: doctor_remark}}></div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Rekomendacja psychologa</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{psycology_recommendation === 1 ? 'TAK' : psycology_recommendation === 2 ? 'NIE' : 'NIE MOŻNA STWIERDZIĆ'}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Orzeczenie o kwalifikacji z dnia</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{getDateStr(psycology_date)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Imię i nazwisko psychologa</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{getSingleSelectName(psycologyList, psycology)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label_header} htmlFor="name">Uwagi od psychologa</div></Grid>
										<Grid item xs={12}><div className={classes.top_label} htmlFor="name" dangerouslySetInnerHTML={{__html: psycology_remark}}></div></Grid>
									</Grid>
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Decyzja komisji centralnej
              	</Grid>
								<Grid item xs={9}>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Decyzja komisji centralnej</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{decision_central_commision === 1 ? 'TAK' : decision_central_commision === 2 ? 'NIE' : ''}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Z dnia</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{getDateStr(date_central_commision)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Uwagi ogólne</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name" dangerouslySetInnerHTML={{__html: general_remark}}></div></Grid>
									</Grid>
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Skierowanie do ORK
              	</Grid>
								<Grid item xs={9}>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Data skierowania</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{getDateStr(date_referal)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Skierowanie do ORK</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{getSingleSelectName(rehabitationCenterList, rehabitation_center)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Numer uczestnika</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{participant_number}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Data wejscia do ORK</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{getDateStr(date_rehabitation_center)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Tryb pobytu uczestnika</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{getSingleSelectName(typeToStayList, type_to_stay)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label_header} htmlFor="name">Uwagi</div></Grid>
										<Grid item xs={12}><div className={classes.top_label} htmlFor="name" dangerouslySetInnerHTML={{__html: participant_remark}}></div></Grid>
									</Grid>
								</Grid>
							</Grid>
						</Card>
					</Grid>
					<Grid item xs={3}>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Card className={classes.form}>
									<Grid container spacing={3}>
										<Grid item xs={12}>
											<Grid container spacing={2}>
												<Grid item xs={6}>
													<Button variant="outlined" color="secondary" className={classes.btnControl} onClick={handleExportPdf}>
														<PictureAsPdfOutlinedIcon />
													</Button>
												</Grid>
												<Grid item xs={6}>
													<Button variant="outlined" color="secondary" className={classes.btnControl} onClick={handleDelete}>
														<DeleteIcon />
													</Button>
												</Grid>
											</Grid>
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

export default CandidatesInfoPreview;
