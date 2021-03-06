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
import candidate from '../../apis/candidate';

import EXCEL from 'js-export-xlsx';
const Candidates = props => {
	const { children } = props;
	const { history } = props;
	const [sortOption, setSortOption] = useState({ sortBy: 0, sortOrder: "asc" });
	const [countList, setCountList] = useState([25, 50, 100]);
	const [selectedCount, setSelectedCount] = useState(25);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([]);
	const [totalCandidateList, setTotalCandidateList] = useState([]);
	const [educationList, setEducationList] = useState([]);
	const [voivodeshipList, setVoivodeshipList] = useState([]);
	const [communityList, setCommunityList] = useState([]);
	const [countyList, setCountyList] = useState([]);
	const [total, setTotal] = useState(0);
	const [searchId, setSearchId] = useState('');
	const [searchName, setSearchName] = useState('');
	const [searchSurname, setSearchSurname] = useState('');
	const [searchQualificationPoint, setSearchQualificationPoint] = useState(0);
	const [qualificationPointList, setQualificationPointList] = useState([]);
	const [status, setStatus] = useState(0);
	const [statusList, setStatusList] = useState([]);
	const [searchStatus, setSearchStatus] = useState(0);
	const [searchStage, setSearchStage] = useState(0);
	const [stageList, setStageList] = useState([]);
	const [searchDateModified, setSearchDateModified] = useState({ from: new Date('2020-01-01'), to: new Date('2050-12-31') });
	const [openModal, setOpenModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState(-1);
	const classes = useStyles();
	const breadcrumbs = [{ active: false, label: 'Kandydaci' }];

	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);
	useEffect(() => {
		candidate.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setStageList(response.data.stage);
					setQualificationPointList(response.data.qualification_point);
					setStatusList(response.data.status);
				}
			})
		candidate.getTotalList()
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
	}, [selectedCount, searchId, searchName, searchDateModified, searchStage, searchStatus, searchSurname, searchQualificationPoint]);

	const requestSort = (pSortBy) => {
		var sortOrder = "asc";
		if (pSortBy === sortOption.sortBy) {
			sortOrder = (sortOption.sortOrder === "asc" ? "desc" : "asc");
		}
		setSortOption({ sortBy: pSortBy, sortOrder: sortOrder })
	}

	const handleSearch = () => {
		candidate
			.getListByOption(sortOption.sortBy, sortOption.sortOrder, selectedCount, page, searchId, searchName, searchSurname, searchQualificationPoint, searchStage, searchStatus, searchDateModified)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						setData(response.data.candidates);
						setTotal(response.data.count);
					}
				}
			})
	}

	const handleCreate = () => {
		history.push('/candidates/create');
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
			item.push('PA??STWOWY FUNDUSZ REHABILITACJI OS??B NIEPE??NOSPRAWNYCH');
			item.push('Wypracowanie i pilota??owe wdro??enie modelu kompleksowej rehabilitacji umo??liwiaj??cej podj??cie lub powr??t do pracy ');
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
			item.push(parseInt(data.gender) === 1 ? 'kobieta' : 'm????czyzna')
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
				res = 'osoba pracuj??ca';
			}
			if (passive_person_status === '1') {
				res = 'osoba bierna zawodowo';
			}
			if (have_unemployed_person_status === '1' || seek_work_status === '1') {
				res = 'osoba bezrobotna zarejestrowana w ewidencji urz??d??w pracy';
			}
			if (employed_status === '2' && have_unemployed_person_status != '1') {
				res = 'osoba bezrobotna niezarejestrowana w ewidencji urz??d??w pracy';
			}
			
			item.push(res);
			
			if (long_term_employed_status === '1') {
				item.push('osoba d??ugotrwale bezrobotna')
			} else {
				item.push('inne');
			}

			item.push(data.occupation);
			item.push(data.employed_in);
			item.push(data.decision_central_commision === '2' ? 'inne' : '');
			item.push(data.decision_central_commision === '2' ? 'nie dotyczy' : '');
			item.push(data.decision_central_commision === '2' ? 'osoba nie otrzyma??a ??adnej oferty' : '');
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
			header: ['Numer umowy/ decyzji /aneksu', 'Nazwa beneficjenta', 'Tytu?? projektu', 'Okres realizacji projektu od', 'Okres realizacji projektu do',
			'Wniosek za okres', 'Kraj', 'Nazwa instytucji', 'NIP', 'Brak NIP', 'Typ instytucji', 'w tym', 'Wojew??dztwo', 'Powiat', 'Gmina',
			'Miejscowo????', 'Ulica', 'Nr budynku', 'Nr lokalu', 'Kod pocztowy', 'Obszar wg stopnia urbanizacji (DEGURBA)', 'Telefon kontaktowy', 'Adres e-mail',
			'Data rozpocz??cia udzia??u w projekcie', 'Data zako??czenia udzia??u w projekcie', 'Czy wsparciem zostali obj??ci pracownicy instytucji', 
			'Rodzaj przyznanego wsparcia', 'W tym', 'Data rozpocz??cia udzia??u we wsparciu', 'Data zako??czenia udzia??u we wsparciu', 
		  'Kraj', 'Rodzaj uczestnika', 'Nazwa instytucji', 'Imi??', 'Nazwisko', 'Pesel', 'Brak PESEL', 'P??e??', 'Wiek w chwili przyst??pienia do projektu', 'Wykszta??cenie',
		  'Wojew??dztwo', 'Powiat', 'Gmina', 'Miejscowo????', 'Ulica', 'Nr budynku', 'Nr budynku', 'Kod pocztowy', 'Obszar wg stopnia urbanizacji (DEGURBA)',
			'Telefon kontaktowy', 'Adres e-mail', 'Data rozpocz??cia udzia??u w projekcie', 'Data zako??czenia udzia??u w projekcie', 'Status osoby na rynku pracy w chwili przyst??pienia do projektu',
			'W tym', 'Wykonywany zaw??d', 'Zatrudniony w:', 'Sytuacja (1) osoby w momencie zako??czenia udzia??u w projekcie', 'Sytuacja (2) osoby w momencie zako??czenia udzia??u w projekcie',
			'Inne rezultaty dotycz??ce os??b m??odych (dotyczy IZM)', 'Zako??czenie udzia??u osoby w projekcie zgodnie z zaplanowan?? dla niej ??cie??k?? uczestnictwa',
			'Rodzaj przyznanego wsparcia', 'W tym', 'Data rozpocz??cia udzia??u we wsparciu', 'Data zako??czenia udzia??u we wsparciu', 'Data za??o??enia dzia??alno??ci gospodarczej',
			'Kwota ??rodk??w przyznanych na za??o??enie dzia??alno??ci gospodarczej', 'PKD za??o??onej dzia??alno??ci gospodarczej', 'Osoba nale????ca do mniejszo??ci narodowej lub etnicznej, migrant, osoba obcego pochodzenia',
			'Osoba bezdomna lub dotkni??ta wykluczeniem z dost??pu do mieszka??', 'Osoba z niepe??nosprawno??ciami', 'Osoba w innej niekorzystnej sytuacji spo??ecznej',
			'Planowana data zako??czenia edukacji w plac??wce edukacyjnej, w kt??rej skorzystano ze wsparcia'],
			data: export_data,
			name: 'SL'
		})
	}

	const handleExport = () => {
		candidate
			.getListByOption(sortOption.sortBy, sortOption.sortOrder, total, page, searchId, searchName, searchSurname, searchQualificationPoint, searchStage, searchStatus, searchDateModified)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						let _data = response.data.candidates;
						let export_data = [];
						for (let i = 0; i < _data.length; i++) {
							let item = [];
							item.push(_data[i].id);
							item.push(_data[i].name);
							item.push(_data[i].surname);
							let temp = '';
							for (let j = 0; j < qualificationPointList.length; j++) {
								if (parseInt(qualificationPointList[j].id) === parseInt(_data[i].qualification_point))
									temp = qualificationPointList[j].name;
							}
							item.push(temp);
							item.push(stageList[_data[i].stage - 1].name);
							let date = new Date(_data[i].updated_at);
							item.push(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
							export_data.push(item);
						}
						EXCEL.outPut({
							header: ['ID', 'Imi?? kandydata', 'Nazwisko kandydata', 'Punkt kwalifikacyjny', 'Etap rekrutacji', 'Data modyfikacji'],
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

	const handleCloseModal = () => {
		setOpenModal(false);
	}

	const handleDelete = () => {
		setProgressStatus(true);
		candidate
			.delete(selectedItem)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						setHasAlert(true);
						setMessage(response.message);
						setIsSuccess(response.code === 200);
					}
					setProgressStatus(false);
					handleSearch();
					setPage(1);
				}
			})

	}

	const handlePaginationLabel = (type, page, selected) => {
		if (type === 'first') {
			return 'Przejd?? do pierwszej strony'
		}
		if (type === 'previous') {
			return 'Wr???? do poprzedniej strony';
		}
		if (type === 'next') {
			return 'Przejd?? do nast??pnej strony';
		}
		if (type === 'last') {
			return 'Przejd?? do ostatniej strony';
		}
		return `Strona ${page}`;
	}

	return (
		<div className={classes.public}>
			<div className={classes.controlBlock}>
				<Button variant="contained" color="secondary" id="main" className={classes.btnCreate} onClick={handleCreate}>
					<AddIcon style={{ marginRight: '20px' }} />
          Dodaj kandydata
        </Button>
				<div>
					<Button variant="outlined" title="wielko???? pliku poni??ej 1 megabajt" color="secondary" className={classes.btnExport} onClick={handleExportSL}>
						Eksport listy do SL
					</Button>
					<Button variant="outlined" title="wielko???? pliku poni??ej 1 megabajt" color="secondary" className={classes.btnExport} onClick={handleExport}>
						Eksport listy do XLS
					</Button>
				</div>
			</div>
			<div className={classes.divide} />
			<div className={classes.filter}>
				<Breadcrumb list={breadcrumbs} />
				<div className={classes.rowsBlock}>
					<div>Poka??:</div>
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
					searchQualificationPoint={searchQualificationPoint}
					setSearchQualificationPoint={setSearchQualificationPoint}
					qualificationPointList={qualificationPointList}
					searchStage={searchStage}
					setSearchStage={setSearchStage}
					stageList={stageList}
					searchStatus={searchStatus}
					setSearchStatus={setSearchStatus}
					statusList={statusList}
					searchDateModified={searchDateModified}
					setSearchDateModified={setSearchDateModified}
					handleDelete={handleSelectedItem}
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
							aria-label="Przejd?? do nast??pnych stron wynik??w wyszukiwania wybieraj??c intersuj??ca ci?? stron??"/>
					</div>
				}
			</Card>
			<DeleteModal
				openModal={openModal}
				handleClose={handleCloseModal}
				handleDelete={handleDelete}
				selectedIndex={selectedItem}
			/>
		</div>
	);
};

export default Candidates;
