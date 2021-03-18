import React, { useState, useEffect }  from 'react';
import useStyles from './style';
import {
  Button, Card, CircularProgress
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@material-ui/icons/Add';
import { Breadcrumb } from 'components';
import { SortTable, SingleSelect, DeleteModal } from './components';
import participant from '../../apis/participant';
import { useToasts } from 'react-toast-notifications'
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
  const [searchId, setSearchId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchSurname, setSearchSurname] = useState('');
  const [searchRehabitationCenter, setSearchRehabitationCenter] = useState(0);
  const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
  const [searchParticipantStatusType, setSearchParticipantStatusType] = useState(0);
  const [participantStatusTypeList, setParticipantStatusTypeList] = useState([]);
  const [searchDateModified, setSearchDateModified] = useState({from: new Date('2020-01-01'), to: new Date('2050-12-31')});
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(-1);
  const classes = useStyles();
  const breadcrumbs = [{active: true, label: 'Uczestnicy', href: '/'}, {active: false, label: 'Lista uczestników'}];
  const [progressStatus, setProgressStatus] = useState(false);
  const { addToast } = useToasts()
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

  const handleExport = () => {
    let export_data = [];
    for (let i = 0; i < data.length; i ++) {
      let item = [];
      item.push(data[i].id);
      item.push(data[i].name);
      item.push(data[i].surname);
	  item.push(rehabitationCenterList[data[i].rehabitation_center - 1].name);
      item.push(data[i].participant_status_type >= 1 ? participantStatusTypeList[data[i].participant_status_type - 1].name : '');
      let date = new Date(data[i].updated_at);
      item.push(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
      export_data.push(item);
    }
    EXCEL.outPut({
      header: ['ID', 'Imię uczestnika', 'Nazwisko uczestnika', 'Ośrodek', 'Status', 'Data modyfikacji'],
      data: export_data,
      name: 'download'
    })
  }

  const handleSelectedItem = (id) => {
    setSelectedItem(id);
    setOpenModal(true);
  }

  return (
    <div className={classes.public}>
      <div className={classes.controlBlock}>
        <Button variant="outlined" color="secondary" className={classes.btnExport} onClick={handleExport}>
          Eksport listy do XLS
        </Button>
      </div>
      <div className={classes.divide}/>
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

export default Participants;
