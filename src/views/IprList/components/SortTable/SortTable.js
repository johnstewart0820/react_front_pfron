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
import { SingleSelect } from 'components';
import { withRouter } from 'react-router-dom';
import useStyles from './style';

import {
	KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { pl } from 'date-fns/locale';
import DateFnsUtils from '@date-io/date-fns';

const SortTable = (props) => {
	const classes = useStyles();
	const { history } = props;
	const { sortBy, sortOrder, requestSort, rows, searchId, setSearchId, searchName, setSearchName, searchIprType, setSearchIprType, iprTypeList, searchNumber, setSearchNumber, searchCreatedAt, setSearchCreatedAt, searchScheduleDate, setSearchScheduleDate, handleDelete } = props;
	useEffect(() => {
	}, []);

	const getDate = (value) => {
		let _date = new Date(value);
		let month = (_date.getMonth() + 1);
		let date = _date.getDate();
		if (month < 10) {
			month = '0' + month;
		}
		if (date < 10) {
			date = '0' + date;
		}
		return _date.getFullYear() + '-' + month + '-' + date;
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
								Imię i nazwisko uczestnika
            </TableSortLabel>
						</TableCell>
						<TableCell>
							<TableSortLabel
								active={sortBy === 2}
								direction={sortOrder}
								onClick={() => requestSort(2)}
							>
								Typ IPR
            </TableSortLabel>
						</TableCell>
						<TableCell>
							<TableSortLabel
								active={sortBy === 3}
								direction={sortOrder}
								onClick={() => requestSort(3)}
							>
								Numer
            </TableSortLabel>
						</TableCell>
						<TableCell>
							<TableSortLabel
								active={sortBy === 4}
								direction={sortOrder}
								onClick={() => requestSort(4)}
							>
								Data powstania
            </TableSortLabel>
						</TableCell>
						<TableCell>
							<TableSortLabel
								active={sortBy === 5}
								direction={sortOrder}
								onClick={() => requestSort(5)}
							>
								Data wypelnienia
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
						<TableCell><SingleSelect value={searchIprType} handleChange={setSearchIprType} list={iprTypeList} /> </TableCell>
						<TableCell><input className={classes.input_box} type="name" value={searchNumber} name="searchId" onChange={(e) => setSearchNumber(e.target.value)} /></TableCell>
						<TableCell>
							<KeyboardDatePicker
								disableToolbar
								variant="inline"
								format="dd.MM.yyyy"
								margin="normal"
								id="date-picker-inline"
								value={searchCreatedAt}
								onChange={(e) => setSearchCreatedAt(getDate(e))}
								KeyboardButtonProps={{
									'aria-label': 'change date',
								}}
								className={classes.date_picker}
							/>
						</TableCell>
						<TableCell>
							<KeyboardDatePicker
								disableToolbar
								variant="inline"
								format="dd.MM.yyyy"
								margin="normal"
								id="date-picker-inline"
								value={searchScheduleDate}
								onChange={(e) => setSearchScheduleDate(getDate(e))}
								KeyboardButtonProps={{
									'aria-label': 'change date',
								}}
								className={classes.date_picker}
							/>
						</TableCell>
						<TableCell></TableCell>
					</TableRow>
					{rows.map((item, indx) => {
						return (
							<TableRow key={indx} className={classes.root}>
								<TableCell>{item.id}</TableCell>
								<TableCell>{item.name}</TableCell>
								<TableCell>{iprTypeList && iprTypeList.length > 0 && iprTypeList[item.ipr_type - 1].name}</TableCell>
								<TableCell>{item.number}</TableCell>
								<TableCell>{getDate(item.created_at)}</TableCell>
								<TableCell>{getDate(item.schedule_date)}</TableCell>
								<TableCell>
									<IconButton aria-label="upload picture" component="span" className={classes.iconButton} onClick={
										() => history.push(parseInt(item.ipr_type) !== 1 ? `/ipr_list/plan/edit/${item.id}` : `/ipr_list/balance/edit/${item.id}`)
									}>
										<EditOutlinedIcon className={classes.icon} />
									</IconButton>
									<IconButton variant="outlined" aria-label="upload picture" component="span" className={classes.iconButton} onClick={() => handleDelete(item.id)}>
										<DeleteOutlineOutlinedIcon className={classes.icon} />
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
