import React, { useState, useEffect }  from 'react';
import useStyles from './style';
import {
  Button, Card, CircularProgress
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@material-ui/icons/Add';
import { Breadcrumb } from 'components';
import { SortTable, SingleSelect, DeleteModal } from './components';
import payment from '../../apis/payment';
import { useToasts } from 'react-toast-notifications'
import { ExportToCsv } from 'export-to-csv';

const PaymentsUser = props => {
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
  const [searchValue, setSearchValue] = useState('');
  const [searchRehabitationCenter, setSearchRehabitationCenter] = useState(0);
  const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
  const [searchService, setSearchService] = useState(0);
  const [serviceList, setServiceList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(-1);
  const classes = useStyles();
  const breadcrumbs = [{active: true, href: '/', label: 'Finanse'}, {active: false, label: 'Zdefiniowane koszty usług'}];
  const [progressStatus, setProgressStatus] = useState(false);
  const { addToast } = useToasts()
  useEffect(() => {
    payment.getInfo()
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setRehabitationCenterList(response.data.rehabitation_center);
          setServiceList(response.data.service);
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
  }, [selectedCount, searchId, searchName, searchValue, searchRehabitationCenter, searchService]);
  
  const requestSort = (pSortBy) => {
    var sortOrder = "asc";
    if (pSortBy === sortOption.sortBy) {
      sortOrder = (sortOption.sortOrder === "asc" ? "desc" : "asc");
    }
    setSortOption({ sortBy: pSortBy, sortOrder: sortOrder })
  }
  
  const handleSearch = () => {
    payment
      .getListByOption(sortOption.sortBy, sortOption.sortOrder, selectedCount, page, searchId, searchName, searchValue, searchRehabitationCenter, searchService)
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
    let export_data = [];
    for (let i = 0; i < data.length; i ++) {
      let item = {};
      item['ID'] = data[i].id;
      item['Nazwa kosztu'] = data[i].name;
      item['Wysokość'] = data[i].value;
      item['Koszt dla ORK'] = rehabitationCenterList[data[i].rehabitation_center - 1].name;
      item['Usluga'] = serviceList[data[i].service - 1].name;
      export_data.push(item);
    }
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: false,
      showTitle: false,
      title: 'My Awesome CSV',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    };
    const csvExporter = new ExportToCsv(options);

    csvExporter.generateCsv(export_data);
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
          searchId={searchId}
          setSearchId={setSearchId}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          searchName={searchName}
          setSearchName={setSearchName}
          searchRehabitationCenter={searchRehabitationCenter}
          setSearchRehabitationCenter={setSearchRehabitationCenter}
          rehabitationCenterList={rehabitationCenterList}
          searchService={searchService}
          setSearchService={setSearchService} 
          serviceList={serviceList}
          handleDelete={handleSelectedItem}
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

export default PaymentsUser;