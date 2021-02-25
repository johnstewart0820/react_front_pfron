import React, { useEffect } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableSortLabel,
  IconButton,
  Grid
} from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import EventNoteOutlinedIcon from '@material-ui/icons/EventNoteOutlined';
import NoteAddOutlinedIcon from '@material-ui/icons/NoteAddOutlined';
import { SingleSelect } from 'components';
import { withRouter } from 'react-router-dom';
import useStyles from './style';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { pl } from 'date-fns/locale';
import DateFnsUtils from '@date-io/date-fns';
import qualification from 'apis/qualification';

const SortTable = (props) => {
  const classes = useStyles();
  const { history } = props;
  const { sortBy, sortOrder, requestSort, rows, searchId, setSearchId, searchName, setSearchName, searchSurname, setSearchSurname, searchRehabitationCenter, setSearchRehabitationCenter, rehabitationCenterList, searchParticipantStatusType, setSearchParticipantStatusType, participantStatusTypeList, searchDateModified, setSearchDateModified } = props;
  useEffect(() => {
  }, []);

  const handleChangeDate = (value, flag) => {
    let _date = new Date(value);
    let _temp = JSON.parse(JSON.stringify(searchDateModified));
    if (flag === 'from')
      _temp.from = value;
    else
      _temp.to = value;
    setSearchDateModified(_temp);
  }

  const getDateTime = (value) => {
    let _date = new Date(value);
    return _date.getFullYear() + '.' + (_date.getMonth() + 1) + '.' + (_date.getDate()) + ' ' + _date.getHours() + ':' + _date.getMinutes();
  }

  const createIpr = (id) => {

  }

  const showIprList = (id) => {

  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
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
                Imie uczestnika
            </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 2}
                direction={sortOrder}
                onClick={() => requestSort(2)}
              >
                Nazwisko uczestnika
            </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 3}
                direction={sortOrder}
                onClick={() => requestSort(3)}
              >
                Osorodek
            </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 4}
                direction={sortOrder}
                onClick={() => requestSort(4)}
              >
                Status
            </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 5}
                direction={sortOrder}
                onClick={() => requestSort(5)}
              >
                Data modyfikacji
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
            <TableCell><input className={classes.input_box} type="name" value={searchName} name="searchId" onChange={(e) => setSearchName(e.target.value)} /></TableCell>
            <TableCell><input className={classes.input_box} type="name" value={searchSurname} name="searchId" onChange={(e) => setSearchSurname(e.target.value)} /></TableCell>
            <TableCell><SingleSelect value={searchRehabitationCenter} handleChange={setSearchRehabitationCenter} list={rehabitationCenterList} /></TableCell>
            <TableCell><SingleSelect value={searchParticipantStatusType} handleChange={setSearchParticipantStatusType} list={participantStatusTypeList} /></TableCell>
            <TableCell>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd.MM.yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    value={searchDateModified.from}
                    onChange={(e) => handleChangeDate(e, 'from')}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd.MM.yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    value={searchDateModified.to}
                    onChange={(e) => handleChangeDate(e, 'to')}
                    KeyboardButtonProps={{
                      'aria-label': 'change date',
                    }}
                  />
                </Grid>
              </Grid>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          {rows.map((item, indx) => {
            return (
              <TableRow key={indx} className={classes.root}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.surname}</TableCell>
                <TableCell>{rehabitationCenterList && rehabitationCenterList.length > 0 && rehabitationCenterList[item.rehabitation_center - 1].name}</TableCell>
                <TableCell>{parseInt(item.participant_status_type) >= 1 ? (participantStatusTypeList && participantStatusTypeList.length > 0 && participantStatusTypeList[item.participant_status_type - 1].name) : ''}</TableCell>
                <TableCell>{getDateTime(item.updated_at)}</TableCell>
                <TableCell>
                  <IconButton aria-label="upload picture" component="span" className={classes.iconButton} onClick={() => history.push(`/participants/edit/${item.id}`)}>
                    <EditOutlinedIcon className={classes.icon} />
                  </IconButton>
                  <IconButton variant="outlined" aria-label="upload picture" component="span" className={classes.iconButton} onClick={() => showIprList(item.id)}>
                    <EventNoteOutlinedIcon className={classes.icon} />
                  </IconButton>
                  <IconButton variant="outlined" aria-label="upload picture" component="span" className={classes.iconButton} onClick={() => createIpr(item.id)}>
                    <NoteAddOutlinedIcon className={classes.icon} />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </MuiPickersUtilsProvider>
  );
};

export default withRouter(SortTable);
