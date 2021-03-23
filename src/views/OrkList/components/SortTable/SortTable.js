import React, { useEffect } from 'react';
import {
	Table,
	TableHead,
	TableBody,
	TableRow,
	TableCell,
	TableSortLabel,
	IconButton
} from '@material-ui/core';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { withRouter } from 'react-router-dom';
import useStyles from './style';
import { modelPropertyLabel } from 'utils/modelFormatting';

const SortTable = (props) => {
	const classes = useStyles();
	const {history} = props;
	const { sortBy, sortOrder, requestSort, rows, searchId, setSearchId, searchName, setSearchName } = props;
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
							{modelPropertyLabel('OrkList', 'id')}
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
							{modelPropertyLabel('OrkList', 'name')}
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
					<TableCell><input className={classes.input_box} type="id" id="id" value={searchId} name="searchId" onChange={(e) => setSearchId(e.target.value)} /></TableCell>
					<TableCell><input className={classes.input_box} type="name" id="name" value={searchName} name="searchId" onChange={(e) => setSearchName(e.target.value)} /></TableCell>
					<TableCell></TableCell>
				</TableRow>
				{rows.map((item, indx) => {
					return (
						<TableRow key={indx} className={classes.root}>
							<TableCell>{item.id}</TableCell>
							<TableCell>{item.name}</TableCell>
							<TableCell>
								<IconButton  aria-label={`Edytuj Ośrodków Rehabilitacji ${item.name}`} component="span" className={classes.iconButton} onClick={() => history.push(`/ork_list/edit/${item.id}`)}>
									<EditOutlinedIcon className={classes.icon}/>
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
