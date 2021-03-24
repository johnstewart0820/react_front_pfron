import React, { useState, useEffect }  from 'react';
import useStyles from './style';
import {
  Button, Card, CircularProgress
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@material-ui/icons/Add';
import { Breadcrumb } from 'components';
import { SortTable, SingleSelect, DeleteModal } from './components';
import specialist from '../../apis/specialist';
import { useToasts } from 'react-toast-notifications'
import EXCEL from 'js-export-xlsx';

const Specialists = props => {
  const { history } = props;
  const [sortOption, setSortOption] = useState({ sortBy: 0, sortOrder: "asc" });
  const [countList, setCountList] = useState([25, 50, 100]);
  const [selectedCount, setSelectedCount] = useState(25);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [searchId, setSearchId] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchQualificationPoint, setSearchQualificationPoint] = useState(0);
  const [qualificationPointList, setQualificationPointList] = useState([]);
  const [searchSpecialty, setSearchSpecialty] = useState(0);
  const [specialtyList, setSpecialtyList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(-1);
  const classes = useStyles();
  const breadcrumbs = [{active: false, label: 'Lista specjalistów'}];
  const [progressStatus, setProgressStatus] = useState(false);
  const { addToast } = useToasts()
  
  useEffect(() => {
    specialist.getInfo()
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setSpecialtyList(response.data.specialty);
          setQualificationPointList(response.data.qualification);
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
  }, [selectedCount, searchId, searchName, searchSpecialty, searchQualificationPoint]);
  
  const requestSort = (pSortBy) => {
    var sortOrder = "asc";
    if (pSortBy === sortOption.sortBy) {
      sortOrder = (sortOption.sortOrder === "asc" ? "desc" : "asc");
    }
    setSortOption({ sortBy: pSortBy, sortOrder: sortOrder })
  }
  
  const handleSearch = () => {
    specialist
      .getListByOption(sortOption.sortBy, sortOption.sortOrder, selectedCount, page, searchId, searchName, searchQualificationPoint, searchSpecialty)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          if (response.code === 200) {
            setData(response.data.specialists);
            setTotal(response.data.count);
          }
        }
      })
  }

  const handleCreate = () => {
    history.push('/specialists/create');
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
    specialist
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

  const handleExport = () => {
    let export_data = [];
    for (let i = 0; i < data.length; i ++) {
      let item = [];
      item.push(data[i].id);
      item.push(data[i].name);
      for (let j = 0; j < qualificationPointList.length; j ++) {
        if (qualificationPointList[j].id === data[i].qualification_point) {
          item.push(qualificationPointList[j].name);
        }
      }
      item.push(specialtyList[data[i].specialty - 1].name);
      export_data.push(item);
    }
    EXCEL.outPut({
      header: ['ID', 'Imię i nazwisko', 'Punkt kwalifikacyjny', 'Specjalność'],
      data: export_data,
      name: 'download'
    })
  }

  return (
    <div className={classes.public}>
      <div className={classes.controlBlock}>
        <Button variant="contained" color="secondary" className={classes.btnCreate} onClick={handleCreate}>
          <AddIcon style={{marginRight: '20px'}}/>
          Dodaj specjalistę
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
          searchSpecialty={searchSpecialty}
          setSearchSpecialty={setSearchSpecialty}
          specialtyList={specialtyList}
          searchName={searchName}
          setSearchName={setSearchName}
          searchQualificationPoint={searchQualificationPoint}
          setSearchQualificationPoint={setSearchQualificationPoint} 
          qualificationPointList={qualificationPointList}
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

export default Specialists;
