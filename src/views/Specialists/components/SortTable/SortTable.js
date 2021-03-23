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
  const { sortBy, sortOrder, requestSort, total, rows, page, selectedCount,searchId, setSearchId, searchSpecialty, setSearchSpecialty, specialtyList, searchName, setSearchName, searchQualificationPoint, setSearchQualificationPoint, qualificationPointList, handleDelete } = props;

  const getQualificationPointName = (id) => {
    let name = '';
    if (!qualificationPointList || qualificationPointList.length === 0)
      return name;
    name = qualificationPointList.map((item, index) => {
      if (parseInt(item.id) === parseInt(id)) {
        return item.name;
      }
    })
    return name;
  }

  const getSpecialtyName = (id) => {
    let name = '';
    if (!specialtyList || specialtyList.length === 0)
      return name;
    name = specialtyList.map((item, index) => {
      if (parseInt(item.id) === parseInt(id)) {
        return item.name;
      }
    })
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
              Punkt kwalifikacyjny
            </TableSortLabel>
          </TableCell>
          <TableCell>
            <TableSortLabel
              active={sortBy === 3}
              direction={sortOrder}
              onClick={() => requestSort(3)}
            >
              Specjalność
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
          <TableCell><input className={classes.input_box} type="name" value={searchName} id="name" name="searchId" onChange={(e) => setSearchName(e.target.value)} /></TableCell>
          <TableCell><SingleSelect value={searchQualificationPoint} handleChange={setSearchQualificationPoint} list={qualificationPointList} /> </TableCell>
          <TableCell><SingleSelect value={searchSpecialty} handleChange={setSearchSpecialty} list={specialtyList} /></TableCell>
          <TableCell></TableCell>
        </TableRow>
        {rows.map((item, indx) => {
          return (
            <TableRow key={indx} className={classes.root}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{getQualificationPointName(item.qualification_point)}</TableCell>
              <TableCell>{getSpecialtyName(item.specialty)}</TableCell>
              <TableCell>
                <IconButton  aria-label={`Edytuj specjalistę ${item.name}`} component="span" className={classes.iconButton} onClick={() => history.push(`/specialists/edit/${item.id}`)}>
                  <EditOutlinedIcon className={classes.icon}/>
                </IconButton>
                <IconButton variant="outlined" aria-label={`Usuń specjalistę ${item.name}`} component="span" className={classes.iconButton} onClick={() => handleDelete(item.id)}>
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
