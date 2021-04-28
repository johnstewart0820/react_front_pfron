import React, { useState, useEffect } from 'react';
import useStyles from './style';
import { Alert } from 'components';
import {
	Button, Card, CircularProgress
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@material-ui/icons/Add';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import { Breadcrumb } from 'components';
import { SortTable, SingleSelect, DeleteModal } from './components';
import users from '../../apis/users';

import EXCEL from 'js-export-xlsx';

const Users = props => {
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
	const [searchEmail, setSearchEmail] = useState('');
	const [searchRole, setSearchRole] = useState(0);
	const [roleList, setRoleList] = useState([]);
	const [searchActivateStatus, setSearchActivateStatus] = useState(0);
	const [activateStatusList, setActivateStatusList] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [selectedItem, setSelectedItem] = useState(-1);
	const classes = useStyles();
	const breadcrumbs = [{ active: true, href: '/users', label: 'Ustawienia systemowe' }, { active: false, label: 'Użytkownicy systemu' }];
	const [hasAlert, setHasAlert] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState('');
	const [progressStatus, setProgressStatus] = useState(false);

	useEffect(() => {
		users.getInfo()
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					setRoleList(response.data.role);
					setActivateStatusList(response.data.activate_status);
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
	}, [selectedCount, searchId, searchName, searchEmail, searchRole, searchActivateStatus]);

	const requestSort = (pSortBy) => {
		var sortOrder = "asc";
		if (pSortBy === sortOption.sortBy) {
			sortOrder = (sortOption.sortOrder === "asc" ? "desc" : "asc");
		}
		setSortOption({ sortBy: pSortBy, sortOrder: sortOrder })
	}

	const handleSearch = () => {
		users
			.getListByOption(sortOption.sortBy, sortOption.sortOrder, selectedCount, page, searchId, searchName, searchRole, searchEmail, searchActivateStatus)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						setData(response.data.users);
						setTotal(response.data.count);
					}
				}
			})
	}

	const handleCreate = () => {
		history.push('/users/create');
	}

	const handleProfile = () => {
		history.push('/profile');
	}
	const getRoleName = (id) => {
		let name = '';
		let arr = id.split(',');
		let _name_arr = [];
		if (!roleList || roleList.length === 0)
			return name;
		for (let i = 0; i < arr.length; i++) {
			_name_arr.push(roleList[arr[i] - 1].name);
		}
		name = _name_arr.join(', ');
		return name;
	}
	const handleExport = () => {
		users
			.getListByOption(sortOption.sortBy, sortOption.sortOrder, total, page, searchId, searchName, searchRole, searchEmail, searchActivateStatus)
			.then(response => {
				if (response.code === 401) {
					history.push('/login');
				} else {
					if (response.code === 200) {
						let _data = response.data.users;
						let export_data = [];
						for (let i = 0; i < _data.length; i++) {
							let item = [];
							item.push(_data[i].id);
							item.push(_data[i].name);
							item.push(getRoleName(_data[i].id_role));
							item.push(_data[i].email);
							item.push(activateStatusList[(parseInt(_data[i].activate_status) + 1) % 2].name);
							export_data.push(item);
						}
						EXCEL.outPut({
							header: ['ID', 'Nazwa użytkownika (login)', 'Rola', 'E-mail', 'Aktywny'],
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
		users
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
				<div className={classes.button_list}>
					<Button variant="contained" color="secondary" id="main" className={classes.btnCreate} onClick={handleCreate}>
						<AddIcon style={{ marginRight: '20px' }} />
            Dodaj użytkownika
          </Button>
					<Button variant="contained" color="secondary" className={classes.btnCreate} onClick={handleProfile}>
						<PersonOutlineOutlinedIcon style={{ marginRight: '20px' }} />
            Edytuj swój profil
          </Button>
				</div>
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
					searchRole={searchRole}
					setSearchRole={setSearchRole}
					roleList={roleList}
					searchEmail={searchEmail}
					setSearchEmail={setSearchEmail}
					searchActivateStatus={searchActivateStatus}
					setSearchActivateStatus={setSearchActivateStatus}
					activateStatusList={activateStatusList}
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

export default Users;
