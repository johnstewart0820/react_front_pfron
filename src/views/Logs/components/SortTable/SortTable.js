import React, { useEffect } from 'react';
import {
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	TableFooter,
	TableSortLabel,
	IconButton, TextField,
} from '@material-ui/core';
import ClearIcon from "@material-ui/icons/Clear";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import { SingleSelect } from 'components';
import { withRouter } from 'react-router-dom';
import useStyles from './style';
import {
	MuiPickersUtilsProvider, KeyboardDatePicker
} from '@material-ui/pickers';
import { DateTime } from "luxon";
import { modelName, modelPropertyLabel } from 'utils/modelFormatting';


const getNamesFromList = (strIDs, list) => {
	if (!list || list.length === 0 || strIDs === null)
		return '';
	const ids = strIDs.split(',');
	const names = ids.map(id => {
		return list[parseInt(id)] ? list[parseInt(id)].name : '';
	});
	return names.join(', ');
}
const getNameFromList = (strID, list) => {
	if (!list || list.length === 0 || strID === null)
		return '';
	return list[parseInt(strID)].name;
}


const SortTable = (props) => {
	const classes = useStyles();
	const { history } = props;
	const { sortBy, sortOrder, requestSort, total, rows, page, selectedCount,
		searchId, setSearchId,
		searchUserName, setSearchUserName,
		searchRole, setSearchRole, roleList,
		searchDate, setSearchDate,
		searchEvent, setSearchEvent,

		typeListByID,
		ambassadorListByID,
		qualificationPointListByID,
		stageListByID,
		rehabitationCenterListByID,
		specializationListByID,
		specialistListByID,
		specialtyTypeListByID,
		serviceListListByID,
		unitListByID,
		moduleListByID,
		paymentListByID,
		userListByID,
		roleListByID,

		handleDelete
	} = props;
	useEffect(() => {
	}, []);

	const clearDate = (e) => {
		e.stopPropagation();
		setSearchDate(null)
	}

	const modelPropertyFormatter = (modelName, property) => {
		const formatters = {
			'App\\Models\\QualificationPoint': {
				type: value => getNameFromList(value, typeListByID),
				ambassador: value => getNamesFromList(value, ambassadorListByID),
			},
			'App\\Models\\Candidate': {
				stage: value => getNameFromList(value, stageListByID),
			},
			'App\\Models\\OrkTeam': {
				rehabitation_center: value => getNameFromList(value, rehabitationCenterListByID),
				specialization: value => getNameFromList(value, specializationListByID),
			},
			'App\\Models\\Payment': {
				rehabitation_center: value => getNameFromList(value, rehabitationCenterListByID),
				service: value => getNameFromList(value, serviceListListByID),
			},
			'App\\Models\\Specialist': {
				qualification_point: value => getNameFromList(value, qualificationPointListByID),
				specialty: value => getNameFromList(value, specialtyTypeListByID),
			},
			'App\\Models\\User': {
				role: value => getNameFromList(value, roleListByID),
			},
		}

		const model = formatters[modelName] || formatters[`App\\Models\\${modelName}`] || null
		return (model && model[property]) || ((x) => x);
	}

	const formatChange = (type, property, from, to) => {
		const formatter = modelPropertyFormatter(type, property);
		const formattedName = modelPropertyLabel(type, property);
		const formattedFrom = formatter(from);
		const formattedTo = formatter(to);
		return formattedName ? <div><b>{formattedName}</b>{from !== null ? <> from <u>{formattedFrom}</u> to</> : <>: </>} <u>{formattedTo}</u></div> : null;
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
							{modelPropertyLabel('Log', 'id')}
							</label>
						</TableSortLabel>
					</TableCell>
					<TableCell>
						<TableSortLabel
							active={sortBy === 1}
							direction={sortOrder}
							onClick={() => requestSort(1)}
						>
							<label htmlFor="user">
							{modelPropertyLabel('Log', 'user')}
							</label>
						</TableSortLabel>
					</TableCell>
					<TableCell>
						<TableSortLabel
							active={sortBy === 2}
							direction={sortOrder}
							onClick={() => requestSort(2)}
						>
							<label htmlFor="role">
							{modelPropertyLabel('Log', 'role')}
							</label>
						</TableSortLabel>
					</TableCell>
					<TableCell>
						<TableSortLabel
							active={sortBy === 3}
							direction={sortOrder}
							onClick={() => requestSort(3)}
						>
							<label htmlFor="created_at">
							{modelPropertyLabel('Log', 'date')}
							</label>
						</TableSortLabel>
					</TableCell>
					<TableCell>
						<TableSortLabel
							active={sortBy === 4}
							direction={sortOrder}
							onClick={() => requestSort(4)}
						>
							{modelPropertyLabel('Log', 'event')}
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
					<TableCell><input className={classes.input_box} type="text" id="id" value={searchId} name="searchId" onChange={(e) => setSearchId(e.target.value)} /></TableCell>
					<TableCell><input className={classes.input_box} type="text" id="user" value={searchUserName} name="searchUserName" onChange={(e) => setSearchUserName(e.target.value)} /></TableCell>
					<TableCell><SingleSelect value={searchRole} handleChange={setSearchRole} list={roleList} /> </TableCell>
					<TableCell><KeyboardDatePicker
						className={classes.date_picker}
						id="created_at"
						disableToolbar
						variant="inline"
						format="dd.MM.yyyy"
						value={searchDate}
						onChange={setSearchDate}
						KeyboardButtonProps={{
							'aria-label': 'change date',
						}}
						format="dd.MM.yyyy" autoOk={true}
						InputProps={{
							endAdornment: (
								<IconButton onClick={clearDate}>
									<ClearIcon />
								</IconButton>
							)
						}} />
					</TableCell>
					<TableCell></TableCell>
				</TableRow>
				{rows.map((item, indx) => {
					return (
						<TableRow key={indx} className={classes.root}>
							<TableCell>{item.id}</TableCell>
							<TableCell>{item.user ? item.user.name : ''}</TableCell>
							<TableCell>{item.role ? item.role.name : ''}</TableCell>
							<TableCell>{DateTime.fromISO(item.created_at).toFormat('dd.MM.yyyy hh:mm')}</TableCell>
							<TableCell>
								<div>{item.event} {modelName(item.auditable_type)}</div>
								{(item.event === 'updated' || item.event === 'created') &&
									Object.entries(item.changes).map(([name, [from, to]]) => formatChange(item.auditable_type, name, from, to))
								}
							</TableCell>
							<TableCell>
								<IconButton variant="outlined" aria-label={`Usuń log`} component="span" className={classes.iconButton} onClick={() => handleDelete(item.id)}>
									<DeleteOutlineOutlinedIcon className={classes.icon} />
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
