import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
} from '@material-ui/core';
import useStyles from './style';

const SearchInput = props => {
  const { className, onChange, style, ...rest } = props;

  const classes = useStyles();

  return (
    <div>
      <TextField
        className={classes.textField}
        error={hasError('password')}
        fullWidth
        helperText={
          hasError('password') ? formState.errors.password[0] : null
        }
        label="Password"
        name="password"
        onChange={handleChange}
        type="password"
        value={formState.values.password || ''}
        variant="outlined"
      />
    </div>
  );
};

SearchInput.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  style: PropTypes.object
};

export default SearchInput;
