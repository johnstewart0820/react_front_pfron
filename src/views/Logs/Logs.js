import React, { useState, useEffect }  from 'react';
import useStyles from './style';
import {
  Button, Card, CircularProgress
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@material-ui/icons/Add';
import { Breadcrumb } from 'components';
import { SortTable, SingleSelect, DeleteModal } from './components';
import audit from '../../apis/audit';
import { useToasts } from 'react-toast-notifications'
import { ExportToCsv } from 'export-to-csv';

const Logs = props => {
  const { children } = props;
  const { history } = props;
  const [sortOption, setSortOption] = useState({ sortBy: 0, sortOrder: "asc" });
  const [countList, setCountList] = useState([25, 50, 100]);
  const [selectedCount, setSelectedCount] = useState(25);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [searchUserName, setSearchUserName] = useState('');
  const [searchRole, setSearchRole] = useState('');
  const [roleList, setRoleList] = useState([]);
  const [searchDate, setSearchDate] = useState(null);
  const [searchEvent, setSearchEvent] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(-1);
  const classes = useStyles();
  const breadcrumbs = [{active: false, label: 'Punkty kwalifikacyjne'}];
  const [progressStatus, setProgressStatus] = useState(false);
  const { addToast } = useToasts()
  useEffect(() => {
    audit.getInfo()
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setRoleList(response.data.roles);
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
  }, [selectedCount, searchId, searchUserName, searchRole, searchDate, searchEvent]);
  
  const requestSort = (pSortBy) => {
    var sortOrder = "asc";
    if (pSortBy === sortOption.sortBy) {
      sortOrder = (sortOption.sortOrder === "asc" ? "desc" : "asc");
    }
    setSortOption({ sortBy: pSortBy, sortOrder: sortOrder })
  }
  
  const handleSearch = () => {
    audit
      .getListByOption(sortOption.sortBy, sortOption.sortOrder, selectedCount, page, searchId, searchUserName, searchRole, searchDate, searchEvent)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          if (response.code === 200) {
            setData(response.data.audits);
            setTotal(response.data.count);
          }
        }
      })
  }

  const handleExport = () => {
    let export_data = [];
    // for (let i = 0; i < data.length; i ++) {
    //   let item = {};
    //   item['ID'] = data[i].id;
    //   item['Punkt kwalifikacyjny'] = data[i].name;
    //   item['Typ'] = typeList[data[i].type - 1].name;
    //   item['Przypisani Ambasadorzy'] = getAmbassadorStr(data[i].ambassador);
    //   // item['Rola'] = roleList[data[i].id_role - 1].name;
    //   // item['E-mail'] = data[i].email;
    //   // item['Aktywny'] = activateStatusList[data[i].activate_status - 1].name;
    //   export_data.push(item);
    // }
    // const options = {
    //   fieldSeparator: ',',
    //   quoteStrings: '"',
    //   decimalSeparator: '.',
    //   showLabels: false,
    //   showTitle: false,
    //   title: 'My Awesome CSV',
    //   useTextFile: false,
    //   useBom: true,
    //   useKeysAsHeaders: true,
    // };
    // const csvExporter = new ExportToCsv(options);

    // csvExporter.generateCsv(export_data);
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
    audit
      .delete(selectedItem)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          if (response.code === 200) {
            addToast(response.message, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
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
          searchId    = {searchId}
          setSearchId = {setSearchId}
          searchUserName    = {searchUserName}
          setSearchUserName = {setSearchUserName}
          searchRole    = {searchRole}
          setSearchRole = {setSearchRole}
          roleList      = {roleList}
          searchDate    = {searchDate}
          setSearchDate = {setSearchDate}
          searchEvent    = {searchEvent}
          setSearchEvent = {setSearchEvent}
          handleDelete= {handleSelectedItem}
        />
        <div className={classes.pagination}>
          <Pagination 
            count={ total%selectedCount == 0 ? total / selectedCount : Math.round(total / selectedCount) + 1} 
            onChange={(e, page) => {setPage(page)}} 
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

export default Logs;
