import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Card, CircularProgress
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@material-ui/icons/Add';
import { Breadcrumb } from 'components';
import { SortTable, SingleSelect, DeleteModal, NotificationModal } from './components';
import notification from '../../apis/notification';

import EXCEL from 'js-export-xlsx';

const Notifications = props => {
	const { children } = props;
	const { history } = props;
	const [sortOption, setSortOption] = useState({ sortBy: 0, sortOrder: "asc" });
	const [countList, setCountList] = useState([25, 50, 100]);
	const [selectedCount, setSelectedCount] = useState(25);
	const [page, setPage] = useState(1);
	const [data, setData] = useState([]);
	const [total, setTotal] = useState(0);
	const [searchTitle, setSearchTitle] = useState('');
	const [searchDateModified, setSearchDateModified] = useState(null);

	const [openModal, setOpenModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState(-1);

	const [openNotificationModal, setOpenNotificationModal] = useState(false);
	const [selectedNotification, setSelectedNotification] = useState(-1);

	const classes = useStyles();
	const breadcrumbs = [{ active: true, label: 'Usługi', href: '/service_list' }, { active: false, label: 'Powiadomienia' }];
	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);


	useEffect(() => {
		handleSearch();
	}, []);

	useEffect(() => {
		handleSearch();
	}, [sortOption, page]);

	useEffect(() => {
		handleSearch();
		setPage(1);
	}, [selectedCount, searchTitle, searchDateModified]);

	const requestSort = (pSortBy) => {
		var sortOrder = "asc";
		if (pSortBy === sortOption.sortBy) {
			sortOrder = (sortOption.sortOrder === "asc" ? "desc" : "asc");
		}
		setSortOption({ sortBy: pSortBy, sortOrder: sortOrder })
	}

	const handleSearch = () => {
		notification
			.getListByOption(sortOption.sortBy, sortOption.sortOrder, selectedCount, page, searchTitle, searchDateModified)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						setData(response.data.notifications);
						setTotal(response.data.count);
					}
				}
			})
	}

	const handleExport = () => {
		notification
			.getListByOption(sortOption.sortBy, sortOption.sortOrder, total, page, searchTitle, searchDateModified)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						let _data = response.data.notifications;
						let export_data = [];
						for (let i = 0; i < _data.length; i++) {
							let item = [];
							item.push(_data[i].id);
							item.push(_data[i].title);
							let date = new Date(_data[i].updated_at);
							item.push(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
							item.push(_data[i].activate_status === 1 ? 'TAK' : 'NIE');
							export_data.push(item);
						}
						EXCEL.outPut({
							header: ['ID', 'Temat', 'Data', 'Akceptacja'],
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

	const handleSetState = (id) => {
		setProgressStatus(true);
		notification
			.update_status(id)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						setHasAlert(true);
						setMessage(response.message);
						setIsSuccess(response.code === 200);
						let _data = JSON.parse(JSON.stringify(data));
						for (let i = 0; i < _data.length; i++) {
							if (parseInt(_data[i].id) === parseInt(id)) {
								_data[i].activate_status = 1;
							}
						}
						setData(_data);
					}
					setProgressStatus(false);
				}
			})
	}

	const handleSetting = (id) => {
		history.push('/notification_setting');
	}

	const handleClick = (item) => {
		setOpenNotificationModal(true);
		setSelectedNotification(item);
	}

	const handleCloseNotification = () => {
		setOpenNotificationModal(false);
	}

	const handleCloseModal = () => {
		setOpenModal(false);
	}

	const handleDelete = () => {

		setProgressStatus(true);
		notification
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
		<>
			<div className={classes.public}>
				<div className={classes.controlBlock}>
					<Button variant="contained" color="secondary" className={classes.btnCreate} onClick={handleSetting}>
						Ustawienia powiadomień
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
						searchTitle={searchTitle}
						setSearchTitle={setSearchTitle}
						searchDateModified={searchDateModified}
						setSearchDateModified={setSearchDateModified}
						handleSetState={handleSetState}
						handleClick={handleClick}
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
			</div>
			<DeleteModal
				openModal={openModal}
				handleClose={handleCloseModal}
				handleDelete={handleDelete}
				selectedIndex={selectedItem}
			/>
			<NotificationModal
				openModal={openNotificationModal}
				handleClose={handleCloseNotification}
				notification={selectedNotification}
			/>
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
		</>
	);
};

export default Notifications;
