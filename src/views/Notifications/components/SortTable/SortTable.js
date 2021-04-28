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
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import { withRouter } from 'react-router-dom';
import useStyles from './style';
import { Alert } from 'components';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { pl } from 'date-fns/locale';
import DateFnsUtils from '@date-io/date-fns';

const SortTable = (props) => {
  const classes = useStyles();
  const { history } = props;
  const { sortBy, sortOrder, requestSort, rows, searchTitle, setSearchTitle, searchDateModified, setSearchDateModified, handleClick, handleSetState, handleDelete } = props;
  useEffect(() => {
  }, []);

	const getZeroValue = (value) => {
		if (value < 10) 
			return '0' + value;
		return value;
	}

  const getDateTime = (value) => {
    let _date = new Date(value);
		
    return _date.getFullYear() + '.' + getZeroValue(_date.getMonth() + 1) + '.' + getZeroValue(_date.getDate()) + ' ' + getZeroValue(_date.getHours()) + ':' + getZeroValue(_date.getMinutes());
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
									Temat
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
									Data
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
            <TableCell><input className={classes.input_box} type="id" value={searchTitle} id="id" name="searchTitle" onChange={(e) => setSearchTitle(e.target.value)} /></TableCell>
            <TableCell>
							<KeyboardDatePicker
								disableToolbar
								variant="inline"
								format="dd.MM.yyyy"
								aria-label="Data powiadomienia - Format wprowadzania daty DD.MM.RRRR"
								margin="normal"
								id="date"
								value={searchDateModified}
								onChange={(e) => setSearchDateModified(e)}
								KeyboardButtonProps={{
									'aria-label': 'Zmień datę',
								}}
							/>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
          {rows.map((item, indx) => {
            return (
              <TableRow key={indx} className={classes.root}>
                <TableCell className={classes.title} onClick={() => handleClick(item)}>{item.title}</TableCell>
                <TableCell onClick={() => handleClick(item)}>{getDateTime(item.updated_at)}</TableCell>
                <TableCell>
                  <IconButton variant="outlined" component="span" aria-label={item.activate_status ? `potwierdzone powiadomienie ${item.title}` : `potwierdź powiadomienie ${item.title}`}className={classes.iconButton} onClick={() => handleSetState(item.id)}>
										{
											item.activate_status ?
												<DoneIcon className={classes.green} />
											:
												<CloseIcon className={classes.red} />
										}
                  </IconButton>
                  <IconButton variant="outlined" component="span" aria-label={`Usuń powiadomienie ${item.title}`} className={classes.iconButton} onClick={() => handleDelete(item.id)}>
										<DeleteOutlineOutlinedIcon className={classes.icon}/>
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
