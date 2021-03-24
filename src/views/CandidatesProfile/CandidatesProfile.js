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

const CandidatesProfile = props => {
	const { children } = props;
	const id = props.match.params.id;
	const { history } = props;
	const classes = useStyles();
	const { addToast } = useToasts()
	const breadcrumbs = [{ active: true, label: 'Kandydaci', href: '/candidates' }, { active: false, label: 'Dodaj kandydata' }];
	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [person_id, setPersonId] = useState('');
	const [date_of_birth, setDateOfBirth] = useState(new Date());
	const [place_of_birth, setPlaceOfBirth] = useState('');
	const [street, setStreet] = useState('');
	const [house_number, setHouseNumber] = useState('');
	const [apartment_number, setApartmentNumber] = useState('');
	const [post_code, setPostCode] = useState('');
	const [post_office, setPostOffice] = useState('');
	const [city, setCity] = useState('');
	const [second_street, setSecondStreet] = useState('');
	const [second_house_number, setSecondHouseNumber] = useState('');
	const [second_apartment_number, setSecondApartmentNumber] = useState('');
	const [second_post_code, setSecondPostCode] = useState('');
	const [second_post_office, setSecondPostOffice] = useState('');
	const [second_city, setSecondCity] = useState('');
	const [stage, setStage] = useState(0);
	const [stageList, setStageList] = useState([]);
	const [status, setStatus] = useState(0);
	const [statusList, setStatusList] = useState([]);
	const [voivodeship, setVoivodeship] = useState(0);
	const [voivodeshipList, setVoivodeshipList] = useState([]);
	const [community, setCommunity] = useState(0);
	const [communityList, setCommunityList] = useState([]);
	const [communityTotalList, setCommunityTotalList] = useState([]);
	const [county, setCounty] = useState(0);
	const [countyList, setCountyList] = useState([]);
	const [countyTotalList, setCountyTotalList] = useState([]);
	const [comment, setComment] = useState('');
	const [mobile_phone, setMobilePhone] = useState('');
	const [home_phone, setHomePhone] = useState('');
	const [email, setEmail] = useState('');
	const [family_mobile_phone, setFamilyMobilePhone] = useState('');
	const [family_home_phone, setFamilyHomePhone] = useState('');
	const [educationList, setEducationList] = useState([]);
	const [education, setEducation] = useState(1);
	const [academic_title, setAcademicTitle] = useState('');
	const [stay_status, setStayStatus] = useState(2);
	const [children_applicable, setChildrenApplicable] = useState(false);
	const [children_amount, setChildrenAmount] = useState('0');
	const [children_age, setChildrenAge] = useState('');
	const [employed_status, setEmployedStatus] = useState(2);
	const [employed_type, setEmployedType] = useState([false, false, false, false, false]);
	const [employed_type_list, setEmployedTypeList] = useState([]);
	const [employed_in, setEmployedIn] = useState('');
	const [occupation, setOccupation] = useState('');
	const [unemployed_status, setUnemployedStatus] = useState(2);
	const [have_unemployed_person_status, setHaveUnemployedPersonStatus] = useState(2);
	const [unemployed_person_id, setUnemployedPersonId] = useState('');
	const [long_term_employed_status, setLongTermEmployedStatus] = useState(2);
	const [seek_work_status, setSeekWorkStatus] = useState(2);
	const [passive_person_status, setPassivePersonStatus] = useState(2);
	const [full_time_status, setFullTimeStatus] = useState(2);
	const [evening_student_status, setEveningStudentStatus] = useState(2);
	const [disabled_person_status, setDisabledPersonStatus] = useState(2);
	const [number_certificate, setNumberCertificate] = useState('0');
	const [date_of_certificate, setDateOfCertificate] = useState(new Date());
	const [level_certificate, setLevelCertificate] = useState('');
	const [code_certificate, setCodeCertificate] = useState('');
	const [necessary_certificate, setNecessaryCertificate] = useState('');
	const [ethnic_minority_status, setEthnicMinorityStatus] = useState(2);
	const [homeless_person_status, setHomelessPersonStatus] = useState(2);
	const [stay_house_status, setStayHouseStatus] = useState(2);
	const [house_hold_status, setHouseHoldStatus] = useState(2);
	const [house_hold_adult_status, setHouseHoldAdultStatus] = useState(2);
	const [uncomfortable_status, setUncomfortableStatus] = useState(2);
	const [progressStatus, setProgressStatus] = useState(false);
	const [error, setError] = useState({});
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

	const handleHistory = () => {
		history.push(`/candidates/history/${id}`)
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
					setVoivodeshipList(response.data.voivodeship);
					setCommunityTotalList(response.data.community);
					setCountyTotalList(response.data.county);
					setEducationList(response.data.education);
					setEmployedTypeList(response.data.employed_type);
				}
			})

		let _date = new Date();
		setDateOfBirth(_date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + (_date.getDate()));
		setDateOfCertificate(_date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + (_date.getDate()));
	}, []);

	useEffect(() => {
		setProgressStatus(true);
		candidate.get(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setName(response.data.candidate.name);
					setSurname(response.data.candidate.surname);
					setPersonId(response.data.candidate.person_id);
					setDateOfBirth(response.data.candidate.date_of_birth);
					setPlaceOfBirth(response.data.candidate.place_of_birth);
					setStreet(response.data.candidate.street);
					setHouseNumber(response.data.candidate.house_number);
					setApartmentNumber(response.data.candidate.apartment_number);
					setPostCode(response.data.candidate.post_code);
					setPostOffice(response.data.candidate.post_office);
					setCity(response.data.candidate.city);
					setSecondStreet(response.data.candidate.second_street);
					setSecondHouseNumber(response.data.candidate.second_house_number);
					setSecondApartmentNumber(response.data.candidate.second_apartment_number);
					setSecondPostCode(response.data.candidate.second_post_code);
					setSecondPostOffice(response.data.candidate.second_post_office);
					setSecondCity(response.data.candidate.second_city);
					setVoivodeship(response.data.candidate.voivodeship);
					setCounty(response.data.candidate.county);
					setCommunity(response.data.candidate.community);

					setMobilePhone(response.data.candidate.mobile_phone);
					setHomePhone(response.data.candidate.home_phone);
					setEmail(response.data.candidate.email);
					setFamilyMobilePhone(response.data.candidate.family_mobile_phone);
					setFamilyHomePhone(response.data.candidate.family_home_phone);
					setEducation(parseInt(response.data.candidate.education));
					setAcademicTitle(response.data.candidate.academic_title);
					setStayStatus(parseInt(response.data.candidate.stay_status));
					setChildrenApplicable(parseInt(response.data.candidate.children_applicable));
					setChildrenAmount(response.data.candidate.children_amount);
					setChildrenAge(response.data.candidate.children_age);
					setEmployedStatus(parseInt(response.data.candidate.employed_status));
					setEmployedType(response.data.candidate.employed_type.split(','));
					setEmployedIn(response.data.candidate.employed_in);
					setOccupation(response.data.candidate.occupation);
					setUnemployedStatus(parseInt(response.data.candidate.unemployed_status));
					setHaveUnemployedPersonStatus(parseInt(response.data.candidate.have_unemployed_person_status));
					setUnemployedPersonId(response.data.candidate.unemployed_person_id);
					setLongTermEmployedStatus(parseInt(response.data.candidate.long_term_employed_status));
					setSeekWorkStatus(parseInt(response.data.candidate.seek_work_status));
					setPassivePersonStatus(parseInt(response.data.candidate.passive_person_status));
					setFullTimeStatus(parseInt(response.data.candidate.full_time_status));
					setEveningStudentStatus(parseInt(response.data.candidate.evening_student_status));
					setDisabledPersonStatus(parseInt(response.data.candidate.disabled_person_status));
					setNumberCertificate(response.data.candidate.number_certificate);
					setDateOfCertificate(response.data.candidate.date_of_certificate);
					setLevelCertificate(response.data.candidate.level_certificate);
					setCodeCertificate(response.data.candidate.code_certificate);
					setNecessaryCertificate(response.data.candidate.necessary_certificate);
					setEthnicMinorityStatus(parseInt(response.data.candidate.ethnic_minority_status));
					setHomelessPersonStatus(parseInt(response.data.candidate.homeless_person_status));
					setStayHouseStatus(parseInt(response.data.candidate.stay_house_status));
					setHouseHoldStatus(parseInt(response.data.candidate.house_hold_status));
					setHouseHoldAdultStatus(parseInt(response.data.candidate.house_hold_adult_status));
					setUncomfortableStatus(parseInt(response.data.candidate.uncomfortable_status));
					setStage(response.data.candidate.stage);
					setStatus(response.data.candidate.id_status);
				}
				setProgressStatus(false);
			})

	}, [employed_type_list]);

	const handleGotoInformation = () => {
		history.push(`/candidates/info/step${stage}/${id}`)
	}

	const handleBack = () => {
		history.push('/candidates');
	}

	const handleEdit = () => {
		history.push(`/candidates/edit/${id}`);
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

	const getStrFromList = (id, list) => {
		let result = '';
		for (let i = 0; i < list.length; i ++) {
			if (parseInt(list[i].id) === parseInt(id))
				result = list[i].name;
		}
		return result;
	}

	const getEmployedStatus = (list, list_type) => {
		let result = [];
		if (list.length === 0 || list_type.length === 0)
			return result.join('');
		for (let i = 0; i < list.length; i ++) {
			if (parseInt(list_type[i]) === 1) {
				result.push(list[i].name);
			}
		}
		return result.join(', ');
	}

	const getStatus = (status) => {
		let list = ['TAK', 'NIE', 'ODMOWA INFORMACJI'];
		if (status)
			return list[parseInt(status - 1)];
		return '';
	}

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Breadcrumb list={breadcrumbs} />
					<div>
						<Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleEdit}>
							Edytuj kandydata
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
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Data urodzenia</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{getDateStr(date_of_birth)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Miejsce urodzenia</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{place_of_birth}</div></Grid>
									</Grid>
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Adres zameldowania
              	</Grid>
								<Grid item xs={9}>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{`${street} ${house_number}/${apartment_number}`}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{`${post_code} ${city}`}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{`poczta: ${post_office}`}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Województwo</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{getStrFromList(voivodeship, voivodeshipList)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Powiat</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{getStrFromList(county, countyTotalList)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Gmina</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{getStrFromList(community, communityTotalList)}</div></Grid>
									</Grid>
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Dane kontaktowe
              	</Grid>
								<Grid item xs={9}>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Telefon komórkowy</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{`+${mobile_phone}`}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Telefon domowy</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{home_phone}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Adres e-mail</div></Grid>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{email}</div></Grid>
									</Grid>
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Wykształcenie
              	</Grid>
								<Grid item xs={9}>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label_header} htmlFor="name">{educationList.length > 0 && educationList[education - 1].name}</div></Grid>
									</Grid>
									{
										education === 10 ?
											<Grid container spacing={2}>
												<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Tytuł naukowy</div></Grid>
												<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{academic_title}</div></Grid>
											</Grid>
											:
											<></>
									}
									<div className={classes.error_label} style={{ display: error.education ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Tryb pobytu
              	</Grid>
								<Grid item xs={9}>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label_header} htmlFor="name">Ze względów logistycznych (brak możliwości codziennych dojazdów) deklaruję pobyt stacjonarny w Ośrodku Kompleksowej Rehabilitacji</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{stay_status === 1 ? "TAK" : "NIE"}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label_header} htmlFor="name">Jestem jedynym opiekunem prawnym dzieci, które musza przebywać ze mną</div></Grid>
									</Grid>
									{
										children_applicable ?
											<>
												<Grid container spacing={2}>
													<Grid item xs={4}><div className={classes.top_label} htmlFor="name">Liczba dzieci</div></Grid>
													<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{children_amount}</div></Grid>
												</Grid>
												<Grid container spacing={2}>
													<Grid item xs={4}><div className={classes.top_label} htmlFor="name">Wiek</div></Grid>
													<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{children_age}</div></Grid>
												</Grid>
											</>
											:
											<></>
									}
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item xs={3} >
									<div className={classes.form_title}>
										Status na rynku pracy
               		</div>
									<div className={classes.form_title_small}>
										(proszę zazaczyć właściwy)
                	</div>
								</Grid>
								<Grid item xs={9}>
									{
										employed_status === 1 ?
										<>
											<Grid container spacing={2}>
												<Grid item xs={12}><div className={classes.top_label_header} htmlFor="name">{`Jestem zatrudniony: ${getEmployedStatus(employed_type_list, employed_type)}`}</div></Grid>
											</Grid>
											<Grid container spacing={2}>
												<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Jestem zatrudniony w</div></Grid>
												<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{employed_in}</div></Grid>
											</Grid>
											<Grid container spacing={2}>
												<Grid item xs={4}><div className={classes.top_label_header} htmlFor="name">Wykonywany zawód</div></Grid>
												<Grid item xs={4}><div className={classes.top_label} htmlFor="name">{occupation}</div></Grid>
											</Grid>
										</>
										:
										<></>
									}
									{
										disabled_person_status === 1 ?
										<>
											<Grid container spacing={2}>
												<Grid item xs={12}><div className={classes.top_label_header} htmlFor="name">Jestem osobą niepełnosprawną i posiadam orzeczenie</div></Grid>
											</Grid>
											<Grid container spacing={2}>
												<Grid item xs={6}><div className={classes.top_label_header} htmlFor="name">Numer orzeczenia o niepełnosprawności</div></Grid>
												<Grid item xs={6}><div className={classes.top_label} htmlFor="name">{number_certificate}</div></Grid>
											</Grid>
											<Grid container spacing={2}>
												<Grid item xs={6}><div className={classes.top_label_header} htmlFor="name">Data ważności</div></Grid>
												<Grid item xs={6}><div className={classes.top_label} htmlFor="name">{getDateStr(date_of_certificate)}</div></Grid>
											</Grid>
											<Grid container spacing={2}>
												<Grid item xs={6}><div className={classes.top_label_header} htmlFor="name">Stopień niepełnosprawności</div></Grid>
												<Grid item xs={6}><div className={classes.top_label} htmlFor="name">{level_certificate}</div></Grid>
											</Grid>
											<Grid container spacing={2}>
												<Grid item xs={6}><div className={classes.top_label_header} htmlFor="name">Konieczne wymagania związane z niepełnosprawnością (np. pomoc asystenta, tłumacza migowego)</div></Grid>
												<Grid item xs={6}><div className={classes.top_label} htmlFor="name">{necessary_certificate}</div></Grid>
											</Grid>
										</>
										:
										<></>						
									}
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Inne
              	</Grid>
								<Grid item xs={9}>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label_header} htmlFor="name">Osoba należąca do mniejszości narodowej lub etnicznej, migrant, osoba obcego pochodzenia</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label} htmlFor="name">{getStatus(ethnic_minority_status)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label_header} htmlFor="name">Osoba bezdomna lub dotknięta wykluczeniem z dostępu do mieszkań</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label} htmlFor="name">{getStatus(homeless_person_status)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label_header} htmlFor="name">Osoba przebywająca w gospodarstwie domowym bez osób pracujących</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label} htmlFor="name">{getStatus(stay_house_status)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label_header} htmlFor="name">w tym: w gospodarstwie domowym z dziećmi pozostającymi na utrzymaniu</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label} htmlFor="name">{getStatus(house_hold_status)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label_header} htmlFor="name">Osoba żyjąca w gospodarstwie składającym się z jednej osoby dorosłej i dzieci pozostających na utrzymaniu</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label} htmlFor="name">{getStatus(house_hold_adult_status)}</div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label_header} htmlFor="name">Osoba w innej niekorzystnej sytuacji społecznej </div></Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={12}><div className={classes.top_label} htmlFor="name">{getStatus(uncomfortable_status)}</div></Grid>
									</Grid>
								</Grid>
							</Grid>
						</Card>
					</Grid>
					<Grid item xs={3}>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Card className={classes.form}>
									<Grid container spacing={2}>
										<div className={classes.form_title}>
											Karty informacyjne
                  </div>
										<Grid item xs={12}>
											<Button variant="outlined" color="secondary" className={classes.btnOption} onClick={handleGotoInformation}>
												Załóż kartę informacyjną
                    </Button>
										</Grid>
									</Grid>
								</Card>
							</Grid>
							<Grid item xs={12}>
								<Card className={classes.form}>
									<Grid container spacing={3}>
										<Grid item xs={12}>
											<Grid container spacing={2}>
												<Grid item xs={4}>
													<Button variant="outlined" color="secondary" className={classes.btnControl} onClick={handleExportPdf}>
														<PictureAsPdfOutlinedIcon />
													</Button>
												</Grid>
												<Grid item xs={4}>
													<Button variant="outlined" color="secondary" className={classes.btnControl} onClick={handleHistory}>
														<HistoryOutlinedIcon />
													</Button>
												</Grid>
												<Grid item xs={4}>
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

export default CandidatesProfile;
