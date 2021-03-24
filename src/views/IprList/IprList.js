import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
	Button, Card
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@material-ui/icons/Add';
import { Breadcrumb } from 'components';
import { SortTable, SingleSelect, DeleteModal } from './components';
import ipr from '../../apis/ipr';
import { useToasts } from 'react-toast-notifications'
import EXCEL from 'js-export-xlsx';

const IprList = props => {
	const { history } = props;
	const [sortOption, setSortOption] = useState({ sortBy: 0, sortOrder: "asc" });
	const [countList, setCountList] = useState([25, 50, 100]);
	const [selectedCount, setSelectedCount] = useState(25);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([]);
	const [total, setTotal] = useState(0);
	const [searchId, setSearchId] = useState('');
	const [searchName, setSearchName] = useState('');
	const [searchIprType, setSearchIprType] = useState(0);
	const [iprTypeList, setIprTypeList] = useState([]);
	const [searchNumber, setSearchNumber] = useState('');
	const [searchCreatedAt, setSearchCreatedAt] = useState(null);
	const [searchScheduleDate, setSearchScheduleDate] = useState(null);
	const [openModal, setOpenModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState(-1);
	const classes = useStyles();
	const breadcrumbs = [{ active: true, href: '/participants', label: 'Uczestnicy' }, { active: false, label: 'Indywidualne Programy Rehabilitacji poszczególnych uczestników ' }];
	const [progressStatus, setProgressStatus] = useState(false);
	const { addToast } = useToasts()
	useEffect(() => {
		ipr.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setIprTypeList(response.data.ipr_type);
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
	}, [selectedCount, searchId, searchName, searchIprType, searchNumber, searchCreatedAt, searchScheduleDate]);

	const requestSort = (pSortBy) => {
		var sortOrder = "asc";
		if (pSortBy === sortOption.sortBy) {
			sortOrder = (sortOption.sortOrder === "asc" ? "desc" : "asc");
		}
		setSortOption({ sortBy: pSortBy, sortOrder: sortOrder })
	}

	const handleSearch = () => {
		ipr
			.getListByOption(sortOption.sortBy, sortOption.sortOrder, selectedCount, page, searchId, searchName, searchIprType, searchNumber, searchCreatedAt, searchScheduleDate)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						setData(response.data.iprs);
						setTotal(response.data.count);
					}
				}
			})
	}

	const handleCreate = () => {
		history.push('/ipr_list/create');
	}

	const handleExport = () => {
		let export_data = [];
		for (let i = 0; i < data.length; i++) {
			let item = [];
			item.push(data[i].id);
			item.push(data[i].name);
			item.push(iprTypeList[data[i].ipr_type - 1].name);
			item.push(data[i].number);
			item.push(data[i].created_at);
			item.push(data[i].schedule_date);
			export_data.push(item);
		}

		EXCEL.outPut({
			header: ['ID', 'Imię i nazwisko uczestnika', 'Typ IPR', 'Numer', 'Data powstania', 'Data wypełnienia'],
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
		ipr
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
          Dodaj IPR
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
					searchIprType={searchIprType}
					setSearchIprType={setSearchIprType}
					iprTypeList={iprTypeList}
					searchNumber={searchNumber}
					setSearchNumber={setSearchNumber}
					searchCreatedAt={searchCreatedAt}
					setSearchCreatedAt={setSearchCreatedAt}
					searchScheduleDate={searchScheduleDate}
					setSearchScheduleDate={setSearchScheduleDate}
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

export default IprList;
