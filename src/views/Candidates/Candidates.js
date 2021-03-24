import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
	Button, Card, CircularProgress
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@material-ui/icons/Add';
import { Breadcrumb } from 'components';
import { SortTable, SingleSelect, DeleteModal } from './components';
import candidate from '../../apis/candidate';
import { useToasts } from 'react-toast-notifications'
import EXCEL from 'js-export-xlsx';

const Candidates = props => {
	const { children } = props;
	const { history } = props;
	const [sortOption, setSortOption] = useState({ sortBy: 0, sortOrder: "asc" });
	const [countList, setCountList] = useState([25, 50, 100]);
	const [selectedCount, setSelectedCount] = useState(25);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([]);
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
	const [progressStatus, setProgressStatus] = useState(false);
	const { addToast } = useToasts()
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

	const handleExport = () => {
		let export_data = [];
		for (let i = 0; i < data.length; i++) {
			let item = [];
			item.push(data[i].id);
			item.push(data[i].name);
			item.push(data[i].surname);
			let temp = '';
			for (let j = 0; j < qualificationPointList.length; j++) {
				if (parseInt(qualificationPointList[j].id) === parseInt(data[i].qualification_point))
					temp = qualificationPointList[j].name;
			}
			item.push(temp);
			item.push(stageList[data[i].stage - 1].name);
			let date = new Date(data[i].updated_at);
			item.push(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
			export_data.push(item);
		}
		EXCEL.outPut({
			header: ['ID', 'Imię kandydata', 'Nazwisko kandydata', 'Punkt kwalifikacyjny', 'Etap rekutacji', 'Data modyfikacji'],
			data: export_data,
			name: 'download'
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
						addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true })
					}
					setProgressStatus(false);
					handleSearch();
					setPage(1);
				}
			})

	}

	return (
		<div className={classes.public}>
			<div className={classes.controlBlock}>
				<Button variant="contained" color="secondary" className={classes.btnCreate} onClick={handleCreate}>
					<AddIcon style={{ marginRight: '20px' }} />
          Dodaj kandydata
        </Button>
				<Button variant="outlined" color="secondary" className={classes.btnExport} onClick={handleExport}>
					Eksport listy do XLS
        </Button>
			</div>
			<div className={classes.divide} />
			<div className={classes.filter}>
				<Breadcrumb list={breadcrumbs} />
				<div className={classes.rowsBlock}>
					<div>Pokaz:</div>
					<SingleSelect value={selectedCount} handleChange={setSelectedCount} list={countList} />
					<div>pozycji</div>
				</div>
			</div>
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
				<div className={classes.pagination}>
					<Pagination
						className={classes.pagenation_class}
						count={total % selectedCount == 0 ? total / selectedCount : parseInt(total / selectedCount) + 1}
						onChange={(e, page) => { setPage(page) }}
						page={page}
						showFirstButton
						showLastButton />
				</div>
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
