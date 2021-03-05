import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
  Button, Grid, Card, CircularProgress, IconButton
} from '@material-ui/core';

import { useToasts } from 'react-toast-notifications'

import { Breadcrumb } from 'components';

const Cockpit = props => {
  const { history } = props;
  const classes = useStyles();
  const { addToast } = useToasts()
  const breadcrumbs = [{ active: false, label: 'Kokpit'}];

  const [progressStatus, setProgressStatus] = useState(false);
  useEffect(() => {
    // rehabitation_center.get(id)
    //   .then(response => {
    //     if (response.code === 401) {
    //       history.push('/login');
    //     } else {
    //       setRehabitationCenter(response.data.rehabitation_center);
    //       setQuaterList(JSON.stringify(response.data.quaters));
    //       setPartners(JSON.stringify(response.data.partners));
    //     }
    //   })
  }, []);

  
  return (
	  <>
      <div className={classes.public}>
        <div className={classes.controlBlock}>
          <Breadcrumb list={breadcrumbs} />
        </div>
        <Grid container spacing={3} className={classes.formBlock}>
          	<Grid item xs={12}>
				<Card className={classes.form}>
					<Grid container spacing={3}>
						<Grid item xs={2}></Grid>
						<Grid item xs={8}>
							<Grid container spacing={3}>
								<Grid item xs={1}></Grid>
								<Grid item xs={10}>
									<div className={classes.title}>
										Wypracowanie i pilotazowe wdrozenie modelu kompleksowej rehabilitacji umozliwiajacej podjecje lub powrot do pracy
									</div>
								</Grid>
								<Grid item xs={1}></Grid>
								<Grid item xs={6}>
									<Button variant="outlined" color="secondary" className={classes.btnBack}>
										Kandydaci
									</Button>
								</Grid>
								<Grid item xs={6}>
									<Button variant="outlined" color="secondary" className={classes.btnBack}>
										Uczestnicy
									</Button>
								</Grid>
								<Grid item xs={6}>
									<Button variant="outlined" color="secondary" className={classes.btnBack}>
										Osrodki
									</Button>
								</Grid>
								<Grid item xs={6}>
									<Button variant="outlined" color="secondary" className={classes.btnBack}>
										Finanse
									</Button>
								</Grid>
							</Grid>
						</Grid>
						<Grid item xs={2}></Grid>
					</Grid>
				</Card>
			</Grid>
			<Grid item xs={5}>
				
			</Grid>
        </Grid>
      </div>
      {
        progressStatus ?
          <>
            <div className={classes.progressContainer}>
              <CircularProgress className={classes.progress} />
            </div>
          </>
          :
          <></>
      }
    </>
  );
};

export default Cockpit;
