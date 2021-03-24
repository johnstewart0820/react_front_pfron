import React, { useState, useEffect } from 'react';
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
import PhoneInput from 'react-phone-input-2'
import clsx from 'clsx';
import MaskedInput from 'react-text-mask';
import { useTheme } from '@material-ui/styles';

const CandidatesAdd = props => {
	const { children } = props;
	const { history } = props;
	const theme = useTheme();
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
	const [education, setEducation] = useState(0);
	const [academic_title, setAcademicTitle] = useState('');
	const [stay_status, setStayStatus] = useState(0);
	const [children_applicable, setChildrenApplicable] = useState(false);
	const [children_amount, setChildrenAmount] = useState('0');
	const [children_age, setChildrenAge] = useState('');
	const [employed_status, setEmployedStatus] = useState(0);
	const [employed_type, setEmployedType] = useState([false, false, false, false, false]);
	const [employed_type_list, setEmployedTypeList] = useState([]);
	const [employed_in, setEmployedIn] = useState('');
	const [occupation, setOccupation] = useState('');
	const [unemployed_status, setUnemployedStatus] = useState(0);
	const [have_unemployed_person_status, setHaveUnemployedPersonStatus] = useState(0);
	const [unemployed_person_id, setUnemployedPersonId] = useState('');
	const [long_term_employed_status, setLongTermEmployedStatus] = useState(0);
	const [seek_work_status, setSeekWorkStatus] = useState(0);
	const [passive_person_status, setPassivePersonStatus] = useState(0);
	const [full_time_status, setFullTimeStatus] = useState(0);
	const [evening_student_status, setEveningStudentStatus] = useState(0);
	const [disabled_person_status, setDisabledPersonStatus] = useState(0);
	const [number_certificate, setNumberCertificate] = useState('0');
	const [date_of_certificate, setDateOfCertificate] = useState(new Date());
	const [level_certificate, setLevelCertificate] = useState('');
	const [code_certificate, setCodeCertificate] = useState('');
	const [necessary_certificate, setNecessaryCertificate] = useState('');
	const [ethnic_minority_status, setEthnicMinorityStatus] = useState(0);
	const [homeless_person_status, setHomelessPersonStatus] = useState(0);
	const [stay_house_status, setStayHouseStatus] = useState(0);
	const [house_hold_status, setHouseHoldStatus] = useState(0);
	const [house_hold_adult_status, setHouseHoldAdultStatus] = useState(0);
	const [uncomfortable_status, setUncomfortableStatus] = useState(0);
	const [progressStatus, setProgressStatus] = useState(false);
	const [error, setError] = useState({});

	useEffect(() => {
		candidate.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
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

	const handleGotoInformation = () => {

	}

	const handleError = () => {
		let _error = {}
		var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		_error.name = (name.length === 0);
		_error.surname = (surname.length === 0);
		_error.person_id = (validatepesel(person_id) !== true);
		_error.place_of_birth = (place_of_birth.length === 0);
		_error.street = (street.length === 0);
		_error.house_number = (house_number.length === 0);
		_error.post_code = (post_code.length === 0);
		_error.post_office = (post_office.length === 0);
		_error.city = (city.length === 0);
		_error.voivodeship = (parseInt(voivodeship) === 0);
		_error.community = (parseInt(community) === 0);
		_error.county = (parseInt(county) === 0);
		_error.comment = (comment.length === 0);
		_error.mobile_phone = (mobile_phone.length === 0);
		_error.home_phone = (home_phone.length === 0);
		_error.email = (email.length != 0 && !pattern.test(email));
		_error.family_home_phone = (family_home_phone.length === 0);
		_error.family_mobile_phone = (family_mobile_phone.length === 0);
		_error.education = (parseInt(education) === 0);
		_error.academic_title = (parseInt(education) === 10 && academic_title.length === 0)
		_error.stay_status = (parseInt(stay_status) === 0);
		_error.children_amount = (children_applicable && isNaN(children_amount));
		_error.children_age = (children_applicable && children_age.length === 0);
		_error.employed_status = (parseInt(employed_status) === 0);
		_error.employed_in = (parseInt(employed_status) === 1 && employed_in.length === 0)
		_error.occupation = (parseInt(employed_status) === 1 && occupation.length === 0)
		_error.unemployed_status = (parseInt(unemployed_status) === 0);
		_error.have_unemployed_person_status = (parseInt(have_unemployed_person_status) === 0);
		_error.unemployed_person_id = (parseInt(have_unemployed_person_status) === 1 && unemployed_person_id.length === 0);
		_error.long_term_employed_status = (parseInt(long_term_employed_status) === 0);
		_error.seek_work_status = (parseInt(seek_work_status) === 0);
		_error.passive_person_status = (parseInt(passive_person_status) === 0);
		_error.full_time_status = (parseInt(full_time_status) === 0);
		_error.evening_student_status = (parseInt(evening_student_status) === 0);
		_error.disabled_person_status = (parseInt(disabled_person_status) === 0);
		_error.number_certificate = (parseInt(disabled_person_status) === 1 && isNaN(number_certificate));
		_error.level_certificate = (parseInt(disabled_person_status) === 1 && level_certificate.length === 0);
		_error.code_certificate = (parseInt(disabled_person_status) === 1 && code_certificate.length === 0);
		_error.necessary_certificate = (parseInt(disabled_person_status) === 1 && necessary_certificate.length === 0)
		_error.ethnic_minority_status = (parseInt(ethnic_minority_status) === 0);
		_error.homeless_person_status = (parseInt(homeless_person_status) === 0);
		_error.stay_house_status = (parseInt(stay_house_status) === 0);
		_error.house_hold_status = (parseInt(house_hold_status) === 0);
		_error.house_hold_adult_status = (parseInt(house_hold_adult_status) === 0);
		_error.uncomfortable_status = (parseInt(uncomfortable_status) === 0);
		setError(_error);
	};

	const handleBack = () => {
		history.push('/candidates');
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
		var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		return (name.length === 0) ||
			(surname.length === 0) ||
			(validatepesel(person_id) !== true) ||
			(place_of_birth.length === 0) ||
			(street.length === 0) ||
			(house_number.length === 0) ||
			(post_code.length === 0) ||
			(post_office.length === 0) ||
			(city.length === 0) ||
			(parseInt(voivodeship) === 0) ||
			(parseInt(community) === 0) ||
			(parseInt(county) === 0) ||
			(comment.length === 0) ||
			(mobile_phone.length === 0) ||
			(home_phone.length === 0) ||
			(email.length != 0 && !pattern.test(email)) ||
			(family_home_phone.length === 0) ||
			(family_mobile_phone.length === 0) ||
			(parseInt(education) === 0) ||
			(parseInt(education) === 10 && academic_title.length === 0) ||
			(parseInt(stay_status) === 0) ||
			(children_applicable && isNaN(children_amount)) ||
			(children_applicable && children_age.length === 0) ||
			(parseInt(employed_status) === 0) ||
			(parseInt(employed_status) === 1 && employed_in.length === 0) ||
			(parseInt(employed_status) === 1 && occupation.length === 0) ||
			(parseInt(unemployed_status) === 0) ||
			(parseInt(have_unemployed_person_status) === 0) ||
			(parseInt(have_unemployed_person_status) === 1 && unemployed_person_id.length === 0) ||
			(parseInt(long_term_employed_status) === 0) ||
			(parseInt(seek_work_status) === 0) ||
			(parseInt(passive_person_status) === 0) ||
			(parseInt(full_time_status) === 0) ||
			(parseInt(evening_student_status) === 0) ||
			(parseInt(disabled_person_status) === 0) ||
			(parseInt(disabled_person_status) === 1 && isNaN(number_certificate)) ||
			(parseInt(disabled_person_status) === 1 && level_certificate.length === 0) ||
			(parseInt(disabled_person_status) === 1 && code_certificate.length === 0) ||
			(parseInt(disabled_person_status) === 1 && necessary_certificate.length === 0) ||
			(parseInt(ethnic_minority_status) === 0) ||
			(parseInt(homeless_person_status) === 0) ||
			(parseInt(stay_house_status) === 0) ||
			(parseInt(house_hold_status) === 0) ||
			(parseInt(house_hold_adult_status) === 0) ||
			(parseInt(uncomfortable_status) === 0);
	}

	const handleSave = () => {
		if (checkError()) {
			addToast(<label>Proszę wypełnić wszystkie wymagane pola.</label>, { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
			handleError();
		} else {
			setProgressStatus(true);

			candidate.create(name, surname, person_id, date_of_birth, place_of_birth, street, house_number, apartment_number, post_code, post_office, city,
				second_street, second_house_number, second_apartment_number, second_post_code, second_post_office, second_city,
				voivodeship, community, county, mobile_phone, home_phone, email, family_home_phone, family_mobile_phone,
				education, academic_title, stay_status, children_applicable, children_amount, children_age,
				employed_status, employed_type, employed_in, occupation, unemployed_status,
				have_unemployed_person_status, unemployed_person_id, long_term_employed_status, seek_work_status,
				passive_person_status, full_time_status, evening_student_status, disabled_person_status,
				number_certificate, date_of_certificate, level_certificate, code_certificate, necessary_certificate,
				ethnic_minority_status, homeless_person_status, stay_house_status, house_hold_status, house_hold_adult_status, uncomfortable_status,
				1, 1, comment)
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
			_error.employed_status = false;
			setEmployedIn('');
			setOccupation('');
			setError(_error);
		} else {
			_error.employed_status = false;
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
					<Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleBack}>
						Wróć do listy kandydatow
        </Button>
				</div>
				<Grid container spacing={3} className={classes.formBlock}>
					<Grid item xs={9}>
						<Card className={classes.form}>
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Dane kandydata
              </Grid>
								<Grid item xs={9}>
									<div className={classes.top_label}><label for="name">Imię(Imiona)</label></div>
									<input className={clsx({ [classes.input_box]: true, [classes.error]: error.name })} type="name" value={name} name="name" id="name" onChange={(e) => handleChangeName(e.target.value)} />
									<div className={classes.error_label} style={{ display: error.name ? 'block' : 'none' }}>Wpisz co najmniej jedną literę.</div>
									<div className={classes.input_box_label}><label htmlFor="surname">Nazwisko</label></div>
									<input className={clsx({ [classes.input_box]: true, [classes.error]: error.surname })} type="name" value={surname} name="surname" id="surname" onChange={(e) => handleChangeSurName(e.target.value)} />
									<div className={classes.error_label} style={{ display: error.surname ? 'block' : 'none' }}>Wpisz co najmniej jedną literę.</div>
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
												margin="normal"
												id="date_birth"
												value={date_of_birth}
												onChange={(value) => handleChangeDateOfBirth(value)}
												KeyboardButtonProps={{
													'aria-label': 'change date',
												}}
											/>
										</Grid>
									</Grid>
									<div className={classes.input_box_label}><label htmlFor="place_of_birth">Miejsce urodzenia</label></div>
									<input className={clsx({ [classes.input_box]: true, [classes.error]: error.place_of_birth })} type="name" value={place_of_birth} name="name" id="place_of_birth" onChange={(e) => handleChangePlaceOfBirth(e.target.value)} />
									<div className={classes.error_label} style={{ display: error.place_of_birth ? 'block' : 'none' }}>Wpisz co najmniej jedną literę.</div>
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Adres zameldowania
              </Grid>
								<Grid item xs={9}>
									<Grid container spacing={2}>
										<Grid item xs={6}>
											<div className={classes.top_label}><label htmlFor="street">Ulica</label></div>
											<input className={clsx({ [classes.input_box]: true, [classes.error]: error.street })} type="name" value={street} name="name" id="street" onChange={(e) => handleChangeStreet(e.target.value)} />
											<div className={classes.error_label} style={{ display: error.street ? 'block' : 'none' }}>Wpisz co najmniej jedną literę.</div>
										</Grid>
										<Grid item xs={3}>
											<div className={classes.top_label} ><label htmlFor="house_number">nr domu</label></div>
											<input className={clsx({ [classes.input_box]: true, [classes.error]: error.house_number })} type="name" value={house_number} name="name" id="house_number" onChange={(e) => handleChangeHouseNumber(e.target.value)} />
											<div className={classes.error_label} style={{ display: error.house_number ? 'block' : 'none' }}>Wpisz co najmniej jedną literę.</div>
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
											<div className={classes.error_label} style={{ display: error.post_code ? 'block' : 'none' }}>Wpisz co najmniej jedną literę.</div>
										</Grid>
										<Grid item xs={5}>
											<div className={classes.input_box_label} ><label htmlFor="post_office">Poczta</label></div>
											<input className={clsx({ [classes.input_box]: true, [classes.error]: error.post_office })} type="name" value={post_office} name="name" id="post_office" onChange={(e) => handleChangePostOffice(e.target.value)} />
											<div className={classes.error_label} style={{ display: error.post_office ? 'block' : 'none' }}>Wpisz co najmniej jedną literę.</div>
										</Grid>
										<Grid item xs={4}>
											<div className={classes.input_box_label} ><label htmlFor="city">Miejscowość</label></div>
											<input className={clsx({ [classes.input_box]: true, [classes.error]: error.city })} type="name" value={city} name="name" id="city" onChange={(e) => handleChangeCity(e.target.value)} />
											<div className={classes.error_label} style={{ display: error.city ? 'block' : 'none' }}>Wpisz co najmniej jedną literę.</div>
										</Grid>
									</Grid>
									<div className={classes.input_box_label} ><label htmlFor="voivodeship">Województwo</label></div>
									<SingleSelect value={voivodeship} handleChange={(value) => handleChangeVoivodeship(value)} list={voivodeshipList} error={error.voivodeship} />
									<div className={classes.error_label} style={{ display: error.voivodeship ? 'block' : 'none' }}>Wybierz prowincję</div>
									<div className={classes.input_box_label} htmlFor="type">Powiat</div>
									<SingleSelect value={county} handleChange={(value) => handleChangeCounty(value)} list={countyList} error={error.county} />
									<div className={classes.error_label} style={{ display: error.county ? 'block' : 'none' }}>Wybierz powiat</div>
									<div className={classes.input_box_label} htmlFor="type">Gmina</div>
									<SingleSelect value={community} handleChange={(value) => handleChangeCommunity(value)} list={communityList} error={error.community} />
									<div className={classes.error_label} style={{ display: error.community ? 'block' : 'none' }}>Wybierz gminę</div>
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Dane kontaktowe
              </Grid>
								<Grid item xs={9}>
									<div className={classes.input_box_label}><label htmlFor="mobile_phone">Telefon komórkowy</label></div>
									<PhoneInput country="pl" value={mobile_phone} onChange={handleChangeMobilePhone} inputClass={classes.phone_input} id="mobile_phone" dropdownClass={classes.phone_drop_down} buttonClass={classes.buttonStyle}/>
									<div className={classes.error_label} style={{ display: error.mobile_phone ? 'block' : 'none' }}>Wpisz poprawny telefon (typ: (xx)(xxx-xxx-xxx)).</div>
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
									<div className={classes.input_box_label} htmlFor="type">Numer kontaktowy do bliskiej osoby - Telefon komórkowy</div>
									<PhoneInput country="pl" value={family_mobile_phone} onChange={handleChangeFamilyMobilePhone} inputClass={classes.phone_input} dropdownClass={classes.phone_drop_down} buttonClass={classes.buttonStyle}/>
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
								<Grid item xs={3} >
									<div className={classes.form_title}>
										Adres korespondencyjny
                </div>
									<div className={classes.form_title_small}>
										(wypełnić jeśli inny niż adres zameldowania)
                </div>
								</Grid>
								<Grid item xs={9}>
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
											<div className={classes.input_box_label} ><label htmlFor="second_city">Miejscowość</label></div>
											<input className={classes.input_box} type="name" value={second_city} name="name" id="second_city" onChange={(e) => setSecondCity(e.target.value)} />
										</Grid>
									</Grid>
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3}>
								<Grid item xs={3} className={classes.form_title}>
									Wykształcenie
              </Grid>
								<Grid item xs={9}>
									<FormControl component="fieldset" error={error.education}>
										<RadioGroup aria-label="gender" name="education" value={education} onChange={handleChangeEducation}>
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
													<div className={classes.input_box_label} htmlFor="name">Tytuł naukowy</div>
													<input className={clsx({ [classes.input_box]: true, [classes.error]: error.academic_title })} type="name" value={academic_title} name="name" onChange={(e) => handleChangeAcademicTitle(e.target.value)} />
													<div className={classes.error_label} style={{ display: error.academic_title ? 'block' : 'none' }}>Wpisz co najmniej jedną literę.</div>
												</Grid>
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
									<div className={classes.input_box_label} htmlFor="name">Ze względów logistycznych (brak możliwości codziennych dojazdów) deklaruję pobyt stacjonarny w Ośrodku Kompleksowej Rehabilitacji</div>
									<FormControl component="fieldset" error={error.stay_status}>
										<RadioGroup aria-label="gender" name="education" value={stay_status} onChange={handleChangeStayStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.stay_status ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
									<div>
										<FormControl component="fieldset">
											<FormControlLabel
												className={classes.rememberMe}
												control={
													<Checkbox
														onChange={() => handleChangeChildrenApplicable(!children_applicable)}
													/>
												}
												label='Jestem jedynym opiekunem prawnym dzieci, które musza przebywać ze mną'
											/>
										</FormControl>
									</div>
									{
										children_applicable ?
											<Grid container spacing={3}>
												<Grid item xs={1}></Grid>
												<Grid item xs={5}>
													<div className={classes.input_box_label} htmlFor="name">Liczba dzieci</div>
													<input className={clsx({ [classes.input_box]: true, [classes.error]: error.children_amount })} type="name" value={children_amount} name="name" onChange={(e) => handleChangeChildrenAmount(e.target.value)} />
													<div className={classes.error_label} style={{ display: error.children_amount ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
												</Grid>
												<Grid item xs={6}>
													<div className={classes.input_box_label} htmlFor="name">Wiek</div>
													<input className={clsx({ [classes.input_box]: true, [classes.error]: error.children_age })} type="name" value={children_age} name="name" onChange={(e) => handleChangeChildrenAge(e.target.value)} />
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
								<Grid item xs={3} >
									<div className={classes.form_title}>
										Status na rynku pracy
                </div>
									<div className={classes.form_title_small}>
										(proszę zazaczyć właściwy)
                </div>
								</Grid>
								<Grid item xs={9}>
									<div className={classes.input_box_label} htmlFor="name">Jestem zatrudniony</div>
									<FormControl component="fieldset" error={error.employed_status}>
										<RadioGroup aria-label="gender" name="employed_status" value={employed_status} onChange={handleChangeEmployedStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.employed_status ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
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
												<div className={classes.input_box_label} htmlFor="name">Jestem zatrudniony w</div>
												<input className={clsx({ [classes.input_box]: true, [classes.error]: error.employed_in })} type="name" value={employed_in} name="name" onChange={(e) => handleChangeEmplotedIn(e.target.value)} />
												<div className={classes.error_label} style={{ display: error.employed_in ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
												<div className={classes.input_box_label} htmlFor="name">Wykonywany zawód</div>
												<input className={clsx({ [classes.input_box]: true, [classes.error]: error.occupation })} type="name" value={occupation} name="name" onChange={(e) => handleChangeOccupation(e.target.value)} />
												<div className={classes.error_label} style={{ display: error.occupation ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
											</div>
											:
											<></>
									}
									<div className={classes.input_box_label} htmlFor="name">Jestem osobą bezrobotną</div>
									<FormControl component="fieldset" error={error.unemployed_status}>
										<RadioGroup aria-label="gender" name="unemployed_status" value={unemployed_status} onChange={handleChangeUnemployedStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.unemployed_status ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
									<div className={classes.input_box_label} htmlFor="name">Jestem zarejestrowany/a w PUP i posiadam status osoby bezrobotnej</div>
									<FormControl component="fieldset" error={error.have_unemployed_person_status}>
										<RadioGroup aria-label="gender" name="have_unemployed_person_status" value={have_unemployed_person_status} onChange={handleChangeHaveUnemployedPersonStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.have_unemployed_person_status ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
									{
										have_unemployed_person_status === 1 ?
											<>
												<div className={classes.input_box_label} htmlFor="name">Numer statusu osoby bezrobotnej</div>
												<input className={clsx({ [classes.input_box]: true, [classes.error]: error.unemployed_person_id })} type="name" value={unemployed_person_id} name="name" onChange={(e) => handleChangeUnemployedPersonId(e.target.value)} />
												<div className={classes.error_label} style={{ display: error.have_unemployed_person_status ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
											</>
											:
											<></>
									}

									<div className={classes.input_box_label} htmlFor="name">Jestem osobą długotrwale bezrobotną</div>
									<FormControl component="fieldset" error={error.long_term_employed_status}>
										<RadioGroup aria-label="gender" name="unemployed_status" value={long_term_employed_status} onChange={handleChangeLongTermEmployedStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.long_term_employed_status ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
									<div className={classes.input_box_label} htmlFor="name">Jestem zarejestrowany/a w PUP jako osoba poszukująca pracy</div>
									<FormControl component="fieldset" error={error.seek_work_status}>
										<RadioGroup aria-label="gender" name="unemployed_status" value={seek_work_status} onChange={handleChangeSeekWorkStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.seek_work_status ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
									<div className={classes.input_box_label} htmlFor="name">Jestem osobą bierną zawodowo</div>
									<FormControl component="fieldset" error={error.passive_person_status}>
										<RadioGroup aria-label="gender" name="unemployed_status" value={passive_person_status} onChange={handleChangePassivePersonStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.passive_person_status ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
									<div className={classes.input_box_label} htmlFor="name">Jestem uczniem /studentem uczącym się w systemie dziennym</div>
									<FormControl component="fieldset" error={error.full_time_status}>
										<RadioGroup aria-label="gender" name="unemployed_status" value={full_time_status} onChange={handleChangeFullTimeStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.full_time_status ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
									<div className={classes.input_box_label} htmlFor="name">Jestem osobą kształcąca się w systemie wieczorowym/pozaszkolnym</div>
									<FormControl component="fieldset" error={error.evening_student_status}>
										<RadioGroup aria-label="gender" name="unemployed_status" value={evening_student_status} onChange={handleChangeEveningStudentStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.evening_student_status ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
									<div className={classes.input_box_label} htmlFor="name">Jestem osobą niepełnosprawną i posiadam orzeczenie</div>
									<FormControl component="fieldset" error={error.disabled_person_status}>
										<RadioGroup aria-label="gender" name="unemployed_status" value={disabled_person_status} onChange={handleChangeDisabledPersonStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.disabled_person_status ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
									{
										disabled_person_status === 1 ?
											<Grid container spacing={1}>
												<Grid item xs={8}>
													<div className={classes.input_box_label} htmlFor="name">Numer orzeczenia o niepełnosprawności</div>
													<input className={clsx({ [classes.input_box]: true, [classes.error]: error.number_certificate })} type="name" value={number_certificate} name="name" onChange={(e) => handleChangeNumberCertificate(e.target.value)} />
													<div className={classes.error_label} style={{ display: error.number_certificate ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
												</Grid>
												<Grid item xs={4}>
													<div className={classes.input_box_label} htmlFor="name">Data ważności</div>
													<KeyboardDatePicker
														disableToolbar
														className={classes.date_picker}
														variant="inline"
														format="dd.MM.yyyy"
														margin="normal"
														id="date-picker-inline"
														value={date_of_certificate}
														onChange={(value) => handleChangeDateOfCertificate(value)}
														KeyboardButtonProps={{
															'aria-label': 'change date',
														}}
													/>
												</Grid>
												<Grid item xs={8}>
													<div className={classes.input_box_label} htmlFor="name">Stopień niepełnosprawności</div>
													<input className={clsx({ [classes.input_box]: true, [classes.error]: error.level_certificate })} type="name" value={level_certificate} name="name" onChange={(e) => handleChangeLevelCertificate(e.target.value)} />
													<div className={classes.error_label} style={{ display: error.level_certificate ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
												</Grid>
												<Grid item xs={4}>
													<div className={classes.input_box_label} htmlFor="name">Kod orzeczenia</div>
													<input className={clsx({ [classes.input_box]: true, [classes.error]: error.code_certificate })} type="name" value={code_certificate} name="name" onChange={(e) => handleChangeCodeCertificate(e.target.value)} />
													<div className={classes.error_label} style={{ display: error.code_certificate ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
												</Grid>
												<div className={classes.input_box_label} htmlFor="name">Konieczne wymagania związane z niepełnosprawnością (np. pomoc asystenta, tłumacza migowego)</div>
												<input className={clsx({ [classes.input_box]: true, [classes.error]: error.necessary_certificate })} type="name" value={necessary_certificate} name="name" onChange={(e) => handleChangeNecessaryCertificate(e.target.value)} />
												<div className={classes.error_label} style={{ display: error.necessary_certificate ? 'block' : 'none' }}>Wpisz poprawne informacje.</div>
											</Grid>
											:
											<></>
									}
								</Grid>
							</Grid>
							<div className={classes.divide} />
							<Grid container spacing={3} className={classes.form_title}>
								<Grid item xs={3} >
									Inne
              </Grid>
								<Grid item xs={9}>
									<div className={classes.input_box_label} htmlFor="name">Osoba należąca do mniejszości narodowej lub etnicznej, migrant, osoba obcego pochodzenia</div>
									<FormControl component="fieldset" error={error.ethnic_minority_status}>
										<RadioGroup aria-label="gender" name="unemployed_status" value={ethnic_minority_status} onChange={handleChangeEthnicMinorityStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
											<FormControlLabel value={3} control={<Radio />} label="ODMOWA INFORMACJI" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.ethnic_minority_status ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
									<div className={classes.input_box_label} htmlFor="name">Osoba bezdomna lub dotknięta wykluczeniem z dostępu do mieszkań</div>
									<FormControl component="fieldset" error={error.homeless_person_status}>
										<RadioGroup aria-label="gender" name="unemployed_status" value={homeless_person_status} onChange={handleChangeHomelessPersonStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
											<FormControlLabel value={3} control={<Radio />} label="ODMOWA INFORMACJI" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.homeless_person_status ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
									<div className={classes.input_box_label} htmlFor="name">Osoba przebywająca w gospodarstwie domowym bez osób pracujących</div>
									<FormControl component="fieldset" error={error.stay_house_status}>
										<RadioGroup aria-label="gender" name="unemployed_status" value={stay_house_status} onChange={handleChangeStayHouseStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
											<FormControlLabel value={3} control={<Radio />} label="ODMOWA INFORMACJI" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.stay_house_status ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
									<div className={classes.input_box_label} htmlFor="name">w tym: w gospodarstwie domowym z dziećmi pozostającymi na utrzymaniu</div>
									<FormControl component="fieldset" error={error.house_hold_status}>
										<RadioGroup aria-label="gender" name="unemployed_status" value={house_hold_status} onChange={handleChangeHouseHoldStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
											<FormControlLabel value={3} control={<Radio />} label="ODMOWA INFORMACJI" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.house_hold_status ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
									<div className={classes.input_box_label} htmlFor="name">Osoba żyjąca w gospodarstwie składającym się z jednej osoby dorosłej i dzieci pozostających na utrzymaniu</div>
									<FormControl component="fieldset" error={error.house_hold_adult_status}>
										<RadioGroup aria-label="gender" name="unemployed_status" value={house_hold_adult_status} onChange={handleChangeHouseHoldAdultStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
											<FormControlLabel value={3} control={<Radio />} label="ODMOWA INFORMACJI" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.house_hold_adult_status ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
									<div className={classes.input_box_label} htmlFor="name">Osoba w innej niekorzystnej sytuacji społecznej </div>
									<FormControl component="fieldset" error={error.uncomfortable_status}>
										<RadioGroup aria-label="gender" name="unemployed_status" value={uncomfortable_status} onChange={handleChangeUncomfortableStatus} row>
											<FormControlLabel value={1} control={<Radio />} label="Tak" />
											<FormControlLabel value={2} control={<Radio />} label="Nie" />
											<FormControlLabel value={3} control={<Radio />} label="ODMOWA INFORMACJI" />
										</RadioGroup>
									</FormControl>
									<div className={classes.error_label} style={{ display: error.uncomfortable_status ? 'block' : 'none' }}>Wybierz co najmniej jedną opcję.</div>
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
											<div className={classes.input_box_label} ><label htmlFor="comment">Komentarz dotyczący edycji (max 100 znaków)</label></div>
											<TextareaAutosize className={clsx({ [classes.textArea]: true, [classes.error]: error.comment })} id="comment" value={comment} rowsMin={10} onChange={(e) => handleChangeComment(e.target.value)} placeholder="Utworzenie profilu uczestnika" />
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
		</MuiPickersUtilsProvider>
	);
};

export default CandidatesAdd;
