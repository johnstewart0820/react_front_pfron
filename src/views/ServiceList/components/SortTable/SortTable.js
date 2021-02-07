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
  const { sortBy, sortOrder, requestSort, total, rows, page, selectedCount,searchId, setSearchId, searchNumber, setSearchNumber, searchName, setSearchName, searchModule, setSearchModule, moduleList, searchUnit, setSearchUnit, unitList, handleDelete } = props;

  const getModuleName = (id) => {
    let name = '';
    if (!moduleList || moduleList.length === 0)
      return name;
    name = moduleList.map((item, index) => {
      if (parseInt(item.id) === parseInt(id)) {
        return item.name;
      }
    })
    return name;
  }

  const getUnitName = (id) => {
    let name = '';
    if (!unitList || unitList.length === 0)
      return name;
    for (let i = 0; i < unitList.length ; i ++ ) {
      if (parseInt(unitList[i].id) === parseInt(id)) {
        return unitList[i].name;
      }
    }
    return name;
  }

  useEffect(() => {
  }, []);

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
              ID
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 1}
              direction={sortOrder}
              onClick={() => requestSort(1)}
            >
              Numer
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 2}
              direction={sortOrder}
              onClick={() => requestSort(2)}
            >
              Nazwa
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 3}
              direction={sortOrder}
              onClick={() => requestSort(3)}
            >
              Moduł
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 4}
              direction={sortOrder}
              onClick={() => requestSort(4)}
            >
              Minimalny zakres usługi
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
          <TableCell><input className={classes.input_box} type="id" value={searchId} name="searchId" onChange={(e) => setSearchId(e.target.value)} /></TableCell>
          <TableCell><input className={classes.input_box} type="name" value={searchNumber} name="searchId" onChange={(e) => setSearchNumber(e.target.value)} /></TableCell>
          <TableCell><input className={classes.input_box} type="name" value={searchName} name="searchId" onChange={(e) => setSearchName(e.target.value)} /></TableCell>
          <TableCell><SingleSelect value={searchModule} handleChange={setSearchModule} list={moduleList} /> </TableCell>
          <TableCell><SingleSelect value={searchUnit} handleChange={setSearchUnit} list={unitList} /></TableCell>
          <TableCell></TableCell>
        </TableRow>
        {rows.map((item, indx) => {
          return (
            <TableRow key={indx} className={classes.root}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.number}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{getModuleName(item.module)}</TableCell>
              <TableCell>{`${item.amount_usage} ${getUnitName(item.unit)}`}</TableCell>
              <TableCell>
                <IconButton  aria-label="upload picture" component="span" className={classes.iconButton} onClick={() => history.push(`/service_list/edit/${item.id}`)}>
                  <EditOutlinedIcon className={classes.icon}/>
                </IconButton>
                <IconButton variant="outlined" aria-label="upload picture" component="span" className={classes.iconButton} onClick={() => handleDelete(item.id)}>
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
