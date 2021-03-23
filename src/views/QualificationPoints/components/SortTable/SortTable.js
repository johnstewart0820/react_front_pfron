import React, { useEffect } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableSortLabel,
  IconButton
} from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import {SingleSelect} from 'components';
import { withRouter } from 'react-router-dom';
import useStyles from './style';

const SortTable = (props) => {
  const classes = useStyles();
  const {history} = props;
  const { sortBy, sortOrder, requestSort, total, rows, page, selectedCount,searchId, setSearchId, searchType, setSearchType, typeList, searchName, setSearchName, searchAmbassador, setSearchAmbassador, ambassadorList, handleDelete } = props;
  useEffect(() => {
  }, []);

  const handleGotoSimulation = (indx) => {
    history.push({
      pathname: '/forecasting_module/simulation_info',
      state: {item: rows[indx]
    }});
  }

  const getAmbassadorStr = (str) => {
	  if (str == null) {
		  str = '';
	  }
    if (!ambassadorList || ambassadorList.length == 0)
      return '';
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

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>
            <TableSortLabel
              active={sortBy === 0}
              direction={sortOrder}
              onClick={() => requestSort(0)}
            >
							<label htmlFor="id">
								ID
							</label>
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 1}
              direction={sortOrder}
              onClick={() => requestSort(1)}
            >
							<label htmlFor="qualification_point">
								Punkt kwalifikacyjny
							</label>
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 2}
              direction={sortOrder}
              onClick={() => requestSort(2)}
            >
              Typ
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 3}
              direction={sortOrder}
              onClick={() => requestSort(3)}
            >
              Przypisani Ambasadorzy
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel align="right">
              Akcje
            </TableSortLabel>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell><input className={classes.input_box} type="id" value={searchId} name="searchId" id="id" onChange={(e) => setSearchId(e.target.value)} /></TableCell>
          <TableCell><input className={classes.input_box} type="name" value={searchName} name="searchId" id="qualification_point" onChange={(e) => setSearchName(e.target.value)} /></TableCell>
          <TableCell><SingleSelect value={searchType} handleChange={setSearchType} list={typeList} /> </TableCell>
          <TableCell><SingleSelect value={searchAmbassador} handleChange={setSearchAmbassador} list={ambassadorList} /></TableCell>
          <TableCell></TableCell>
        </TableRow>
        {rows.map((item, indx) => {
          return (
            <TableRow key={indx} className={classes.root}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{typeList && typeList.length > 0 && typeList[item.type - 1].name}</TableCell>
              <TableCell>{getAmbassadorStr(item.ambassador)}</TableCell>
              <TableCell>
                <IconButton  aria-label={`Edytuj punkt kwalifikacyjny ${item.name}`} component="span" className={classes.iconButton} onClick={() => history.push(`/qualification_points/edit/${item.id}`)}>
                  <EditOutlinedIcon className={classes.icon}/>
                </IconButton>
                <IconButton variant="outlined" aria-label={`Usuń punkt kwalifikacyjny ${item.name}`} component="span" className={classes.iconButton} onClick={() => handleDelete(item.id)}>
                  <DeleteOutlineOutlinedIcon className={classes.icon}/>
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default withRouter(SortTable);
