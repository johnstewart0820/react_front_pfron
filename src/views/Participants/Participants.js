import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Card, CircularProgress
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@material-ui/icons/Add';
import { Breadcrumb } from 'components';
import { SortTable, SingleSelect, DeleteModal } from './components';
import participant from '../../apis/participant';

import EXCEL from 'js-export-xlsx';

const Participants = props => {
	const { children } = props;
	const { history } = props;
	const [sortOption, setSortOption] = useState({ sortBy: 0, sortOrder: "asc" });
	const [countList, setCountList] = useState([25, 50, 100]);
	const [selectedCount, setSelectedCount] = useState(25);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([]);
	const [total, setTotal] = useState(0);
	const [totalCandidateList, setTotalCandidateList] = useState([]);
	const [educationList, setEducationList] = useState([]);
	const [voivodeshipList, setVoivodeshipList] = useState([]);
	const [communityList, setCommunityList] = useState([]);
	const [countyList, setCountyList] = useState([]);
	const [searchId, setSearchId] = useState('');
	const [searchName, setSearchName] = useState('');
	const [searchSurname, setSearchSurname] = useState('');
	const [searchRehabitationCenter, setSearchRehabitationCenter] = useState(0);
	const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
	const [searchParticipantStatusType, setSearchParticipantStatusType] = useState(0);
	const [participantStatusTypeList, setParticipantStatusTypeList] = useState([]);
	const [searchDateModified, setSearchDateModified] = useState({ from: new Date('2020-01-01'), to: new Date('2050-12-31') });
	const [openModal, setOpenModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState(-1);
	const classes = useStyles();
	const breadcrumbs = [{ active: true, label: 'Uczestnicy', href: '/participants' }, { active: false, label: 'Lista uczestników' }];
	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);

	useEffect(() => {
		participant.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setRehabitationCenterList(response.data.rehabitation_center);
					setParticipantStatusTypeList(response.data.participant_status_type);
				}
			})
		participant.getTotalList()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setTotalCandidateList(response.data.candidates);
					setEducationList(response.data.educations);
					setVoivodeshipList(response.data.voivodeships);
					setCommunityList(response.data.communities);
					setCountyList(response.data.counties);
				}
			})
		handleSearch();
	}, []);

	useEffect(() => {
		handleSearch();
	}, [sortOption, page]);

	useEffect(() => {
		handleSearch();
		setPage(1);
	}, [selectedCount, searchId, searchName, searchDateModified, searchRehabitationCenter, searchParticipantStatusType, searchSurname]);

	const requestSort = (pSortBy) => {
		var sortOrder = "asc";
		if (pSortBy === sortOption.sortBy) {
			sortOrder = (sortOption.sortOrder === "asc" ? "desc" : "asc");
		}
		setSortOption({ sortBy: pSortBy, sortOrder: sortOrder })
	}

	const handleSearch = () => {
		participant
			.getListByOption(sortOption.sortBy, sortOption.sortOrder, selectedCount, page, searchId, searchName, searchSurname, searchRehabitationCenter, searchParticipantStatusType, searchDateModified)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						setData(response.data.participant);
						setTotal(response.data.count);
					}
				}
			})
	}

	const getValueFromArray = ( arr, current) => {
		let ind = -1;
		arr.map((item, index) => {
			if (item.id == current)
				ind = index;
		})
		return arr[ind].name;
	}

	const getDateString = (value) => {
		if (value === null)
			return '';
		let date = new Date(value);
		return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
	}

	const handleExportSL = () => {
		let export_data = [];

		totalCandidateList.map((data, index) => {
			let item = [];
			item.push('POWR.02.06.00-00-0057/17-01');
			item.push('PAŃSTWOWY FUNDUSZ REHABILITACJI OSÓB NIEPEŁNOSPRAWNYCH');
			item.push('Wypracowanie i pilotażowe wdrożenie modelu kompleksowej rehabilitacji umożliwiającej podjęcie lub powrót do pracy ');
			item.push('1/1/2018');
			item.push('12/31/2023');
			item.push('-');
			for(let j = 0; j < 24; j ++)
				item.push('');
			item.push('Polska');
			item.push('indywidualny');
			item.push('');
			item.push(data.name);
			item.push(data.surname);
			item.push(data.person_id);
			item.push('Nie');
			item.push(parseInt(data.gender) === 1 ? 'kobieta' : 'mężczyzna')
			item.push(parseInt(data.age))
			item.push(parseInt(data.education) === 0 ? '' : getValueFromArray(educationList, data.education))
			item.push(parseInt(data.voivodeship) === 0 ? '' : getValueFromArray(voivodeshipList, data.voivodeship))
			item.push(parseInt(data.county) === 0 ? '' : getValueFromArray(countyList, data.county))
			item.push(parseInt(data.community) === 0 ? '' : getValueFromArray(communityList, data.community))
			item.push(data.city);
			item.push(data.street);
			item.push(data.house_number);
			item.push(data.apartment_number);
			item.push(data.post_code);
			item.push('');
			item.push(data.mobile_phone === '48' ? '' : data.mobile_phone);
			item.push(data.email);
			item.push(getDateString(data.doctor_date));
			item.push(getDateString(data.date_central_commision));
			let employed_status = data.employed_status;
			let passive_person_status = data.passive_person_status;
			let have_unemployed_person_status = data.have_unemployed_person_status;
			let seek_work_status = data.seek_work_status;
			let unemployed_status = data.unemployed_status;
			let long_term_employed_status = data.long_term_employed_status;
			let res = '';
			if (employed_status === '1') {
				res = 'osoba pracująca';
			}
			if (passive_person_status === '1') {
				res = 'osoba bierna zawodowo';
			}
			if (have_unemployed_person_status === '1' || seek_work_status === '1') {
				res = 'osoba bezrobotna zarejestrowana w ewidencji urzędów pracy';
			}
			if (employed_status === '2' && have_unemployed_person_status != '1') {
				res = 'osoba bezrobotna niezarejestrowana w ewidencji urzędów pracy';
			}
			
			item.push(res);
			
			if (long_term_employed_status === '1') {
				item.push('osoba długotrwale bezrobotna')
			} else {
				item.push('inne');
			}

			item.push(data.occupation);
			item.push(data.employed_in);
			item.push(data.decision_central_commision === '2' ? 'inne' : '');
			item.push(data.decision_central_commision === '2' ? 'nie dotyczy' : '');
			item.push(data.decision_central_commision === '2' ? 'osoba nie otrzymała żadnej oferty' : '');
			item.push(data.decision_central_commision === '2' ? 'Tak' : '');

			for (let j = 0; j < 7; j ++)
				item.push('');

			let arr = ['Tak', 'Nie', 'Odmowa podania informacji'];

			item.push(data.ethnic_minority_status ? arr[parseInt(data.ethnic_minority_status) - 1] : '');
			item.push(data.homeless_person_status ? arr[parseInt(data.homeless_person_status) - 1] : '');
			item.push(data.disabled_person_status === '1' ? 'Tak' : 'Nie')
			item.push(data.uncomfortable_status ? arr[parseInt(data.uncomfortable_status) - 1] : '');
			item.push('');

			export_data.push(item);
		}) 
		EXCEL.outPut({
			header: ['Numer umowy/ decyzji /aneksu', 'Nazwa beneficjenta', 'Tytuł projektu', 'Okres realizacji projektu od', 'Okres realizacji projektu do',
			'Wniosek za okres', 'Kraj', 'Nazwa instytucji', 'NIP', 'Brak NIP', 'Typ instytucji', 'w tym', 'Województwo', 'Powiat', 'Gmina',
			'Miejscowość', 'Ulica', 'Nr budynku', 'Nr lokalu', 'Kod pocztowy', 'Obszar wg stopnia urbanizacji (DEGURBA)', 'Telefon kontaktowy', 'Adres e-mail',
			'Data rozpoczęcia udziału w projekcie', 'Data zakończenia udziału w projekcie', 'Czy wsparciem zostali objęci pracownicy instytucji', 
			'Rodzaj przyznanego wsparcia', 'W tym', 'Data rozpoczęcia udziału we wsparciu', 'Data zakończenia udziału we wsparciu', 
		  'Kraj', 'Rodzaj uczestnika', 'Nazwa instytucji', 'Imię', 'Nazwisko', 'Pesel', 'Brak PESEL', 'Płeć', 'Wiek w chwili przystąpienia do projektu', 'Wykształcenie',
		  'Województwo', 'Powiat', 'Gmina', 'Miejscowość', 'Ulica', 'Nr budynku', 'Nr budynku', 'Kod pocztowy', 'Obszar wg stopnia urbanizacji (DEGURBA)',
			'Telefon kontaktowy', 'Adres e-mail', 'Data rozpoczęcia udziału w projekcie', 'Data zakończenia udziału w projekcie', 'Status osoby na rynku pracy w chwili przystąpienia do projektu',
			'W tym', 'Wykonywany zawód', 'Zatrudniony w:', 'Sytuacja (1) osoby w momencie zakończenia udziału w projekcie', 'Sytuacja (2) osoby w momencie zakończenia udziału w projekcie',
			'Inne rezultaty dotyczące osób młodych (dotyczy IZM)', 'Zakończenie udziału osoby w projekcie zgodnie z zaplanowaną dla niej ścieżką uczestnictwa',
			'Rodzaj przyznanego wsparcia', 'W tym', 'Data rozpoczęcia udziału we wsparciu', 'Data zakończenia udziału we wsparciu', 'Data założenia działalności gospodarczej',
			'Kwota środków przyznanych na założenie działalności gospodarczej', 'PKD założonej działalności gospodarczej', 'Osoba należąca do mniejszości narodowej lub etnicznej, migrant, osoba obcego pochodzenia',
			'Osoba bezdomna lub dotknięta wykluczeniem z dostępu do mieszkań', 'Osoba z niepełnosprawnościami', 'Osoba w innej niekorzystnej sytuacji społecznej',
			'Planowana data zakończenia edukacji w placówce edukacyjnej, w której skorzystano ze wsparcia'],
			data: export_data,
			name: 'SL'
		})
	}
	const handleExport = () => {
		participant
			.getListByOption(sortOption.sortBy, sortOption.sortOrder, total, page, searchId, searchName, searchSurname, searchRehabitationCenter, searchParticipantStatusType, searchDateModified)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						let _data = response.data.participant;
						let export_data = [];
						for (let i = 0; i < _data.length; i++) {
							let item = [];
							item.push(_data[i].id);
							item.push(_data[i].name);
							item.push(_data[i].surname);
							item.push(_data[i].rehabitation_center >= 1 ? rehabitationCenterList[_data[i].rehabitation_center - 1].name : '');
							item.push(_data[i].participant_status_type >= 1 ? participantStatusTypeList[_data[i].participant_status_type - 1].name : '');
							let date = new Date(_data[i].updated_at);
							item.push(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
							export_data.push(item);
						}
						EXCEL.outPut({
							header: ['ID', 'Imię uczestnika', 'Nazwisko uczestnika', 'Ośrodek', 'Status', 'Data modyfikacji'],
							data: export_data,
							name: 'download'
						})
					}
				}
			})

	}

	const handleSelectedItem = (id) => {
		setSelectedItem(id);
		setOpenModal(true);
	}

	const handlePaginationLabel = (type, page, selected) => {
		if (type === 'first') {
			return 'Przejdź do pierwszej strony'
		}
		if (type === 'previous') {
			return 'Wróć do poprzedniej strony';
		}
		if (type === 'next') {
			return 'Przejdź do następnej strony';
		}
		if (type === 'last') {
			return 'Przejdź do ostatniej strony';
		}
		return `Strona ${page}`;
	}

	return (
		<div className={classes.public}>
			<div className={classes.controlBlock}>
				<Button title="wielkość pliku poniżej 1 megabajt" variant="outlined" color="secondary" className={classes.btnExport} onClick={handleExportSL}>
					Eksport listy do SL
				</Button>
				<Button title="wielkość pliku poniżej 1 megabajt" variant="outlined" color="secondary" className={classes.btnExport} onClick={handleExport}>
					Eksport listy do XLS
        </Button>

			</div>
			<div className={classes.divide} />
			<div className={classes.filter}>
				<Breadcrumb list={breadcrumbs} />
				<div className={classes.rowsBlock}>
					<div>Pokaż:</div>
					<SingleSelect value={selectedCount} handleChange={setSelectedCount} list={countList} />
					<div>pozycji</div>
				</div>
			</div>
			<Alert
				hasAlert={hasAlert}
				setHasAlert={setHasAlert}
				isSuccess={isSuccess}
				message={message}
			/>
			<Card className={classes.table}>
				<SortTable
					rows={data}
					requestSort={requestSort}
					sortOrder={sortOption.sortOrder}
					sortBy={sortOption.sortBy}
					total={total}
					page={page}
					selectedCount={selectedCount}
					searchId={searchId}
					setSearchId={setSearchId}
					searchName={searchName}
					setSearchName={setSearchName}
					searchSurname={searchSurname}
					setSearchSurname={setSearchSurname}
					searchRehabitationCenter={searchRehabitationCenter}
					rehabitationCenterList={rehabitationCenterList}
					setSearchRehabitationCenter={setSearchRehabitationCenter}
					searchParticipantStatusType={searchParticipantStatusType}
					setSearchParticipantStatusType={setSearchParticipantStatusType}
					participantStatusTypeList={participantStatusTypeList}
					searchDateModified={searchDateModified}
					setSearchDateModified={setSearchDateModified}
				/>
				{
					total > selectedCount &&
					<div className={classes.pagination}>
						<Pagination
							className={classes.pagenation_class}
							count={total % selectedCount == 0 ? total / selectedCount : parseInt(total / selectedCount) + 1}
							onChange={(e, page) => { setPage(page) }}
							page={page}
							getItemAriaLabel={handlePaginationLabel}
							showFirstButton
							showLastButton
							aria-label="Przejdź do następnych stron wyników wyszukiwania wybierając intersująca cię stronę" />
					</div>
				}
			</Card>
		</div>
	);
};

export default Participants;
