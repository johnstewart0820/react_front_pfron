import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Grid, Card, CircularProgress, TextareaAutosize, FormControl, RadioGroup, Radio, FormControlLabel, Checkbox, Typography
} from '@material-ui/core';


import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import candidate from '../../apis/candidate';
import participant from '../../apis/participant';
import {
	KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { pl } from 'date-fns/locale';
import DateFnsUtils from '@date-io/date-fns';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/plain.css'
import clsx from 'clsx';
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined';
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import { DeleteModal } from '../Candidates/components';
import MaskedInput from 'react-text-mask';

const ParticipantsEdit = props => {
	const { children } = props;
	const id = props.match.params.id;
	const { history } = props;
	const classes = useStyles();
	
	const breadcrumbs = [{ active: true, label: 'Uczestnicy', href: '/participants' }, { active: false, label: 'Edytuj uczestnicy' }];
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
	const [participant_number, setParticipantNumber] = useState('');
	const [rehabitation_center, setRehabitationCenter] = useState(-1);
	const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
	const [participant_status_type, setParticipantStatusType] = useState(0);
	const [participantStatusTypeList, setParticipantStatusTypeList] = useState([]);
		const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
        const [progressStatus, setProgressStatus] = useState(false);
	const [error, setError] = useState({});
	const [openModal, setOpenModal] = useState(false);

	const handleHistory = () => {
		history.push(`/candidates/history/${id}`)
	}

	const handlePreview = () => {
		history.push(`/participants/profile/${id}`)
	}

	const handleDelete = () => {
    
		setProgressStatus(true);
		candidate
			.delete(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setHasAlert(true);
					setMessage(response.message);
					setIsSuccess(response.code === 200);
					if (response.code === 200) {
						setTimeout(function () { history.push('/participants'); }, 1000);
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
		participant.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setRehabitationCenterList(response.data.rehabitation_center);
					setParticipantStatusTypeList(response.data.participant_status_type);
				}
			})
		let _date = new Date();
		setDateOfBirth(_date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + (_date.getDate()));
		setDateOfCertificate(_date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + (_date.getDate()));
	}, []);

	useEffect(() => {
		setProgressStatus(true);
		participant.get(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setName(response.data.candidate.name ? response.data.candidate.name : '');
					setSurname(response.data.candidate.surname ? response.data.candidate.surname : '');
					setPersonId(response.data.candidate.person_id ? response.data.candidate.person_id : '');
					setDateOfBirth(response.data.candidate.date_of_birth);
					setPlaceOfBirth(response.data.candidate.place_of_birth ? response.data.candidate.place_of_birth : '');
					setStreet(response.data.candidate.street ? response.data.candidate.street : '');
					setHouseNumber(response.data.candidate.house_number ? response.data.candidate.house_number : '');
					setApartmentNumber(response.data.candidate.apartment_number ? response.data.candidate.apartment_number : '');
					setPostCode(response.data.candidate.post_code ? response.data.candidate.post_code : '');
					setPostOffice(response.data.candidate.post_office ? response.data.candidate.post_office : '');
					setCity(response.data.candidate.city ? response.data.candidate.city : '');
					setSecondStreet(response.data.candidate.second_street ? response.data.candidate.second_street : '');
					setSecondHouseNumber(response.data.candidate.second_house_number ? response.data.candidate.second_house_number : '');
					setSecondApartmentNumber(response.data.candidate.second_apartment_number ? response.data.candidate.second_apartment_number : '');
					setSecondPostCode(response.data.candidate.second_post_code ? response.data.candidate.second_post_code : '');
					setSecondPostOffice(response.data.candidate.second_post_office ? response.data.candidate.second_post_office : '');
					setSecondCity(response.data.candidate.second_city ? response.data.candidate.second_city : '');
					handleChangeVoivodeship(response.data.candidate.voivodeship ? response.data.candidate.voivodeship : '');
					handleChangeCounty(response.data.candidate.county ? response.data.candidate.county : '');
					handleChangeCommunity(response.data.candidate.community ? response.data.candidate.community : '');

					setMobilePhone(response.data.candidate.mobile_phone ? response.data.candidate.mobile_phone : '');
					setHomePhone(response.data.candidate.home_phone ? response.data.candidate.home_phone : '');
					setEmail(response.data.candidate.email ? response.data.candidate.email : '');
					setFamilyMobilePhone(response.data.candidate.family_mobile_phone ? response.data.candidate.family_mobile_phone : '');
					setFamilyHomePhone(response.data.candidate.family_home_phone ? response.data.candidate.family_home_phone : '');
					setEducation(response.data.candidate.education ? parseInt(response.data.candidate.education) : 0);
					setAcademicTitle(response.data.candidate.academic_title ? response.data.candidate.academic_title : '');
					setStayStatus(response.data.candidate.stay_status ? parseInt(response.data.candidate.stay_status) : 0);
					setChildrenApplicable(response.data.candidate.children_applicable ? parseInt(response.data.candidate.children_applicable) : 0);
					setChildrenAmount(response.data.candidate.children_amount ? response.data.candidate.children_amount : '');
					setChildrenAge(response.data.candidate.children_age ? response.data.candidate.children_age : '');
					setEmployedStatus(response.data.candidate.employed_status ? parseInt(response.data.candidate.employed_status) : 0);
					setEmployedType(response.data.candidate.employed_type ? response.data.candidate.employed_type.split(',') : []);
					setEmployedIn(response.data.candidate.employed_in ? response.data.candidate.employed_in : '');
					setOccupation(response.data.candidate.occupation ? response.data.candidate.occupation : '');
					setUnemployedStatus(response.data.candidate.unemployed_status ? parseInt(response.data.candidate.unemployed_status) : 0);
					setHaveUnemployedPersonStatus(response.data.candidate.have_unemployed_person_status ? parseInt(response.data.candidate.have_unemployed_person_status) : 0);
					setUnemployedPersonId(response.data.candidate.unemployed_person_id ? response.data.candidate.unemployed_person_id : '');
					setLongTermEmployedStatus(response.data.candidate.long_term_employed_status ? parseInt(response.data.candidate.long_term_employed_status) : 0);
					setSeekWorkStatus(response.data.candidate.seek_work_status ? parseInt(response.data.candidate.seek_work_status) : 0);
					setPassivePersonStatus(response.data.candidate.passive_person_status ? parseInt(response.data.candidate.passive_person_status) : 0);
					setFullTimeStatus(response.data.candidate.full_time_status ? parseInt(response.data.candidate.full_time_status) : 0);
					setEveningStudentStatus(response.data.candidate.evening_student_status ? parseInt(response.data.candidate.evening_student_status) : 0);
					setDisabledPersonStatus(response.data.candidate.disabled_person_status ? parseInt(response.data.candidate.disabled_person_status) : 0);
					setNumberCertificate(response.data.candidate.number_certificate ? response.data.candidate.number_certificate : '');
					setDateOfCertificate(response.data.candidate.date_of_certificate);
					setLevelCertificate(response.data.candidate.level_certificate ? response.data.candidate.level_certificate : '');
					setCodeCertificate(response.data.candidate.code_certificate ? response.data.candidate.code_certificate : '');
					setNecessaryCertificate(response.data.candidate.necessary_certificate ? response.data.candidate.necessary_certificate : 0);
					setEthnicMinorityStatus(response.data.candidate.ethnic_minority_status ? parseInt(response.data.candidate.ethnic_minority_status) : 0);
					setHomelessPersonStatus(response.data.candidate.homeless_person_status ? parseInt(response.data.candidate.homeless_person_status) : 0);
					setStayHouseStatus(response.data.candidate.stay_house_status ? parseInt(response.data.candidate.stay_house_status) : 0);
					setHouseHoldStatus(response.data.candidate.house_hold_status ? parseInt(response.data.candidate.house_hold_status) : 0);
					setHouseHoldAdultStatus(response.data.candidate.house_hold_adult_status ? parseInt(response.data.candidate.house_hold_adult_status) : 0);
					setUncomfortableStatus(response.data.candidate.uncomfortable_status ? parseInt(response.data.candidate.uncomfortable_status) : 0);
					setStage(response.data.candidate.stage ? response.data.candidate.stage : '');
					setStatus(response.data.candidate.id_status ? response.data.candidate.id_status : '');
					setParticipantNumber(response.data.candidate_info.participant_number ? response.data.candidate_info.participant_number : '');
					setRehabitationCenter(response.data.candidate_info.rehabitation_center ? response.data.candidate_info.rehabitation_center : '');
					setParticipantStatusType(response.data.candidate.participant_status_type ? response.data.candidate.participant_status_type : '');
				}
				setProgressStatus(false);
			})

	}, [employed_type_list]);

	const handleGotoInformation = () => {
		history.push(`/candidates/info/step${stage}/${id}`)
	}

	const handleAddIpr = (participant_number) => {
		history.push({
			pathname: `/ipr_list/create`,
			state: { searchKey: participant_number }
		});
	}

	const handleIprList = (name) => {
		history.push({
			pathname: '/ipr_list',
			state: { searchName: name }});
	}

	const handleError = () => {
		let _error = {}
		// var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		// _error.name = (name.length === 0);
		// _error.surname = (surname.length === 0);
		// _error.person_id = (validatepesel(person_id) !== true);
		// _error.place_of_birth = (place_of_birth.length === 0);
		// _error.street = (street.length === 0);
		// _error.house_number = (house_number.length === 0);
		// _error.post_code = (post_code.length === 0);
		// _error.post_office = (post_office.length === 0);
		// _error.city = (city.length === 0);
		// _error.voivodeship = (parseInt(voivodeship) === 0);
		// _error.community = (parseInt(community) === 0);
		// _error.county = (parseInt(county) === 0);
		// _error.comment = (comment.length === 0);
		// _error.mobile_phone = (mobile_phone.length === 0);
		// _error.home_phone = (home_phone.length === 0);
		// _error.email = (email.length != 0 && !pattern.test(email));
		// _error.family_home_phone = (family_home_phone.length === 0);
		// _error.family_mobile_phone = (family_mobile_phone.length === 0);
		// _error.education = (parseInt(education) === 0);
		// _error.academic_title = (parseInt(education) === 10 && academic_title.length === 0)
		// _error.stay_status = (parseInt(stay_status) === 0);
		// _error.children_amount = (children_applicable && isNaN(children_amount));
		// _error.children_age = (children_applicable && children_age.length === 0);
		// _error.employed_status = (parseInt(employed_status) === 0);
		// _error.employed_in = (parseInt(employed_status) === 1 && employed_in.length === 0)
		// _error.occupation = (parseInt(employed_status) === 1 && occupation.length === 0)
		// _error.unemployed_status = (parseInt(unemployed_status) === 0);
		// _error.have_unemployed_person_status = (parseInt(have_unemployed_person_status) === 0);
		// _error.unemployed_person_id = (parseInt(have_unemployed_person_status) === 1 && unemployed_person_id.length === 0);
		// _error.long_term_employed_status = (parseInt(long_term_employed_status) === 0);
		// _error.seek_work_status = (parseInt(seek_work_status) === 0);
		// _error.passive_person_status = (parseInt(passive_person_status) === 0);
		// _error.full_time_status = (parseInt(full_time_status) === 0);
		// _error.evening_student_status = (parseInt(evening_student_status) === 0);
		// _error.disabled_person_status = (parseInt(disabled_person_status) === 0);
		// _error.number_certificate = (parseInt(disabled_person_status) === 1 && isNaN(number_certificate));
		// _error.level_certificate = (parseInt(disabled_person_status) === 1 && level_certificate.length === 0);
		// _error.code_certificate = (parseInt(disabled_person_status) === 1 && code_certificate.length === 0);
		// _error.necessary_certificate = (parseInt(disabled_person_status) === 1 && necessary_certificate.length === 0)
		// _error.ethnic_minority_status = (parseInt(ethnic_minority_status) === 0);
		// _error.homeless_person_status = (parseInt(homeless_person_status) === 0);
		// _error.stay_house_status = (parseInt(stay_house_status) === 0);
		// _error.house_hold_status = (parseInt(house_hold_status) === 0);
		// _error.house_hold_adult_status = (parseInt(house_hold_adult_status) === 0);
		// _error.uncomfortable_status = (parseInt(uncomfortable_status) === 0);
		_error.comment = (comment.length === 0);
		setError(_error);
	};

	const handleBack = () => {
		history.push('/participants');
	}

	function validatepesel(pesel) {
		var reg = /^[0-9]{11}$/;
		if (reg.test(pesel) == false)
			return false;
		else {
			var digits = ("" + pesel).split("");
			if ((parseInt(pesel.substring(4, 6)) > 31) || (parseInt(pesel.substring(2, 4)) > 12))
				return false;

			var checksum = (1 * parseInt(digits[0]) + 3 * parseInt(digits[1]) + 7 * parseInt(digits[2]) + 9 * parseInt(digits[3]) + 1 * parseInt(digits[4]) + 3 * parseInt(digits[5]) + 7 * parseInt(digits[6]) + 9 * parseInt(digits[7]) + 1 * parseInt(digits[8]) + 3 * parseInt(digits[9])) % 10;
			if (checksum == 0) checksum = 10;
			checksum = 10 - checksum;

			return (parseInt(digits[10]) == checksum);
		}
	}

	const checkError = () => {
		// var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		// return (name.length === 0) ||
		// 	(surname.length === 0) ||
		// 	(validatepesel(person_id) !== true) ||
		// 	(place_of_birth.length === 0) ||
		// 	(street.length === 0) ||
		// 	(house_number.length === 0) ||
		// 	(post_code.length === 0) ||
		// 	(post_office.length === 0) ||
		// 	(city.length === 0) ||
		// 	(parseInt(voivodeship) === 0) ||
		// 	(parseInt(community) === 0) ||
		// 	(parseInt(county) === 0) ||
		// 	(comment.length === 0) ||
		// 	(mobile_phone.length === 0) ||
		// 	(home_phone.length === 0) ||
		// 	(email.length != 0 && !pattern.test(email)) ||
		// 	(family_home_phone.length === 0) ||
		// 	(family_mobile_phone.length === 0) ||
		// 	(parseInt(education) === 0) ||
		// 	(parseInt(education) === 10 && academic_title.length === 0) ||
		// 	(parseInt(stay_status) === 0) ||
		// 	(children_applicable && isNaN(children_amount)) ||
		// 	(children_applicable && children_age.length === 0) ||
		// 	(parseInt(employed_status) === 0) ||
		// 	(parseInt(employed_status) === 1 && employed_in.length === 0) ||
		// 	(parseInt(employed_status) === 1 && occupation.length === 0) ||
		// 	(parseInt(unemployed_status) === 0) ||
		// 	(parseInt(have_unemployed_person_status) === 0) ||
		// 	(parseInt(have_unemployed_person_status) === 1 && unemployed_person_id.length === 0) ||
		// 	(parseInt(long_term_employed_status) === 0) ||
		// 	(parseInt(seek_work_status) === 0) ||
		// 	(parseInt(passive_person_status) === 0) ||
		// 	(parseInt(full_time_status) === 0) ||
		// 	(parseInt(evening_student_status) === 0) ||
		// 	(parseInt(disabled_person_status) === 0) ||
		// 	(parseInt(disabled_person_status) === 1 && isNaN(number_certificate)) ||
		// 	(parseInt(disabled_person_status) === 1 && level_certificate.length === 0) ||
		// 	(parseInt(disabled_person_status) === 1 && code_certificate.length === 0) ||
		// 	(parseInt(disabled_person_status) === 1 && necessary_certificate.length === 0) ||
		// 	(parseInt(ethnic_minority_status) === 0) ||
		// 	(parseInt(homeless_person_status) === 0) ||
		// 	(parseInt(stay_house_status) === 0) ||
		// 	(parseInt(house_hold_status) === 0) ||
		// 	(parseInt(house_hold_adult_status) === 0) ||
		// 	(parseInt(uncomfortable_status) === 0);
		return comment.length === 0;
	}

	const handleSave = () => {
     
		if (checkError()) {
			setHasAlert(true);
			setMessage('Prosz?? wype??ni?? wszystkie wymagane pola.');
			setIsSuccess(false);
			handleError();
		} else {
			setProgressStatus(true);

			participant.update(name, surname, person_id, date_of_birth, place_of_birth, street, house_number, apartment_number, post_code, post_office, city,
				second_street, second_house_number, second_apartment_number, second_post_code, second_post_office, second_city,
				voivodeship, community, county, mobile_phone, home_phone, email, family_home_phone, family_mobile_phone,
				education, academic_title, stay_status, children_applicable, children_amount, children_age,
				employed_status, employed_type, employed_in, occupation, unemployed_status,
				have_unemployed_person_status, unemployed_person_id, long_term_employed_status, seek_work_status,
				passive_person_status, full_time_status, evening_student_status, disabled_person_status,
				number_certificate, date_of_certificate, level_certificate, code_certificate, necessary_certificate,
				ethnic_minority_status, homeless_person_status, stay_house_status, house_hold_status, house_hold_adult_status, uncomfortable_status,
				comment, participant_status_type, id)
				.then(response => {
					if (response.code === 401) {
						history.push('/login');
					} else {
						setHasAlert(true);
					setMessage(response.message);
					setIsSuccess(response.code === 200);
						if (response.code === 200) {
							setTimeout(function () { history.push('/participants'); }, 1000);
						}
						setProgressStatus(false);
					}
				})
		}
	}

	const handleChangeDateOfBirth = (value) => {
		let _date = new Date(value);
		setDateOfBirth(_date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + (_date.getDate()));
	}

	const handleChangeVoivodeship = (value) => {
		setVoivodeship(value);
		let arr = [];
		for (let i = 0; i < countyTotalList.length; i++) {
			if (parseInt(countyTotalList[i].voivodeship_id) === parseInt(value))
				arr.push(countyTotalList[i]);
		}
		setCountyList(arr);
		setCommunityList([]);
		setCounty(0);
		setCommunity(0);
		let _error = JSON.parse(JSON.stringify(error));
		_error.voivodeship = (parseInt(value) === 0);
		_error.community = true;
		_error.county = true;
		setError(_error);
	}

	const handleChangeCounty = (value) => {
		setCounty(value);
		let arr = [];
		for (let i = 0; i < communityTotalList.length; i++) {
			if (parseInt(communityTotalList[i].county_id) === parseInt(value))
				arr.push(communityTotalList[i]);
		}
		setCommunityList(arr);
		setCommunity(0);
		let _error = JSON.parse(JSON.stringify(error));
		_error.county = (parseInt(value) === 0);
		_error.community = true;
		setError(_error);
	}

	const handleChangeCommunity = (value) => {
		setCommunity(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.community = (parseInt(value) === 0);
		setError(_error);
	}

	const handleChangeName = (value) => {
		setName(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.name = (value.length === 0);
		setError(_error);
	}

	const handleChangeSurName = (value) => {
		setSurname(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.surname = (value.length === 0);
		setError(_error);
	}

	const handleChangePersonId = (value) => {
		setPersonId(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.person_id = (!validatepesel(value));
		setError(_error);
	}

	const handleChangePlaceOfBirth = (value) => {
		setPlaceOfBirth(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.place_of_birth = (value.length === 0);
		setError(_error);
	}

	const handleChangeStreet = (value) => {
		setStreet(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.street = (value.length === 0);
		setError(_error);
	}

	const handleChangeHouseNumber = (value) => {
		setHouseNumber(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.house_number = (value.length === 0);
		setError(_error);
	}

	const handleChangeApartmentNumber = (value) => {
		setApartmentNumber(value);
	}

	const handleChangePostCode = (value) => {
		setPostCode(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.post_code = (value.length === 0);
		setError(_error);
	}

	const handleChangePostOffice = (value) => {
		setPostOffice(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.post_office = (value.length === 0);
		setError(_error);
	}

	const handleChangeCity = (value) => {
		setCity(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.city = (value.length === 0);
		setError(_error);
	}

	const handleChangeMobilePhone = (value) => {
		setMobilePhone(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.mobile_phone = (value.length === 0);
		setError(_error);
	}

	const handleChangeHomePhone = (value) => {
		setHomePhone(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.home_phone = (value.length === 0);
		setError(_error);
	}

	const handleChangeFamilyMobilePhone = (value) => {
		setFamilyMobilePhone(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.family_mobile_phone = (value.length === 0);
		setError(_error);
	}

	const handleChangeFamilyHomePhone = (value) => {
		setFamilyHomePhone(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.family_home_phone = (value.length === 0);
		setError(_error);
	}

	const handleChangeEmail = (value) => {
		var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		setEmail(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.email = (value.length != 0 && !pattern.test(value));
		setError(_error);
	}

	const handleChangeEducation = (e) => {
		setEducation(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		_error.education = (parseInt(e.target.value) === 0);
		if (parseInt(e.target.value) != 10) {
			_error.academic_title = false;
			setAcademicTitle('');
		}
		setError(_error);
	}

	const handleChangeAcademicTitle = (value) => {
		setAcademicTitle(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.academic_title = (parseInt(education) === 10 && value.length === 0);
		setError(_error);
	}

	const handleChangeStayStatus = (e) => {
		setStayStatus(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		_error.stay_status = (parseInt(e.target.value) === 0);
		setError(_error);
	}

	const handleChangeChildrenAmount = (value) => {
		setChildrenAmount(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.children_amount = (children_applicable && isNaN(value));
		setError(_error);
	}

	const handleChangeChildrenAge = (value) => {
		setChildrenAge(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.children_age = (children_applicable && value.length === 0);
		setError(_error);
	}

	const handleChangeEmployedStatus = (e) => {
		setEmployedStatus(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		if (parseInt(e.target.value) !== 1) {
			_error.employed_in = false;
			_error.occupation = false;
			setEmployedIn('');
			setOccupation('');
			setError(_error);
		}
	}

	const handleChangeEmployedType = (index, e) => {
		let _type = JSON.parse(JSON.stringify(employed_type));
		_type[index] = !_type[index];
		setEmployedType(_type);
	}

	const handleChangeEmplotedIn = (value) => {
		setEmployedIn(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.employed_in = (value.length === 0);
		setError(_error);
	}

	const handleChangeOccupation = (value) => {
		setOccupation(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.occupation = (value.length === 0);
		setError(_error);
	}

	const handleChangeUnemployedStatus = (e) => {
		setUnemployedStatus(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		_error.unemployed_status = (parseInt(e.target.value) === 0);
		setError(_error);
	}

	const handleChangeHaveUnemployedPersonStatus = (e) => {
		setHaveUnemployedPersonStatus(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		_error.have_unemployed_person_status = (parseInt(e.target.value) === 0);
		if (parseInt(e.target.value) != 1) {
			_error.unemployed_person_id = false;
			setUnemployedPersonId('');
		}
		setError(_error);
	}

	const handleChangeUnemployedPersonId = (value) => {
		setUnemployedPersonId(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.unemployed_person_id = (parseInt(have_unemployed_person_status) === 1 && value.length === 0);
		setError(_error);
	}

	const handleChangeLongTermEmployedStatus = (e) => {
		setLongTermEmployedStatus(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		_error.long_term_employed_status = (parseInt(e.target.value) === 0);
		setError(_error);
	}

	const handleChangeSeekWorkStatus = (e) => {
		setSeekWorkStatus(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		_error.seek_work_status = (parseInt(e.target.value) === 0);
		setError(_error);
	}

	const handleChangePassivePersonStatus = (e) => {
		setPassivePersonStatus(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		_error.passive_person_status = (parseInt(e.target.value) === 0);
		setError(_error);
	}

	const handleChangeFullTimeStatus = (e) => {
		setFullTimeStatus(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		_error.full_time_status = (parseInt(e.target.value).length === 0);
		setError(_error);
	}

	const handleChangeEveningStudentStatus = (e) => {
		setEveningStudentStatus(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		_error.evening_student_status = (parseInt(e.target.value) === 0);
		setError(_error);
	}

	const handleChangeDisabledPersonStatus = (e) => {
		setDisabledPersonStatus(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		_error.disabled_person_status = (parseInt(e.target.value) === 0);
		if (parseInt(e.target.value) != 1) {
			_error.number_certificate = false;
			_error.code_certificate = false;
			_error.level_certificate = false;
			_error.necessary_certificate = false;
			setNumberCertificate('0');
			setCodeCertificate('');
			setLevelCertificate('');
			setNecessaryCertificate('');
		}
		setError(_error);
	}

	const handleChangeNumberCertificate = (value) => {
		setNumberCertificate(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.number_certificate = (parseInt(disabled_person_status) === 1 && isNaN(value));
		setError(_error);
	}

	const handleChangeDateOfCertificate = (value) => {
		let _date = new Date(value);
		setDateOfCertificate(_date.getFullYear() + '-' + (_date.getMonth() + 1) + '-' + (_date.getDate()));
	}

	const handleChangeCodeCertificate = (value) => {
		setCodeCertificate(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.code_certificate = (parseInt(disabled_person_status) === 1 && value.length === 0);
		setError(_error);
	}

	const handleChangeLevelCertificate = (value) => {
		setLevelCertificate(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.level_certificate = (parseInt(disabled_person_status) === 1 && value.length === 0);
		setError(_error);
	}

	const handleChangeNecessaryCertificate = (value) => {
		setNecessaryCertificate(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.necessary_certificate = (parseInt(disabled_person_status) === 1 && value.length === 0);
		setError(_error);
	}

	const handleChangeEthnicMinorityStatus = (e) => {
		setEthnicMinorityStatus(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		_error.ethnic_minority_status = (parseInt(e.target.value) === 0);
		setError(_error);
	}

	const handleChangeHomelessPersonStatus = (e) => {
		setHomelessPersonStatus(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		_error.homeless_person_status = (parseInt(e.target.value) === 0);
		setError(_error);
	}

	const handleChangeStayHouseStatus = (e) => {
		setStayHouseStatus(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		_error.stay_house_status = (parseInt(e.target.value) === 0);
		setError(_error);
	}

	const handleChangeHouseHoldStatus = (e) => {
		setHouseHoldStatus(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		_error.house_hold_status = (parseInt(e.target.value) === 0);
		setError(_error);
	}

	const handleChangeHouseHoldAdultStatus = (e) => {
		setHouseHoldAdultStatus(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		_error.house_hold_adult_status = (parseInt(e.target.value) === 0);
		setError(_error);
	}

	const handleChangeUncomfortableStatus = (e) => {
		setUncomfortableStatus(parseInt(e.target.value));
		let _error = JSON.parse(JSON.stringify(error));
		_error.uncomfortable_status = (parseInt(e.target.value) === 0);
		setError(_error);
	}

	const handleChangeChildrenApplicable = (e) => {
		setChildrenApplicable(e);
		let _error = JSON.parse(JSON.stringify(error));
		if (!e) {
			_error.children_age = false;
			_error.children_amount = false;
			setChildrenAge('');
			setChildrenAmount('0');
		}
		setError(_error);
	}

	const handleChangeComment = (value) => {
		setComment(value);
		let _error = JSON.parse(JSON.stringify(error));
		_error.comment = (value.length === 0);
		setError(_error);
	}

	return (
		<MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Breadcrumb list={breadcrumbs} />
					<Button variant="outlined" color="secondary" id="main"  className={classes.btnBack} onClick={handleBack}>						Wr???? do listy uczestnik??w
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
								<Grid item md={3} xs={12} className={classes.form_title}>
								<Typography variant="h2" className={classes.form_title}>
									Dane uczestnika
								</Typography>
              	</Grid>
								<Grid item md={9} xs={12}>
									<div className={classes.top_label}><label for="name">Imi??(Imiona)</label></div>
									<input className={clsx({ [classes.input_box]: true, [classes.error]: error.name })} type="name" value={name} name="name" id="name" onChange={(e) => handleChangeName(e.target.value)} />
									<div className={classes.error_label} style={{ display: error.name ? 'block' : 'none' }}>Wpisz co najmniej jedn?? liter??.</div>
									<div className={classes.input_box_label}><label htmlFor="surname">Nazwisko</label></div>
									<input className={clsx({ [classes.input_box]: true, [classes.error]: error.surname })} type="name" value={surname} name="surname" id="surname" onChange={(e) => handleChangeSurName(e.target.value)} />
									<div className={classes.error_label} style={{ display: error.surname ? 'block' : 'none' }}>Wpisz co najmniej jedn?? liter??.</div>
									<Grid container spacing={2}>
										<Grid item xs={6}>
											<div className={classes.input_box_label}><label htmlFor="pesel">PESEL</label></div>
											<input className={clsx({ [classes.input_box]: true, [classes.error]: error.person_id })} type="name" value={person_id} name="name" id="pesel" onChange={(e) => handleChangePersonId(e.target.value)} />
											<div className={classes.error_label} style={{ display: error.person_id ? 'block' : 'none' }}>Wpisz poprawny PESEL(ex: 83102570819).</div>
										</Grid>
										<Grid item xs={6}>
											<div className={classes.input_box_label} ><label htmlFor="date_birth">Data urodzenia</label></div>
											<KeyboardDatePicker
												disableToolbar
												className={classes.date_picker}
												variant="inline"
												format="dd.MM.yyyy"
                    		aria-label="Data urodzenia - Format wprowadzania daty DD.MM.RRRR"
												margin="normal"
												id="date_birth"
												value={date_of_birth}
												onChange={(value) => handleChangeDateOfBirth(value)}
												KeyboardButtonProps={{
													'aria-label': 'Zmie?? dat??',
												}}
											/>
										</Grid>
									</Grid>
									<div className={classes.input_box_label}><label htmlFor="place_of_birth">Miejsce urodzenia</label></div>
									<input className={clsx({ [classes.input_box]: true, [classes.error]: error.place_of_birth })} type="name" value={place_of_birth} name="name" id="place_of_birth" onChange={(e) => handleChangePlaceOfBirth(e.target.value)} />
									<div className={classes.error_label} style={{ display: error.place_of_birth ? 'block' : 'none' }}>Wpisz co najmniej jedn?? liter??.</div>
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item md={3} xs={12} className={classes.form_title}>
								<Typography variant="h2" className={classes.form_title}>
									Adres zameldowania
								</Typography>
              	</Grid>
								<Grid item md={9} xs={12}>
									<Grid container spacing={2}>
										<Grid item xs={6}>
											<div className={classes.top_label}><label htmlFor="street">Ulica</label></div>
											<input className={clsx({ [classes.input_box]: true, [classes.error]: error.street })} type="name" value={street} name="name" id="street" onChange={(e) => handleChangeStreet(e.target.value)} />
											<div className={classes.error_label} style={{ display: error.street ? 'block' : 'none' }}>Wpisz co najmniej jedn?? liter??.</div>
										</Grid>
										<Grid item xs={3}>
											<div className={classes.top_label} ><label htmlFor="house_number">nr domu</label></div>
											<input className={clsx({ [classes.input_box]: true, [classes.error]: error.house_number })} type="name" value={house_number} name="name" id="house_number" onChange={(e) => handleChangeHouseNumber(e.target.value)} />
											<div className={classes.error_label} style={{ display: error.house_number ? 'block' : 'none' }}>Wpisz co najmniej jedn?? liter??.</div>
										</Grid>
										<Grid item xs={3}>
											<div className={classes.top_label} ><label htmlFor="apartment_number">mieszkanie</label></div>
											<input className={classes.input_box} type="name" value={apartment_number} name="name" id="apartment_number" onChange={(e) => handleChangeApartmentNumber(e.target.value)} />
										</Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={3}>
											<div className={classes.input_box_label} ><label htmlFor="post_code">Kod pocztowy</label></div>
											<input className={clsx({ [classes.input_box]: true, [classes.error]: error.post_code })} type="name" value={post_code} name="name" id="post_code" onChange={(e) => handleChangePostCode(e.target.value)} />
											<div className={classes.error_label} style={{ display: error.post_code ? 'block' : 'none' }}>Wpisz co najmniej jedn?? liter??.</div>
										</Grid>
										<Grid item xs={5}>
											<div className={classes.input_box_label} ><label htmlFor="post_office">Poczta</label></div>
											<input className={clsx({ [classes.input_box]: true, [classes.error]: error.post_office })} type="name" value={post_office} name="name" id="post_office" onChange={(e) => handleChangePostOffice(e.target.value)} />
											<div className={classes.error_label} style={{ display: error.post_office ? 'block' : 'none' }}>Wpisz co najmniej jedn?? liter??.</div>
										</Grid>
										<Grid item xs={4}>
											<div className={classes.input_box_label} ><label htmlFor="city">Miejscowo????</label></div>
											<input className={clsx({ [classes.input_box]: true, [classes.error]: error.city })} type="name" value={city} name="name" id="city" onChange={(e) => handleChangeCity(e.target.value)} />
											<div className={classes.error_label} style={{ display: error.city ? 'block' : 'none' }}>Wpisz co najmniej jedn?? liter??.</div>
										</Grid>
									</Grid>
									<div className={classes.input_box_label} htmlFor="type">Wojew??dztwo</div>
									<SingleSelect value={voivodeship} handleChange={(value) => handleChangeVoivodeship(value)} list={voivodeshipList} error={error.voivodeship} />
									<div className={classes.error_label} style={{ display: error.voivodeship ? 'block' : 'none' }}>Wybierz prowincj??</div>
									<div className={classes.input_box_label} htmlFor="type">Powiat</div>
									<SingleSelect value={county} handleChange={(value) => handleChangeCounty(value)} list={countyList} error={error.county} />
									<div className={classes.error_label} style={{ display: error.county ? 'block' : 'none' }}>Wybierz powiat</div>
									<div className={classes.input_box_label} htmlFor="type">Gmina</div>
									<SingleSelect value={community} handleChange={(value) => handleChangeCommunity(value)} list={communityList} error={error.community} />
									<div className={classes.error_label} style={{ display: error.community ? 'block' : 'none' }}>Wybierz gmin??</div>
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item md={3} xs={12} className={classes.form_title}>
								<Typography variant="h2" className={classes.form_title}>
									Dane kontaktowe
								</Typography>
              	</Grid>
								<Grid item md={9} xs={12}>
									<div className={classes.input_box_label} htmlFor="type">Telefon kom??rkowy</div>
									<PhoneInput country="pl" value={mobile_phone} onChange={handleChangeMobilePhone} inputStyle={{ width: '100%', borderRadius: '0px' }} />
									<div className={classes.error_label} style={{ display: error.mobile_phone ? 'block' : 'none' }}>Wpisz poprawny telefon (typ: (xx)(xxx-xxx-xxx)).</div>
									<div className={classes.input_box_label} htmlFor="type">Telefon domowy</div>
									<div className={classes.input_box_label} ><label htmlFor="home_phone">Telefon domowy</label></div>
									<MaskedInput
										className={clsx({ [classes.input_box]: true, [classes.error]: error.home_phone })}
										mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
										value={home_phone}
										onChange={(e) => handleChangeHomePhone(e.target.value)}
										id="home_phone"
									/>
									<div className={classes.error_label} style={{ display: error.home_phone ? 'block' : 'none' }}>Wpisz poprawny telefon (typ: xx-xxx-xx-xx).</div>
									<div className={classes.input_box_label} ><label htmlFor="email">Adres e-mail</label></div>
									<input className={clsx({ [classes.input_box]: true, [classes.error]: error.email })} type="name" value={email} name="name" id="email" onChange={(e) => handleChangeEmail(e.target.value)} />
									<div className={classes.error_label} style={{ display: error.email ? 'block' : 'none' }}>Wpisz poprawny adres e-mail.</div>
									<div className={classes.input_box_label} htmlFor="type">Numer kontaktowy do bliskiej osoby - Telefon kom??rkowy</div>
									<PhoneInput country="pl" value={family_mobile_phone} onChange={handleChangeFamilyMobilePhone} inputStyle={{ width: '100%', borderRadius: '0px' }} />
									<div className={classes.error_label} style={{ display: error.family_mobile_phone ? 'block' : 'none' }}>Wpisz poprawny telefon (typ: (xx)(xxx-xxx-xxx)).</div>
									<div className={classes.input_box_label}><label  htmlFor="family_home_phone">Numer kontaktowy do bliskiej osoby - Telefon domowy</label></div>
									<MaskedInput
										className={clsx({ [classes.input_box]: true, [classes.error]: error.family_home_phone })}
										mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/]}
										value={family_home_phone}
										onChange={(e) => handleChangeFamilyHomePhone(e.target.value)}
										id="family_home_phone"
									/>
									<div className={classes.error_label} style={{ display: error.family_home_phone ? 'block' : 'none' }}>Wpisz poprawny telefon (typ: xx-xxx-xx-xx).</div>
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
								<Typography variant="h2" className={classes.form_title}>
									<div className={classes.form_title}>
										Adres korespondencyjny
                </div>
									<div className={classes.form_title_small}>
										(wype??ni?? je??li inny ni?? adres zameldowania)
                </div>
								</Typography>
								</Grid>
								<Grid item md={9} xs={12}>
									<Grid container spacing={2}>
										<Grid item xs={6}>
											<div className={classes.top_label} ><label htmlFor="second_street">Ulica</label></div>
											<input className={classes.input_box} type="name" value={second_street} name="name" id="second_street" onChange={(e) => setSecondStreet(e.target.value)} />
										</Grid>
										<Grid item xs={3}>
											<div className={classes.top_label} ><label htmlFor="second_house_number">nr domu</label></div>
											<input className={classes.input_box} type="name" value={second_house_number} name="name" id="second_house_number" onChange={(e) => setSecondHouseNumber(e.target.value)} />
										</Grid>
										<Grid item xs={3}>
											<div className={classes.top_label} ><label htmlFor="second_apartment_number">mieszkanie</label></div>
											<input className={classes.input_box} type="name" value={second_apartment_number} name="name" id="second_apartment_number" onChange={(e) => setSecondApartmentNumber(e.target.value)} />
										</Grid>
									</Grid>
									<Grid container spacing={2}>
										<Grid item xs={3}>
											<div className={classes.input_box_label} ><label htmlFor="second_post_code">Kod pocztowy</label></div>
											<input className={classes.input_box} type="name" value={second_post_code} name="name" id="second_post_code" onChange={(e) => setSecondPostCode(e.target.value)} />
										</Grid>
										<Grid item xs={5}>
											<div className={classes.input_box_label} ><label htmlFor="second_post_office">Poczta</label></div>
											<input className={classes.input_box} type="name" value={second_post_office} name="name" id="second_post_office" onChange={(e) => setSecondPostOffice(e.target.value)} />
										</Grid>
										<Grid item xs={4}>
											<div className={classes.input_box_label} ><label htmlFor="second_city">Miejscowo????</label></div>
											<input className={classes.input_box} type="name" value={second_city} name="name" id="second_city" onChange={(e) => setSecondCity(e.target.value)} />
										</Grid>
									</Grid>
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item md={3} xs={12} className={classes.form_title}>
								<Typography variant="h2" className={classes.form_title}>
									Wykszta??cenie
								</Typography>
              	</Grid>
								<Grid item md={9} xs={12}>
									<FormControl component="fieldset" error={error.education}>
										<RadioGroup aria-label="Wykszta??cenie" name="education" value={education} onChange={handleChangeEducation}>
											{
												educationList.map((item, index) => (
													<FormControlLabel value={item.id} control={<Radio />} label={item.name} />
												))
											}
										</RadioGroup>
									</FormControl>
									{
										education === 10 ?
											<Grid container spacing={3}>
												<Grid item xs={1}></Grid>
												<Grid item xs={11}>
													<div className={classes.input_box_label} ><label htmlFor="academic_title">Tytu?? naukowy</label></div>
													<input className={clsx({ [classes.input_box]: true, [classes.error]: error.academic_title })} type="name" id="academic_title" value={academic_title} name="name" onChange={(e) => handleChangeAcademicTitle(e.target.value)} />
													<div className={classes.error_label} style={{ display: error.academic_title ? 'block' : 'none' }}>Wpisz co najmniej jedn?? liter??.</div>
												</Grid>
											</Grid>
											:
											<></>
									}
									<div className={classes.error_label} style={{ display: error.education ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item md={3} xs={12} className={classes.form_title}>
								<Typography variant="h2" className={classes.form_title}>
									Tryb pobytu
								</Typography>
              	</Grid>
								<Grid item md={9} xs={12}>
									<div className={classes.input_box_label} htmlFor="name">Ze wzgl??d??w logistycznych (brak mo??liwo??ci codziennych dojazd??w) deklaruj?? pobyt stacjonarny w O??rodku Kompleksowej Rehabilitacji</div>
									<FormControl component="fieldset" error={error.stay_status}>
										<RadioGroup aria-label="Ze wzgl??d??w logistycznych (brak mo??liwo??ci codziennych dojazd??w) deklaruj?? pobyt stacjonarny w O??rodku Kompleksowej Rehabilitacji" name="education" value={stay_status} onChange={handleChangeStayStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.stay_status ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
									<div>
										<FormControl component="fieldset">
											<FormControlLabel
												className={classes.rememberMe}
												control={
													<Checkbox
														onChange={() => handleChangeChildrenApplicable(!children_applicable)}
													/>
												}
												label='Jestem jedynym opiekunem prawnym dzieci, kt??re musz?? przebywa?? ze mn??'
											/>
										</FormControl>
									</div>
									{
										children_applicable ?
											<Grid container spacing={3}>
												<Grid item xs={1}></Grid>
												<Grid item xs={5}>
												<div className={classes.input_box_label} ><label htmlFor="children_amount">Liczba dzieci</label></div>
													<input className={clsx({ [classes.input_box]: true, [classes.error]: error.children_amount })} type="name" value={children_amount} id="children_amount" name="name" onChange={(e) => handleChangeChildrenAmount(e.target.value)} />
													<div className={classes.error_label} style={{ display: error.children_amount ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
												</Grid>
												<Grid item xs={6}>
													<div className={classes.input_box_label} ><label htmlFor="children_age">Wiek</label></div>
													<input className={clsx({ [classes.input_box]: true, [classes.error]: error.children_age })} type="name" id="children_age" value={children_age} name="name" onChange={(e) => handleChangeChildrenAge(e.target.value)} />
													<div className={classes.error_label} style={{ display: error.children_age ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
												</Grid>
											</Grid>
											:
											<></>
									}

								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item md={3} xs={12}>
								<Typography variant="h2" className={classes.form_title}>
									<div className={classes.form_title}>
										Status na rynku pracy
                </div>
									<div className={classes.form_title_small}>
										(prosz?? zaznaczy?? w??a??ciwy)
                </div>
								</Typography>
								</Grid>
								<Grid item md={9} xs={12}>
									<div className={classes.input_box_label} htmlFor="name">Jestem zatrudniony</div>
									<FormControl component="fieldset" error={error.employed_status}>
										<RadioGroup aria-label="Jestem zatrudniony" name="employed_status" value={employed_status} onChange={handleChangeEmployedStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.employed_status ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
									{
										employed_status === 1 ?
											<div>
												<FormControl component="fieldset">
													{
														employed_type_list.map((item, index) => (
															<FormControlLabel
																className={classes.rememberMe}
																label={item.name}
																control={
																	<Checkbox
																		checked={employed_type[index]}
																		onChange={(value) => handleChangeEmployedType(index, value)}
																	/>
																}
															/>
														))
													}
												</FormControl>
												<div className={classes.input_box_label}><label htmlFor="employed_in">Jestem zatrudniony w</label></div>
												<input className={clsx({ [classes.input_box]: true, [classes.error]: error.employed_in })} type="name" id="employed_in" value={employed_in} name="name" onChange={(e) => handleChangeEmplotedIn(e.target.value)} />
												<div className={classes.error_label} style={{ display: error.employed_in ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
												<div className={classes.input_box_label}><label htmlFor="occupation">Wykonywany zaw??d</label></div>
												<input className={clsx({ [classes.input_box]: true, [classes.error]: error.occupation })} type="name" value={occupation} id="occupation" name="name" onChange={(e) => handleChangeOccupation(e.target.value)} />
												<div className={classes.error_label} style={{ display: error.occupation ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
											</div>
											:
											<></>
									}
									<div className={classes.input_box_label} htmlFor="name">Jestem osob?? bezrobotn??</div>
									<FormControl component="fieldset" error={error.unemployed_status}>
										<RadioGroup aria-label="Jestem osob?? bezrobotn??" name="unemployed_status" value={unemployed_status} onChange={handleChangeUnemployedStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.unemployed_status ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
									<div className={classes.input_box_label} htmlFor="name">Jestem zarejestrowany/a w PUP i posiadam status osoby bezrobotnej</div>
									<FormControl component="fieldset" error={error.have_unemployed_person_status}>
										<RadioGroup aria-label="Jestem zarejestrowany/a w PUP i posiadam status osoby bezrobotnej" name="have_unemployed_person_status" value={have_unemployed_person_status} onChange={handleChangeHaveUnemployedPersonStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.have_unemployed_person_status ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
									{
										have_unemployed_person_status === 1 ?
											<>
												<div className={classes.input_box_label} ><label htmlFor="unemployed_person_id">Numer statusu osoby bezrobotnej</label></div>
												<input className={clsx({ [classes.input_box]: true, [classes.error]: error.unemployed_person_id })} type="name" id="unemployed_person_id" value={unemployed_person_id} name="name" onChange={(e) => handleChangeUnemployedPersonId(e.target.value)} />
												<div className={classes.error_label} style={{ display: error.have_unemployed_person_status ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
											</>
											:
											<></>
									}

									<div className={classes.input_box_label} htmlFor="name">Jestem osob?? d??ugotrwale bezrobotn??</div>
									<FormControl component="fieldset" error={error.long_term_employed_status}>
										<RadioGroup aria-label="Jestem osob?? d??ugotrwale bezrobotn??" name="unemployed_status" value={long_term_employed_status} onChange={handleChangeLongTermEmployedStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.long_term_employed_status ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
									<div className={classes.input_box_label} htmlFor="name">Jestem zarejestrowany/a w PUP jako osoba poszukuj??ca pracy</div>
									<FormControl component="fieldset" error={error.seek_work_status}>
										<RadioGroup aria-label="Jestem zarejestrowany/a w PUP jako osoba poszukuj??ca pracy" name="unemployed_status" value={seek_work_status} onChange={handleChangeSeekWorkStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.seek_work_status ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
									<div className={classes.input_box_label} htmlFor="name">Jestem osob?? biern?? zawodowo</div>
									<FormControl component="fieldset" error={error.passive_person_status}>
										<RadioGroup aria-label="Jestem osob?? biern?? zawodowo" name="unemployed_status" value={passive_person_status} onChange={handleChangePassivePersonStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.passive_person_status ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
									<div className={classes.input_box_label} htmlFor="name">Jestem uczniem /studentem ucz??cym si?? w systemie dziennym</div>
									<FormControl component="fieldset" error={error.full_time_status}>
										<RadioGroup aria-label="Jestem uczniem /studentem ucz??cym si?? w systemie dziennym<" name="unemployed_status" value={full_time_status} onChange={handleChangeFullTimeStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.full_time_status ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
									<div className={classes.input_box_label} htmlFor="name">Jestem osob?? kszta??c??ca si?? w systemie wieczorowym/pozaszkolnym</div>
									<FormControl component="fieldset" error={error.evening_student_status}>
										<RadioGroup aria-label="Jestem osob?? kszta??c??ca si?? w systemie wieczorowym/pozaszkolnym" name="unemployed_status" value={evening_student_status} onChange={handleChangeEveningStudentStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.evening_student_status ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
									<div className={classes.input_box_label} htmlFor="name">Jestem osob?? niepe??nosprawn?? i posiadam orzeczenie</div>
									<FormControl component="fieldset" error={error.disabled_person_status}>
										<RadioGroup aria-label="Jestem osob?? niepe??nosprawn?? i posiadam orzeczenie" name="unemployed_status" value={disabled_person_status} onChange={handleChangeDisabledPersonStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.disabled_person_status ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
									{
										disabled_person_status === 1 ?
											<Grid container spacing={1}>
												<Grid item xs={8}>
													<div className={classes.input_box_label} ><label htmlFor="number_certificate">Numer orzeczenia o niepe??nosprawno??ci</label></div>
													<input className={clsx({ [classes.input_box]: true, [classes.error]: error.number_certificate })} type="name" id="number_certificate" value={number_certificate} name="name" onChange={(e) => handleChangeNumberCertificate(e.target.value)} />
													<div className={classes.error_label} style={{ display: error.number_certificate ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
												</Grid>
												<Grid item xs={4}>
													<div className={classes.input_box_label} htmlFor="name">Data wa??no??ci</div>
													<KeyboardDatePicker
														disableToolbar
														className={classes.date_picker}
														variant="inline"
														format="dd.MM.yyyy"
                    				aria-label="Data wa??no??ci - Format wprowadzania daty DD.MM.RRRR"
														margin="normal"
														id="date-picker-inline"
														value={date_of_certificate}
														onChange={(value) => handleChangeDateOfCertificate(value)}
														KeyboardButtonProps={{
															'aria-label': 'Zmie?? dat??',
														}}
													/>
												</Grid>
												<Grid item xs={8}>
													<div className={classes.input_box_label}><label htmlFor="level_certificate">Stopie?? niepe??nosprawno??ci</label></div>
													<input className={clsx({ [classes.input_box]: true, [classes.error]: error.level_certificate })} type="name" id="level_certificate" value={level_certificate} name="name" onChange={(e) => handleChangeLevelCertificate(e.target.value)} />
													<div className={classes.error_label} style={{ display: error.level_certificate ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
												</Grid>
												<Grid item xs={4}>
													<div className={classes.input_box_label} ><label htmlFor="code_certificate">Kod orzeczenia</label></div>
													<input className={clsx({ [classes.input_box]: true, [classes.error]: error.code_certificate })} type="name" id="code_certificate" value={code_certificate} name="name" onChange={(e) => handleChangeCodeCertificate(e.target.value)} />
													<div className={classes.error_label} style={{ display: error.code_certificate ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
												</Grid>
												<div className={classes.input_box_label} ><label htmlFor="necessary_certificate">Konieczne wymagania zwi??zane z niepe??nosprawno??ci?? (np. pomoc asystenta, t??umacza migowego)</label></div>
												<input className={clsx({ [classes.input_box]: true, [classes.error]: error.necessary_certificate })} type="name" id="necessary_certificate" value={necessary_certificate} name="name" onChange={(e) => handleChangeNecessaryCertificate(e.target.value)} />
												<div className={classes.error_label} style={{ display: error.necessary_certificate ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
											</Grid>
											:
											<></>
									}
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3} className={classes.form_title}>
								<Grid item md={3} xs={12}>
								<Typography variant="h2" className={classes.form_title}>
									Inne
								</Typography>
              </Grid>
								<Grid item md={9} xs={12}>
									<div className={classes.input_box_label} htmlFor="name">Osoba nale????ca do mniejszo??ci narodowej lub etnicznej, migrant, osoba obcego pochodzenia</div>
									<FormControl component="fieldset" error={error.ethnic_minority_status}>
										<RadioGroup aria-label="Osoba nale????ca do mniejszo??ci narodowej lub etnicznej, migrant, osoba obcego pochodzenia" name="unemployed_status" value={ethnic_minority_status} onChange={handleChangeEthnicMinorityStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
											<FormControlLabel value={3} control={<Radio />} label="ODMOWA INFORMACJI" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.ethnic_minority_status ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
									<div className={classes.input_box_label} htmlFor="name">Osoba bezdomna lub dotkni??ta wykluczeniem z dost??pu do mieszka??</div>
									<FormControl component="fieldset" error={error.homeless_person_status}>
										<RadioGroup aria-label="Osoba bezdomna lub dotkni??ta wykluczeniem z dost??pu do mieszka??" name="unemployed_status" value={homeless_person_status} onChange={handleChangeHomelessPersonStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
											<FormControlLabel value={3} control={<Radio />} label="ODMOWA INFORMACJI" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.homeless_person_status ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
									<div className={classes.input_box_label} htmlFor="name">Osoba przebywaj??ca w gospodarstwie domowym bez os??b pracuj??cych</div>
									<FormControl component="fieldset" error={error.stay_house_status}>
										<RadioGroup aria-label="Osoba przebywaj??ca w gospodarstwie domowym bez os??b pracuj??cych" name="unemployed_status" value={stay_house_status} onChange={handleChangeStayHouseStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
											<FormControlLabel value={3} control={<Radio />} label="ODMOWA INFORMACJI" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.stay_house_status ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
									<div className={classes.input_box_label} htmlFor="name">w tym: w gospodarstwie domowym z dzie??mi pozostaj??cymi na utrzymaniu</div>
									<FormControl component="fieldset" error={error.house_hold_status}>
										<RadioGroup aria-label="w tym: w gospodarstwie domowym z dzie??mi pozostaj??cymi na utrzymaniu" name="unemployed_status" value={house_hold_status} onChange={handleChangeHouseHoldStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
											<FormControlLabel value={3} control={<Radio />} label="ODMOWA INFORMACJI" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.house_hold_status ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
									<div className={classes.input_box_label} htmlFor="name">Osoba ??yj??ca w gospodarstwie sk??adaj??cym si?? z jednej osoby doros??ej i dzieci pozostaj??cych na utrzymaniu</div>
									<FormControl component="fieldset" error={error.house_hold_adult_status}>
										<RadioGroup aria-label="Osoba ??yj??ca w gospodarstwie sk??adaj??cym si?? z jednej osoby doros??ej i dzieci pozostaj??cych na utrzymaniu" name="unemployed_status" value={house_hold_adult_status} onChange={handleChangeHouseHoldAdultStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
											<FormControlLabel value={3} control={<Radio />} label="ODMOWA INFORMACJI" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.house_hold_adult_status ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
									<div className={classes.input_box_label} htmlFor="name">Osoba w innej niekorzystnej sytuacji spo??ecznej </div>
									<FormControl component="fieldset" error={error.uncomfortable_status}>
										<RadioGroup aria-label="Osoba w innej niekorzystnej sytuacji spo??ecznej " name="unemployed_status" value={uncomfortable_status} onChange={handleChangeUncomfortableStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
											<FormControlLabel value={3} control={<Radio />} label="ODMOWA INFORMACJI" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.uncomfortable_status ? 'block' : 'none' }}>Wybierz co najmniej jedn?? opcj??.</div>
								</Grid>
							</Grid>
						</Card>
					</Grid>
					<Grid item md={3} xs={12}>
						<Grid container spacing={3}>
							<Grid item xs={12}>
								<Card className={classes.form}>
									<Grid container spacing={2}>
										<div className={classes.form_title_right}>
										<Typography variant="h2" className={classes.form_title}>
											Informacje o uczestniku
										</Typography>
                  </div>
										<Grid item xs={6}>
											<div className={classes.input_box_label_left}>
												Numer uczestnika
											</div>
										</Grid>
										<Grid item xs={6}>
											<div className={classes.input_box_label_left}>
												{participant_number}
											</div>
										</Grid>
										<Grid item xs={6}>
											<div className={classes.input_box_label_left}>
												ORK
											</div>
										</Grid>
										<Grid item xs={6}>
											<div className={classes.input_box_label_left}>
												{rehabitationCenterList && rehabitationCenterList.length > 0 && rehabitation_center >= 1 && rehabitationCenterList[rehabitation_center - 1].name}
											</div>
										</Grid>
										<div className={classes.form_title_right}>
											Karty informacyjne
										</div>
										<Grid item xs={12}>
											<Button label="Zobacz kart?? informacyjn?? kandydata" variant="outlined" color="secondary" className={classes.btnOption} onClick={handleGotoInformation}>
												Zobacz kart?? informacyjn??
                    	</Button>
										</Grid>
										<div className={classes.form_title_right}>
											Indywidualny Program Rehabilitacji
										</div>
										<Grid item xs={12}>
											<Button variant="outlined" color="secondary" className={classes.btnOption} onClick={() => handleAddIpr(participant_number)}>
												Dodaj IPR
                    </Button>
										</Grid>
										<Grid item xs={12}>
											<Button variant="outlined" color="secondary" className={classes.btnIprList} onClick={() => handleIprList(`${name} ${surname}`)}>
												Zobacz list?? IPR uczestnika
                    	</Button>
										</Grid>
									</Grid>
								</Card>
							</Grid>
							<Grid item xs={12}>
								<Card className={classes.form}>
									<Grid container spacing={3}>
										<Grid item xs={12}>
											<div className={classes.top_label} htmlFor="name">Status uczestnika</div>
											<SingleSelect value={participant_status_type} handleChange={setParticipantStatusType} list={participantStatusTypeList} />
											<div className={classes.input_box_label} ><label htmlFor="comment">Komentarz dotycz??cy edycji (max 100 znak??w)</label></div>
											<TextareaAutosize className={clsx({ [classes.textArea]: true, [classes.error]: error.comment })} id="comment" value={comment} rowsMin={10} onChange={(e) => handleChangeComment(e.target.value)} placeholder="Utworzenie profilu uczestnika" />
											<Grid container spacing={2}>
												<Grid item xs={4}>
													<Button aria-label="Historia modyfikacji" variant="outlined" color="secondary" className={classes.btnOption} onClick={handleHistory}>
														<HistoryOutlinedIcon />
													</Button>
												</Grid>
												<Grid item xs={4}>
													<Button aria-label="Podgl??d" variant="outlined" color="secondary" className={classes.btnOption} onClick={handlePreview}>
														<FindInPageOutlinedIcon />
													</Button>
												</Grid>
												<Grid item xs={4}>
													<Button aria-label="Usu??" aria-label="Usu??" variant="outlined" color="secondary" className={classes.btnOption} onClick={handleDelete}>
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

export default ParticipantsEdit;
