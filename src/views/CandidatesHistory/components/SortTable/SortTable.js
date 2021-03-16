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
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { SingleSelect } from 'components';
import { withRouter } from 'react-router-dom';
import useStyles from './style';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { pl } from 'date-fns/locale'
import qualification from 'apis/qualification';

const SortTable = (props) => {
  const classes = useStyles();
  const { history } = props;
  const { sortBy, sortOrder, requestSort, rows, searchId,
		setSearchId,
		searchCreatedAt,
		setSearchCreatedAt,
		searchDescription,
		setSearchDescription,
		searchUser,
		setSearchUser,
		userList,
	} = props;
  useEffect(() => {
  }, []);

  const getDateTime = (value) => {
    let _date = new Date(value);
    return _date.getFullYear() + '.' + (_date.getMonth() + 1) + '.' + (_date.getDate()) + ' ' + _date.getHours() + ':' + _date.getMinutes();
  }

	const getUser = (id) => {
		let result = '';
		for (let i = 0; i < userList.length; i ++) {
			if (parseInt(userList[i].id) === parseInt(id))
				result = userList[i].name;
		}
		return result;
	}

	const handleChangeDate = (value) => {
		if (!value || value.length === 0)
			setSearchCreatedAt(null);
		else {
			let _date = new Date(value);
			let month = _date.getMonth() + 1;
			let date = _date.getDate();
	
			if (month < 10)
				month = '0' + month;
			if (date < 10)
				date = '0' + date;
			setSearchCreatedAt(_date.getFullYear() + '-' + month + '-' + date);
		}
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
                Data modyfikacji
            </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 2}
                direction={sortOrder}
                onClick={() => requestSort(2)}
              >
                Zmiana
            </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 3}
                direction={sortOrder}
                onClick={() => requestSort(3)}
              >
                Uzytkownik
            </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell><input className={classes.input_box} type="id" value={searchId} name="searchId" onChange={(e) => setSearchId(e.target.value)} /></TableCell>
            <TableCell>
							<KeyboardDatePicker
								disableToolbar
								variant="inline"
								format="dd.MM.yyyy"
								margin="normal"
								id="date-picker-inline"
								value={searchCreatedAt}
								onChange={(value) => handleChangeDate(value)}
								KeyboardButtonProps={{
									'aria-label': 'change date',
								}}
								className={classes.date_picker}
							/>
						</TableCell>
            <TableCell><input className={classes.input_box} type="name" value={searchDescription} name="searchId" onChange={(e) => setSearchDescription(e.target.value)} /></TableCell>
            <TableCell><input className={classes.input_box} type="name" value={searchUser} name="searchId" onChange={(e) => setSearchUser(e.target.value)} /></TableCell>
          </TableRow>
          {rows.map((item, indx) => {
            return (
              <TableRow key={indx} className={classes.root}>
                <TableCell>{item.id}</TableCell>
								<TableCell>{getDateTime(item.created_at)}</TableCell>
								<TableCell>{item.description}</TableCell>
								<TableCell>{getUser(item.created_by)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </MuiPickersUtilsProvider>
  );
};

export default withRouter(SortTable);
