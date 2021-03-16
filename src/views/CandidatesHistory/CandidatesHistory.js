import React, { useState, useEffect }  from 'react';
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

const CandidatesHistory = props => {
  const { children } = props;
  const { history } = props;
	const id = props.match.params.id;
  const [sortOption, setSortOption] = useState({ sortBy: 0, sortOrder: "asc" });
  const [countList, setCountList] = useState([25, 50, 100]);
  const [selectedCount, setSelectedCount] = useState(25);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [searchDescription, setSearchDescription] = useState('');
	const [searchCreatedAt, setSearchCreatedAt] = useState(null);
	const [searchUser, setSearchUser] = useState('');
	const [userList, setUserList] = useState('');
  const classes = useStyles();
  const breadcrumbs = [{active: true, label: 'Kandydaci', href: '/candidates'}, {active: false, label: 'Historia modyfikacji'}];
  const [progressStatus, setProgressStatus] = useState(false);
  const { addToast } = useToasts()
  useEffect(() => {
    candidate.getHistoryInfo(id)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setUserList(response.data.user);
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
  }, [selectedCount, searchId, searchUser, searchDescription, searchCreatedAt]);
  
  const requestSort = (pSortBy) => {
    var sortOrder = "asc";
    if (pSortBy === sortOption.sortBy) {
      sortOrder = (sortOption.sortOrder === "asc" ? "desc" : "asc");
    }
    setSortOption({ sortBy: pSortBy, sortOrder: sortOrder })
  }
  
  const handleSearch = () => {
    candidate
      .getHistoryListByOption(id, sortOption.sortBy, sortOption.sortOrder, selectedCount, page, searchId, searchCreatedAt, searchDescription, searchUser)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          if (response.code === 200) {
            setData(response.data.histories);
            setTotal(response.data.count);
          }
        }
      })
  }

  const handleEdit = () => {
    history.push(`/candidates/edit/${id}`);
  }

	const handleBack = () => {
		history.push('/candidates');
	}

	const getUser = (id) => {
		let result = '';
		for (let i = 0; i < userList.length; i ++) {
			if (parseInt(userList[i].id) === parseInt(id))
				result = userList[i].name;
		}
		return result;
	}
  const handleExport = () => {
    let export_data = [];
    for (let i = 0; i < data.length; i ++) {
      let item = [];
      item.push(data[i].id);
			let date = new Date(data[i].created_at);
      item.push(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
      item.push(data[i].description);
			item.push(getUser(data[i].created_by));
			export_data.push(item);
    }
    EXCEL.outPut({
      header: ['ID', 'Data modyfikacji', 'Zmiana', 'Uzytkownik'],
      data: export_data,
      name: 'download'
    })
  }

  return (
    <div className={classes.public}>
      <div className={classes.controlBlock}>
        <Button variant="contained" color="secondary" className={classes.btnCreate} onClick={handleEdit}>
          Edytuj kandydata
        </Button>
				<Button variant="contained" color="secondary" className={classes.btnCreate} onClick={handleBack}>
					Wróć do listy kandydata
        </Button>
        <Button variant="outlined" color="secondary" className={classes.btnExport} onClick={handleExport}>
          Eksport listy do XLS
        </Button>
      </div>
			<div className={classes.divide} />
      <div className={classes.filter}>
        <Breadcrumb list={breadcrumbs}/>
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
          searchCreatedAt={searchCreatedAt}
          setSearchCreatedAt={setSearchCreatedAt}
          searchDescription={searchDescription}
          setSearchDescription={setSearchDescription}
          searchUser={searchUser}
          setSearchUser={setSearchUser}
					userList={userList}
        />
        <div className={classes.pagination}>
          <Pagination
className={classes.pagenation_class}
            count={ total%selectedCount == 0 ? total / selectedCount : parseInt(total / selectedCount) + 1} 
            onChange={(e, page) => {setPage(page)}} 
            page={page} 
            showFirstButton 
            showLastButton />
        </div>
      </Card>
    </div>
  );
};

export default CandidatesHistory;
