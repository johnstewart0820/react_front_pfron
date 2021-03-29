import { makeStyles, useTheme } from '@material-ui/styles';
const useStyles = makeStyles((theme) => ({
    controlBlock: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    btnCreate: {
        '& .MuiButton-label': {
          textTransform: 'none',
          fontSize: '0.8750em',
        },
        '&:hover': {
          backgroundColor: theme.palette.btn_gray
        },
        padding: theme.spacing(0.5, 6, 0.5, 2),
        borderRadius: '0px',
        fontWeight: '300',
        backgroundColor: theme.palette.btn_gray,
        color: theme.palette.black_white,
				[theme.breakpoints.up('xs')]: {
					marginRight: '0px',
					marginBottom: theme.spacing(1)
				},
				[theme.breakpoints.up('md')]: {
					marginRight: '20px',
				},
    },
		button_list: {
			[theme.breakpoints.up('xs')]: {
				display: 'grid',
			},
			[theme.breakpoints.up('md')]: {
				display: 'flex',
			},
		},
    btnExport: {
        '& .MuiButton-label': {
          textTransform: 'none',
          fontSize: '0.8750em',
        },
        '&:hover': {
          backgroundColor: theme.palette.pink,
          borderColor: theme.palette.pink,
          color: theme.palette.black_white
        },
        padding: theme.spacing(0.5, 8),
        borderRadius: '0px',
        fontWeight: '300',
        color: theme.palette.pink,
        borderColor: theme.palette.pink,
				height: '100%'
    },
    divide: {
        backgroundColor: 'lightgray',
        height: '1px',
        width: '100%',
        margin: theme.spacing(2.5, 0,)
    },
    rowsBlock: {
           color: theme.palette.text.primary,
        display: 'flex',
        alignItems: 'center',
        fontFamily: 'roboto',
        fontSize: '0.9375em'
    },
    filter: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    table: {
        margin: theme.spacing(2.5, 0),
       border: theme.palette.card_border,
    },
    pagination: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: theme.spacing(1)
    },
		pagenation_class: {
			'& .MuiPaginationItem-page.Mui-selected': {
				backgroundColor: theme.palette.pagination_background,
				color: theme.palette.pagination_color
			}
		}
}));

export default useStyles;
