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
import payment from '../../apis/payment';

import EXCEL from 'js-export-xlsx';

const Payments = props => {
	const { children } = props;
	const { history } = props;
	const [sortOption, setSortOption] = useState({ sortBy: 0, sortOrder: "asc" });
	const [countList, setCountList] = useState([25, 50, 100]);
	const [selectedCount, setSelectedCount] = useState(25);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([]);
	const [total, setTotal] = useState(0);
	const [searchId, setSearchId] = useState('');
	const [searchValue, setSearchValue] = useState('');
	const [searchRehabitationCenter, setSearchRehabitationCenter] = useState(0);
	const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
	const [searchService, setSearchService] = useState(0);
	const [serviceList, setServiceList] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState(-1);
	const classes = useStyles();
	const breadcrumbs = [{ active: true, href: '/payments', label: 'Finanse' }, { active: false, label: 'Zdefiniowane koszty usług' }];
	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);

	useEffect(() => {
		payment.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setRehabitationCenterList(response.data.rehabitation_center);
					setServiceList(response.data.service_list);
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
	}, [selectedCount, searchId, searchValue, searchRehabitationCenter, searchService]);

	const requestSort = (pSortBy) => {
		var sortOrder = "asc";
		if (pSortBy === sortOption.sortBy) {
			sortOrder = (sortOption.sortOrder === "asc" ? "desc" : "asc");
		}
		setSortOption({ sortBy: pSortBy, sortOrder: sortOrder })
	}

	const handleSearch = () => {
		payment
			.getListByOption(sortOption.sortBy, sortOption.sortOrder, selectedCount, page, searchId, searchValue, searchRehabitationCenter, searchService)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						setData(response.data.payments);
						setTotal(response.data.count);
					}
				}
			})
	}

	const handleCreate = () => {
		history.push('/payments/create');
	}

	const handleExport = () => {
		payment
			.getListByOption(sortOption.sortBy, sortOption.sortOrder, total, page, searchId, searchValue, searchRehabitationCenter, searchService)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						let _data = response.data.payments;
						let export_data = [];
						for (let i = 0; i < _data.length; i++) {
							let item = [];
							item.push(_data[i].id);
							item.push(_data[i].value);
							item.push(rehabitationCenterList[_data[i].rehabitation_center - 1].name);
							item.push(serviceList[_data[i].service - 1].name);
							export_data.push(item);
						}

						EXCEL.outPut({
							header: ['ID', 'Cena jednostkowa', 'Koszt dla ORK', 'Usługa'],
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
		payment
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
          Dodaj koszt
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
					searchValue={searchValue}
					setSearchValue={setSearchValue}
					searchRehabitationCenter={searchRehabitationCenter}
					setSearchRehabitationCenter={setSearchRehabitationCenter}
					rehabitationCenterList={rehabitationCenterList}
					searchService={searchService}
					setSearchService={setSearchService}
					serviceList={serviceList}
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

export default Payments;
