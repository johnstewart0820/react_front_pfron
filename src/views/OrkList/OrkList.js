import React, { useState, useEffect }  from 'react';
import useStyles from './style';
import {
  Button, Card, CircularProgress
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@material-ui/icons/Add';
import { Breadcrumb } from 'components';
import { SortTable, SingleSelect, DeleteModal } from './components';
import rehabitation_center from '../../apis/rehabitation-center';
import { useToasts } from 'react-toast-notifications'
import EXCEL from 'js-export-xlsx';

const OrkList = props => {
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
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(-1);
  const classes = useStyles();
  const breadcrumbs = [{active: true, href: '/', label: 'Finanse'}, {active: false, label: 'Lista Ośrodków Rehabilitacji Kompleksowej'}];
  const [progressStatus, setProgressStatus] = useState(false);
  const { addToast } = useToasts()
  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [sortOption, page]);

  useEffect(() => {
    handleSearch();
    setPage(1);
  }, [selectedCount, searchId, searchName]);
  
  const requestSort = (pSortBy) => {
    var sortOrder = "asc";
    if (pSortBy === sortOption.sortBy) {
      sortOrder = (sortOption.sortOrder === "asc" ? "desc" : "asc");
    }
    setSortOption({ sortBy: pSortBy, sortOrder: sortOrder })
  }
  
  const handleSearch = () => {
    rehabitation_center
      .getListByOption(sortOption.sortBy, sortOption.sortOrder, selectedCount, page, searchId, searchName)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          if (response.code === 200) {
            setData(response.data.rehabitation_centers);
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
      export_data.push(item);
    }
    EXCEL.outPut({
      header: ['ID', 'Nazwa ośrodka'],
      data: export_data,
      name: 'download'
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
          searchId={searchId}
          setSearchId={setSearchId}
          searchName={searchName}
          setSearchName={setSearchName}
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

export default OrkList;
