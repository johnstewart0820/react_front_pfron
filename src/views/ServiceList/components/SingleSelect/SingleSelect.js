import React, { useEffect } from 'react';
import { FormControl, InputLabel, Select } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import useStyles from './style';
import { Alert } from 'components';

const SingleSelect = (props) => {
  const classes = useStyles();
  const { value, handleChange, list} = props;
  useEffect(() => {
  }, []);

  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <Select
        native 
           className={classes.input_box}
        value={value}
        className={classes.name_select_box}
        onChange={(event) =>handleChange(event.target.value ? event.target.value : {})}
        inputProps={{
          name: 'age',
          id: 'outlined-age-native-simple',
        }}
				aria-label={`${value} wyświetleń rekordów na stronie`}
      >
        {
          list.map((item, index) => (
						<>
						<option aria-label={`${item} wyświetleń rekordów na stronie`} id={item} key={index} value={item}>{item}</option>
						</>
					))
        }
      </Select>
    </FormControl>
  );
};

export default withRouter(SingleSelect);
