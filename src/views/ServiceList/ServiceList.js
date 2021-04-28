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
import service_list from '../../apis/service-list';

import EXCEL from 'js-export-xlsx';

const ServiceList = props => {
	const { children } = props;
	const { history } = props;
	const [sortOption, setSortOption] = useState({ sortBy: 0, sortOrder: "asc" });
	const [countList, setCountList] = useState([25, 50, 100]);
	const [selectedCount, setSelectedCount] = useState(25);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([]);
	const [total, setTotal] = useState(0);
	const [searchId, setSearchId] = useState('');
	const [searchNumber, setSearchNumber] = useState('');
	const [searchName, setSearchName] = useState('');
	const [searchModule, setSearchModule] = useState(0);
	const [moduleList, setModuleList] = useState([]);
	const [searchUnit, setSearchUnit] = useState(0);
	const [unitList, setUnitList] = useState([]);

	const [openModal, setOpenModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState(-1);
	const classes = useStyles();
	const breadcrumbs = [{ active: true, href: '/service_list', label: 'Usługi' }, { active: false, label: 'Lista dostępnych usług' }];
	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);


	useEffect(() => {
		service_list.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setModuleList(response.data.modules);
					setUnitList(response.data.units);
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
	}, [selectedCount, searchId, searchName, searchNumber, searchModule, searchUnit]);

	const requestSort = (pSortBy) => {
		var sortOrder = "asc";
		if (pSortBy === sortOption.sortBy) {
			sortOrder = (sortOption.sortOrder === "asc" ? "desc" : "asc");
		}
		setSortOption({ sortBy: pSortBy, sortOrder: sortOrder })
	}

	const handleSearch = () => {
		service_list
			.getListByOption(sortOption.sortBy, sortOption.sortOrder, selectedCount, page, searchId, searchNumber, searchName, searchModule, searchUnit)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						setData(response.data.service_list);
						setTotal(response.data.count);
					}
				}
			})
	}

	const handleCreate = () => {
		history.push('/service_list/create');
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
		service_list
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

	const handleExport = () => {
		service_list
			.getListByOption(sortOption.sortBy, sortOption.sortOrder, total, page, searchId, searchNumber, searchName, searchModule, searchUnit)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						let _data = response.data.service_list;
						let export_data = [];
						for (let i = 0; i < _data.length; i++) {
							let item = [];
							item.push(_data[i].id);
							item.push(_data[i].number);
							item.push(_data[i].name);
							item.push(moduleList[_data[i].module - 1].name);
							item.push(_data[i].amount_usage + ' ' + unitList[_data[i].unit - 1].name);
							export_data.push(item);
						}
						EXCEL.outPut({
							header: ['ID', 'Numer', 'Nazwa', 'Moduł', 'Jednostka'],
							data: export_data,
							name: 'download'
						})
					}
				}
			})
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
				<Button variant="contained" color="secondary" id="main" className={classes.btnCreate} onClick={handleCreate}>
					<AddIcon style={{ marginRight: '20px' }} />
          Dodaj Usługę
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
					searchNumber={searchNumber}
					setSearchNumber={setSearchNumber}
					searchName={searchName}
					setSearchName={setSearchName}
					searchModule={searchModule}
					setSearchModule={setSearchModule}
					moduleList={moduleList}
					searchUnit={searchUnit}
					setSearchUnit={setSearchUnit}
					unitList={unitList}
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
							aria-label="Przejdź do następnych stron wyników wyszukiwania wybierając intersująca cię stronę" />
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

export default ServiceList;
