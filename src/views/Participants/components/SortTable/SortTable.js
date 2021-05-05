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
import { Alert } from 'components';
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
	
	const getZeroValue = (value) => {
		if (value < 10) 
			return '0' + value;
		return value;
	}

  const getDateTime = (value) => {
    let _date = new Date(value);
		
    return _date.getFullYear() + '.' + getZeroValue(_date.getMonth() + 1) + '.' + getZeroValue(_date.getDate()) + ' ' + getZeroValue(_date.getHours()) + ':' + getZeroValue(_date.getMinutes());
  }

  const createIpr = (participant_number) => {
		history.push({
			pathname: `/ipr_list/create`,
			state: { searchKey: participant_number }
		});
  }

  const showIprList = (name) => {
		history.push({
			pathname: '/ipr_list',
			state: { searchName: name }});
  }

	const handleClick = (id) => {
		history.push(`/participants/profile/${id}`);
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
								<label htmlFor="id">
                  Numer uczestnika
								</label>
            </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 1}
                direction={sortOrder}
                onClick={() => requestSort(1)}
              >
								<label htmlFor="firstname">
									Imię uczestnika
								</label>
            </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 2}
                direction={sortOrder}
                onClick={() => requestSort(2)}
              >
								<label htmlFor="lastname">
									Nazwisko uczestnika
								</label>
            </TableSortLabel>
            </TableCell>
            <TableCell className={classes.cell_removable}>
              <TableSortLabel
                active={sortBy === 3}
                direction={sortOrder}
                onClick={() => requestSort(3)}
              >
                Ośrodek
            </TableSortLabel>
            </TableCell>
            <TableCell className={classes.cell_removable}>
              <TableSortLabel
                active={sortBy === 4}
                direction={sortOrder}
                onClick={() => requestSort(4)}
              >
                Status
            </TableSortLabel>
            </TableCell>
            <TableCell className={classes.cell_removable}>
              <TableSortLabel
                active={sortBy === 5}
                direction={sortOrder}
                onClick={() => requestSort(5)}
              >
								<label htmlFor="date">
									Data modyfikacji - DD.MM.RRRR
								</label>
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
            <TableCell><input className={classes.input_box} type="name" value={searchName} id="firstname" name="searchId" onChange={(e) => setSearchName(e.target.value)} /></TableCell>
            <TableCell><input className={classes.input_box} type="name" value={searchSurname} id="lastname" name="searchId" onChange={(e) => setSearchSurname(e.target.value)} /></TableCell>
            <TableCell className={classes.cell_removable}><SingleSelect value={searchRehabitationCenter} handleChange={setSearchRehabitationCenter} list={rehabitationCenterList} /></TableCell>
            <TableCell className={classes.cell_removable}><SingleSelect value={searchParticipantStatusType} handleChange={setSearchParticipantStatusType} list={participantStatusTypeList} /></TableCell>
            <TableCell className={classes.cell_removable}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd.MM.yyyy"
                    aria-label="data rozpoczęcia wyszukiwania specjalnego uczestnika - Format wprowadzania daty DD.MM.RRRR"
                    margin="normal"
                    id="date"
                    value={searchDateModified.from}
                    onChange={(e) => handleChangeDate(e, 'from')}
                    KeyboardButtonProps={{
                      'aria-label': 'Zmień datę',
                    }}
										className={classes.date_picker}
                  />
                </Grid>
                <Grid item xs={6}>
                  <KeyboardDatePicker
                    disableToolbar
                    variant="inline"
                    format="dd.MM.yyyy"
                    aria-label="data zakończenia wyszukiwania uczestnika specjalnego - Format wprowadzania daty DD.MM.RRRR"
                    margin="normal"
                    id="date"
                    value={searchDateModified.to}
                    onChange={(e) => handleChangeDate(e, 'to')}
                    KeyboardButtonProps={{
                      'aria-label': 'Zmień datę',
                    }}
										className={classes.date_picker}
                  />
                </Grid>
              </Grid>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          {rows.map((item, indx) => {
            return (
              <TableRow key={indx} className={classes.root}>
                <TableCell onClick={() => handleClick(item.id_candidate)}>{item.participant_number}</TableCell>
                <TableCell onClick={() => handleClick(item.id_candidate)}>{item.name}</TableCell>
                <TableCell onClick={() => handleClick(item.id_candidate)}>{item.surname}</TableCell>
                <TableCell onClick={() => handleClick(item.id_candidate)} className={classes.cell_removable}>{rehabitationCenterList && rehabitationCenterList.length > 0 && item.rehabitation_center > 0 && rehabitationCenterList[item.rehabitation_center - 1].name}</TableCell>
                <TableCell onClick={() => handleClick(item.id_candidate)} className={classes.cell_removable}>{parseInt(item.participant_status_type) >= 1 ? (participantStatusTypeList && participantStatusTypeList.length > 0 && participantStatusTypeList[item.participant_status_type - 1].name) : ''}</TableCell>
                <TableCell onClick={() => handleClick(item.id_candidate)} className={classes.cell_removable}>{getDateTime(item.updated_at)}</TableCell>
                <TableCell>
                  <IconButton aria-label={`Edytuj uczestnika ${item.name + ' ' + item.surname}`} component="span" className={classes.iconButton} onClick={() => history.push(`/participants/edit/${item.id_candidate}`)}>
                    <EditOutlinedIcon className={classes.icon} />
                  </IconButton>
                  <IconButton variant="outlined" aria-label={`Pokaż listę IPR ${item.name + ' ' + item.surname}`} component="span" className={classes.iconButton} onClick={() => showIprList(`${item.name} ${item.surname}`)}>
                    <EventNoteOutlinedIcon className={classes.icon} />
                  </IconButton>
                  <IconButton variant="outlined" aria-label={`Dodaj listę IPR ${item.name + ' ' + item.surname}`} component="span" className={classes.iconButton} onClick={() => createIpr(item.participant_number)}>
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
