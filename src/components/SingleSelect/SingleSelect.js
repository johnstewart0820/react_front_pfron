import React, { useEffect } from 'react';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import useStyles from './style';

const SingleSelect = (props) => {
  const classes = useStyles();
  const { value, handleChange, list} = props;
  useEffect(() => {
  }, []);

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel htmlFor="outlined-age-native-simple" className={classes.name_select_box} shrink={false}>
        {
          value == 0 ? '' : ''
        }
      </InputLabel>
      <Select
        native
        value={value}
        onChange={(event) =>handleChange(event.target.value ? event.target.value : {})}
        inputProps={{
          name: 'age',
          id: 'outlined-age-native-simple',
        }}
        className={classes.input_box}
      >
        <option aria-label="None" value={0} />
        {
          list.map((item, index) => 
            <option key={index} value={item.id}>{item.name}</option>
          )
        }
      </Select>
    </FormControl>
  );
};

export default withRouter(SingleSelect);
