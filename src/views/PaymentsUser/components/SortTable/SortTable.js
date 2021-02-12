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
  const { sortBy, sortOrder, requestSort, total, rows, page, selectedCount,searchId, setSearchId, searchValue, setSearchValue, searchName, setSearchName, searchRehabitationCenter, setSearchRehabitationCenter, rehabitationCenterList, searchService, setSearchService, serviceList, handleDelete } = props;
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
              Nazwa kosztu
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 2}
              direction={sortOrder}
              onClick={() => requestSort(2)}
            >
              Wysokość
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 3}
              direction={sortOrder}
              onClick={() => requestSort(3)}
            >
              Koszt dla ORK
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 4}
              direction={sortOrder}
              onClick={() => requestSort(4)}
            >
              Usluga
            </TableSortLabel>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell><input className={classes.input_box} type="id" value={searchId} name="searchId" onChange={(e) => setSearchId(e.target.value)} /></TableCell>
          <TableCell><input className={classes.input_box} type="name" value={searchName} name="searchId" onChange={(e) => setSearchName(e.target.value)} /></TableCell>
          <TableCell><input className={classes.input_box} type="name" value={searchValue} name="searchId" onChange={(e) => setSearchValue(e.target.value)} /></TableCell>
          <TableCell><SingleSelect value={searchRehabitationCenter} handleChange={setSearchRehabitationCenter} list={rehabitationCenterList} /> </TableCell>
          <TableCell><SingleSelect value={searchService} handleChange={setSearchService} list={serviceList} /></TableCell>
        </TableRow>
        {rows.map((item, indx) => {
          return (
            <TableRow key={indx} className={classes.root}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.value}</TableCell>
              <TableCell>{rehabitationCenterList && rehabitationCenterList.length > 0 && rehabitationCenterList[item.rehabitation_center - 1].name}</TableCell>
              <TableCell>{serviceList && serviceList.length > 0 && serviceList[item.service - 1].name}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default withRouter(SortTable);
