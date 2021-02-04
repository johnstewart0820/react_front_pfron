import React, { useState, useEffect }  from 'react';
import useStyles from './style';
import {
  Button, Card
} from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import AddIcon from '@material-ui/icons/Add';
import { Breadcrumb } from 'components';
import { SortTable, SingleSelect } from './components';
import qualification from '../../apis/qualification';

const QualificationPointsUser = props => {
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
  const [searchType, setSearchType] = useState(0);
  const [typeList, setTypeList] = useState([]);
  const [searchAmbassador, setSearchAmbassador] = useState(0);
  const [ambassadorList, setAmbassadorList] = useState([]);
  const classes = useStyles();
  const breadcrumbs = [{active: false, label: 'Punkty kwalifikacyjne'}];
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

  return (
    <div className={classes.public}>
      <div className={classes.controlBlock}>
        <Button variant="outlined" color="secondary" className={classes.btnExport} onClick={handleCreate}>
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

    </div>
  );
};

export default QualificationPointsUser;
