import { colors } from '@material-ui/core';

const white = '#000000';
const black = '#FFC401';
const pink = '#FFC401';
const gray = '#FFC401';
const green= '#FFC401';
const color = green;
const btn_gray = green;
const pink_disable = '#a02000';
const gray_disable = '#404040';
const topbar_color = '#FFC401';
const topbar_background = '#000000';
const black_white = '#000000';
const sidebar_color = green;
const sidebar_hover_color = white;
const sidebar_title_color = green;
const card_border = `1px solid ${green}`;
const pagination_background = green;

export default {
  black,
  white,
  pink,
  gray,
  color,
  green,
  btn_gray,
  pink_disable,
  gray_disable,
	topbar_color,
	topbar_background,
	black_white,
	sidebar_color,
	sidebar_hover_color,
	sidebar_title_color,
	card_border,
	pagination_background,
  primary: {
    contrastText: white,
    dark: colors.indigo[900],
    main: colors.indigo[500],
    light: colors.indigo[100]
  },
  secondary: {
    contrastText: white,
    dark: colors.blue[900],
    main: colors.blue['A400'],
    light: colors.blue['A400']
  },
  success: {
    contrastText: white,
    dark: colors.green[900],
    main: colors.green[600],
    light: colors.green[400]
  },
  info: {
    contrastText: white,
    dark: colors.blue[900],
    main: colors.blue[600],
    light: colors.blue[400]
  },
  warning: {
    contrastText: white,
    dark: colors.orange[900],
    main: colors.orange[600],
    light: colors.orange[400]
  },
  error: {
    contrastText: white,
    dark: colors.red[900],
    main: colors.red[600],
    light: colors.red[400]
  },
  text: {
    primary: green,
    secondary: green,
    link: colors.blue[600]
  },
  background: {
    default: 'black',
    paper: white
  },
	pagination_color: colors.blueGrey[900],
  icon: colors.blueGrey[600],
  divider: colors.grey[200],
	btn_darkgray: green,
};
