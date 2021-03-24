import React, { useState, useEffect }  from 'react';
import useStyles from './style';
import {
  Button, Card
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@material-ui/icons/Add';
import { Breadcrumb } from 'components';
import { SortTable, SingleSelect, DeleteModal } from './components';
import qualification from '../../apis/qualification';
import { useToasts } from 'react-toast-notifications'
import EXCEL from 'js-export-xlsx';

const QualificationPoints = props => {
  const { history } = props;
  const [sortOption, setSortOption] = useState({ sortBy: 0, sortOrder: "asc" });
  const [countList, setCountList] = useState([25, 50, 100]);
  const [selectedCount, setSelectedCount] = useState(25);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState(0);
  const [typeList, setTypeList] = useState([]);
  const [searchAmbassador, setSearchAmbassador] = useState(0);
  const [ambassadorList, setAmbassadorList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(-1);
  const classes = useStyles();
  const breadcrumbs = [{active: false, label: 'Punkty kwalifikacyjne'}];
  const [progressStatus, setProgressStatus] = useState(false);
  const { addToast } = useToasts()
  useEffect(() => {
    qualification.getInfo()
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setTypeList(response.data.type);
          setAmbassadorList(response.data.ambassadors);
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
  }, [selectedCount, searchId, searchName, searchType, searchAmbassador]);
  
  const requestSort = (pSortBy) => {
    var sortOrder = "asc";
    if (pSortBy === sortOption.sortBy) {
      sortOrder = (sortOption.sortOrder === "asc" ? "desc" : "asc");
    }
    setSortOption({ sortBy: pSortBy, sortOrder: sortOrder })
  }
  
  const handleSearch = () => {
    qualification
      .getListByOption(sortOption.sortBy, sortOption.sortOrder, selectedCount, page, searchId, searchName, searchType, searchAmbassador)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          if (response.code === 200) {
            setData(response.data.qualification_points);
            setTotal(response.data.count);
          }
        }
      })
  }

  const handleCreate = () => {
    history.push('/qualification_points/create');
  }

  const getAmbassadorStr = (str) => {
    if (!ambassadorList || ambassadorList.length == 0)
      return '';
	if (str == null)
		str = '';
    let list = str.split(',');
    let res_list = [];
    list.map((item, index) => {
      for (let i = 0; i < ambassadorList.length ; i ++) {
        if (parseInt(item) === parseInt(ambassadorList[i].id)) {
          res_list.push(ambassadorList[i].name);
        }
      }

    });
    return res_list.join(', ');
  }

  const handleExport = () => {
    let export_data = [];
    for (let i = 0; i < data.length; i ++) {
      let item = [];
      item.push(data[i].id);
      item.push(data[i].name);
      item.push(typeList[data[i].type - 1].name);
      item.push(getAmbassadorStr(data[i].ambassador));
      export_data.push(item);
    }
    
    EXCEL.outPut({
      header: ['ID', 'Punkt kwalifikacyjny', 'Typ', 'Przypisani Ambasadorzy'],
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
    qualification
      .delete(selectedItem)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          if (response.code === 200) {
            addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
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
          <AddIcon style={{marginRight: '20px'}}/>
          Dodaj punkt
        </Button>
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
          searchType={searchType}
          setSearchType={setSearchType}
          typeList={typeList}
          searchName={searchName}
          setSearchName={setSearchName}
          searchAmbassador={searchAmbassador}
          setSearchAmbassador={setSearchAmbassador} 
          ambassadorList={ambassadorList}
          handleDelete={handleSelectedItem}
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
      <DeleteModal
        openModal={openModal}
        handleClose={handleCloseModal}
        handleDelete={handleDelete}
        selectedIndex={selectedItem}
      />
    </div>
  );
};

export default QualificationPoints;
