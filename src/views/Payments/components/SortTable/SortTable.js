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
import { Alert } from 'components';

const SortTable = (props) => {
  const classes = useStyles();
  const {history} = props;
  const { sortBy, sortOrder, requestSort, total, rows, page, selectedCount,searchId, setSearchId, searchValue, setSearchValue, searchRehabitationCenter, setSearchRehabitationCenter, rehabitationCenterList, searchService, setSearchService, serviceList, handleDelete } = props;
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
							<label htmlFor="id">
								Numer
							</label>
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 2}
              direction={sortOrder}
              onClick={() => requestSort(2)}
            >
							<label htmlFor="value">
              Cena jednostkowa
							</label>
            </TableSortLabel>
          </TableCell>
          <TableCell className={classes.cell_removable}>
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
              Usługa
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
          <TableCell><input className={classes.input_box} type="id" value={searchId} id="id" name="searchId" onChange={(e) => setSearchId(e.target.value)} /></TableCell>
          <TableCell><input className={classes.input_box} type="name" value={searchValue} id="value" name="searchId" onChange={(e) => setSearchValue(e.target.value)} /></TableCell>
          <TableCell className={classes.cell_removable}><SingleSelect value={searchRehabitationCenter} handleChange={setSearchRehabitationCenter} list={rehabitationCenterList} /> </TableCell>
          <TableCell><SingleSelect value={searchService} handleChange={setSearchService} list={serviceList} /></TableCell>
          <TableCell></TableCell>
        </TableRow>
        {rows.map((item, indx) => {
          return (
            <TableRow key={indx} className={classes.root}>
              <TableCell onClick={() => history.push(`/payments/edit/${item.id}`)}>{item.number}</TableCell>
              <TableCell onClick={() => history.push(`/payments/edit/${item.id}`)}>{item.value}</TableCell>
              <TableCell onClick={() => history.push(`/payments/edit/${item.id}`)} className={classes.cell_removable}>{rehabitationCenterList && rehabitationCenterList.length > 0 && rehabitationCenterList[item.rehabitation_center - 1].name}</TableCell>
              <TableCell onClick={() => history.push(`/payments/edit/${item.id}`)}>{serviceList && serviceList.length > 0 && serviceList[item.service - 1].name}</TableCell>
              <TableCell>
                <IconButton  aria-label={`Edytuj koszt`} component="span" className={classes.iconButton} onClick={() => history.push(`/payments/edit/${item.id}`)}>
                  <EditOutlinedIcon className={classes.icon}/>
                </IconButton>
                <IconButton variant="outlined" aria-label={`Usuń koszt`} component="span" className={classes.iconButton} onClick={() => handleDelete(item.id)}>
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
