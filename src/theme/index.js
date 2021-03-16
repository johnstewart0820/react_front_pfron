import { createMuiTheme } from '@material-ui/core';

import palette from './palette';
import palette_dark from './palette_dark';
import typography from './typography';
import overrides from './overrides';
import overrides_dark from './overrides_dark';

const theme = (is_contrast) => createMuiTheme({
  palette : is_contrast ? palette_dark : palette,
  typography,
  overrides : is_contrast ? overrides_dark : overrides,
  zIndex: {
    appBar: 1200,
    drawer: 1100
  }
});

export default theme;
