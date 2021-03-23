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
  const { sortBy, sortOrder, requestSort, total, rows, page, selectedCount,searchId, setSearchId, searchRehabitationCenter, setSearchRehabitationCenter, rehabitationCenterList, searchName, setSearchName, searchSpecialization, setSearchSpecialization, specializationList, handleDelete } = props;
  useEffect(() => {
  }, []);

  const getRehabitationCenterStr = (str) => {
    if (!rehabitationCenterList || rehabitationCenterList.length == 0)
      return '';
    let list = str.split(',');
    let res_list = [];
    list.map((item, index) => {
      for (let i = 0; i < rehabitationCenterList.length ; i ++) {
        if (parseInt(item) === parseInt(rehabitationCenterList[i].id)) {
          res_list.push(rehabitationCenterList[i].name);
        }
      }
    });
    return res_list.join(', ');
  }

  const getSpecializationStr = (str) => {
    if (!specializationList || specializationList.length == 0)
      return '';
    let list = str.split(',');
    let res_list = [];
    list.map((item, index) => {
      for (let i = 0; i < specializationList.length ; i ++) {
        if (parseInt(item) === parseInt(specializationList[i].id)) {
          res_list.push(specializationList[i].name);
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
							<label htmlFor="name">
								Imię i nazwisko
							</label>
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 2}
              direction={sortOrder}
              onClick={() => requestSort(2)}
            >
              ORK
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 3}
              direction={sortOrder}
              onClick={() => requestSort(3)}
            >
              Specjalizacja
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
          <TableCell><input className={classes.input_box} type="name" value={searchName} name="searchId" id="name" onChange={(e) => setSearchName(e.target.value)} /></TableCell>
          <TableCell><SingleSelect value={searchRehabitationCenter} handleChange={setSearchRehabitationCenter} list={rehabitationCenterList} /> </TableCell>
          <TableCell><SingleSelect value={searchSpecialization} handleChange={setSearchSpecialization} list={specializationList} /></TableCell>
          <TableCell></TableCell>
        </TableRow>
        {rows.map((item, indx) => {
          return (
            <TableRow key={indx} className={classes.root}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{getRehabitationCenterStr(item.rehabitation_center)}</TableCell>
              <TableCell>{getSpecializationStr(item.specialization)}</TableCell>
              <TableCell>
                <IconButton  aria-label={`Edytuj osobę ${item.name}`} component="span" className={classes.iconButton} onClick={() => history.push(`/ork_teams/edit/${item.id}`)}>
                  <EditOutlinedIcon className={classes.icon}/>
                </IconButton>
                <IconButton variant="outlined" aria-label={`Usuń osobę ${item.name}`} component="span" className={classes.iconButton} onClick={() => handleDelete(item.id)}>
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
