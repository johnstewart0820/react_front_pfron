import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
  Button, Grid, Card, CircularProgress, TextareaAutosize , FormControl, RadioGroup, Radio, FormControlLabel, Checkbox
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import { useToasts } from 'react-toast-notifications'

import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import candidate from '../../apis/candidate';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { pl } from 'date-fns/locale'
import DateFnsUtils from '@date-io/date-fns';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './tab.css';
import clsx from 'clsx';
import HistoryOutlinedIcon from '@material-ui/icons/HistoryOutlined';
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import {DeleteModal} from '../Candidates/components';
import { FirstStepView, FourthStepView, SecondStepView, ThirdStepView } from './components';
import { useTheme } from '@material-ui/styles';

const CandidatesThirdStep = props => {
  const { children } = props;
  const id = props.match.params.id;
  const { history } = props;
  const classes = useStyles();
  const { addToast } = useToasts()
  const breadcrumbs = [{ active: true, label: 'Kandydaci', href: '/candidates' }, { active: false, label: 'Karta informacyjna' }];
  const [stage, setStage] = useState(0);
  const [stageList, setStageList] = useState([]);
  const [status, setStatus] = useState(0);
  const [statusList, setStatusList] = useState([]);
  const [comment, setComment] = useState('');
  const [decision_central_commision, setDecisionCentralCommision] = useState(0);
  const [date_central_commision, setDateCentralCommision] = useState(new Date());
  const [general_remark, setGeneralRemark] = useState('');
  const [progressStatus, setProgressStatus] = useState(false);
  const [error, setError] = useState({});
  const [openModal, setOpenModal] = useState(false);
	const theme = useTheme();
  const handleHistory = () => {
		history.push(`/candidates/history/${id}`)
  }

  const handlePreview = () => {
		history.push(`/candidates/preview_info/${id}`);
  }

  const handleDelete = () => {
    setProgressStatus(true);
    candidate
      .delete(id)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
          if (response.code === 200) {
            setTimeout(function(){history.push('/candidates');}, 1000);
          }
          setProgressStatus(false);
        }
      })
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  }

  useEffect(() => {
    candidate.getInfo()
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setStageList(response.data.stage);
		  setStatusList(response.data.status);
        }
      })
  }, []);

  useEffect(() => {
    setProgressStatus(true);
    candidate.getCandidateInfo(id)
    .then(response => {
      if (response.code === 401) {
        history.push('/login');
      } else {
        setStage(response.data.candidate.stage);
		setStatus(response.data.candidate.status);
        setDecisionCentralCommision(parseInt(response.data.candidate_info.decision_central_commision));
        setDateCentralCommision(response.data.candidate_info.date_central_commision);
        setGeneralRemark(response.data.candidate_info.general_remark ? response.data.candidate_info.general_remark : '');
      } 
      setProgressStatus(false);
    })
   
  }, [statusList]);

  const handleBack = () => {
    history.push('/candidates');
  }

  const handleProfile = () => {
    history.push(`/candidates/edit/${id}`)
  }

  const handleSave = () => {
    if (checkError() || parseInt(decision_central_commision) == 0 || isNaN(decision_central_commision)) {
      addToast(<label>Proszę wypełnić wszystkie wymagane pola.</label>, { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
      handleError();
    } else {
      setProgressStatus(true);
	  if (decision_central_commision == 2) {
		candidate.updateCandidateStep3(
			3, 3, comment,
			decision_central_commision, date_central_commision, general_remark, id)
		  .then(response => {
			if (response.code === 401) {
			  history.push('/login');
			} else {
			  addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
			  if (response.code === 200) {
				history.push(`/candidates`);
			  }
			  setProgressStatus(false);
			}
		  })
	  } else if (decision_central_commision == 1) {
		candidate.updateCandidateStep3(
			4, 4, comment,
			decision_central_commision, date_central_commision, general_remark, id)
		  .then(response => {
			if (response.code === 401) {
			  history.push('/login');
			} else {
			  if (response.code === 200) {
				history.push(`/candidates/info/step4/${id}`);
			  }
			  setProgressStatus(false);
			}
		  })
	  }

    }
  }

  const handleError = () => {
    let _error = {}
    _error.comment = (comment.length === 0);
    _error.stage = (parseInt(stage) === 0);
    setError(_error);
  }

  const checkError = () => {
    return (comment.length === 0) || (parseInt(stage) === 0);
  }

  const handleChangeComment = (value) => {
    setComment(value);
    let _error = JSON.parse(JSON.stringify(error));
    _error.comment = (value.length === 0);
    setError(_error);
  }


  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={pl}>
    <div className={classes.public}>
      <div className={classes.controlBlock}>
        <Breadcrumb list={breadcrumbs} />
        <div style={{display: 'flex'}}>
          <Button variant="outlined" color="secondary" className={classes.btnProfile} onClick={handleProfile}>
            Wróć do edycji profilu
          </Button>
          <Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleBack}>
            Wróć do listy kandydatow
          </Button>
        </div>
      </div>
      <Grid container spacing={3} className={classes.formBlock}>
        <Grid item xs={9}>
        <Tabs defaultIndex={2}>
          <TabList>
		  	<Tab disabled><Link to={`#`} className={classes.button}>ETAP 1</Link></Tab>
            <Tab disabled><Link to={`#`} className={classes.button} disabled>ETAP 2</Link></Tab>
            <Tab><Link to={`#`} className={classes.button} disabled>ETAP 3</Link></Tab>
            <Tab disabled><Link to={`#`} className={classes.button} disabled>ETAP 4</Link></Tab>
          </TabList>
          <TabPanel>
          </TabPanel>
          <TabPanel>
          </TabPanel>
          <TabPanel style={{backgroundColor: theme.palette.black_white}}>
            <ThirdStepView 
              decision_central_commision={decision_central_commision}
              setDecisionCentralCommision={setDecisionCentralCommision}
              date_central_commision={date_central_commision}
              setDateCentralCommision={setDateCentralCommision}
              general_remark={general_remark}
              setGeneralRemark={setGeneralRemark}
            />
          </TabPanel>
          <TabPanel>
          </TabPanel>
        </Tabs>
        </Grid>
        <Grid item xs={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card className={classes.form}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
				  	<div className={classes.top_label} htmlFor="name">Etap</div>
                    <SingleSelect value={stage} list={stageList} disabled={true}/>
					<div className={classes.top_label} htmlFor="name">Status</div>
                    <SingleSelect value={status} list={statusList} disabled={true}/>
                    <div className={classes.input_box_label} htmlFor="name">Komentarz dotyczący edycji (max 100 znaków)</div>
                    <TextareaAutosize className={clsx({[classes.textArea] : true, [classes.error] : error.comment})} value={comment} rowsMin={10} onChange={(e) => handleChangeComment(e.target.value)} placeholder="Utworzenie profilu uczestnika"/>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Button variant="outlined" color="secondary" className={classes.btnOption} onClick={handleHistory}>
                          <HistoryOutlinedIcon/>
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button variant="outlined" color="secondary" className={classes.btnOption} onClick={handlePreview}>
                          <FindInPageOutlinedIcon/>
                        </Button>
                      </Grid>
                      <Grid item xs={4}>
                        <Button variant="outlined" color="secondary" className={classes.btnOption} onClick={handleDelete}>
                          <DeleteIcon/>
                        </Button>
                      </Grid>
                    </Grid>
                    <Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleSave}>
                      Zapisz
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
    {
      progressStatus ?
      <>
      <div className={classes.progressContainer}>
        <CircularProgress className={classes.progress}/>
      </div>
      </>
      :
      <></>
    }
    <DeleteModal
      openModal={openModal}
      handleClose={handleCloseModal}
      handleDelete={handleDelete}
      selectedIndex={id}
    />
    </MuiPickersUtilsProvider>
  );
};

export default CandidatesThirdStep;
