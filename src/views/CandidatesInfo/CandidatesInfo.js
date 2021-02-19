import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
  Button, Grid, Card, CircularProgress, TextareaAutosize , FormControl, RadioGroup, Radio, FormControlLabel, Checkbox
} from '@material-ui/core';
import { useToasts } from 'react-toast-notifications'

import { Breadcrumb, SingleSelect, MultiSelect } from 'components';
import candidate from '../../apis/candidate';
import {
  KeyboardDatePicker, MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './tab.css';
import clsx from 'clsx';
import PictureAsPdfOutlinedIcon from '@material-ui/icons/PictureAsPdfOutlined';
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
import {DeleteModal} from '../Candidates/components';
import { FirstStepView, FourthStepView, SecondStepView, ThirdStepView } from './components';

const CandidatesInfo = props => {
  const { children } = props;
  const id = props.match.params.id;
  const { history } = props;
  const classes = useStyles();
  const { addToast } = useToasts()
  const breadcrumbs = [{ active: true, label: 'Kandydaci', href: '/candidates' }, { active: false, label: 'Karta informacyjna' }];
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [person_id, setPersonId] = useState('');
  const [stage, setStage] = useState(0);
  const [comment, setComment] = useState('');
  const [stageList, setStageList] = useState([]);
  const [qualification_point, setQualificationPoint] = useState(0);
  const [qualificationPointList, setQualificationPointList] = useState([]);
  const [gender, setGender] = useState(0);
  const [doctor, setDoctor] = useState(0);
  const [doctorList, setDoctorList] = useState([]);
  const [psycology, setPsycology] = useState(0);
  const [psycologyList, setPsycologyList] = useState([]); 
  const [admission, setAdmission] = useState(0);
  const [doctor_recommendation, setDoctorRecommendation] = useState(0);
  const [doctor_date, setDoctorDate] = useState(new Date());
  const [doctor_remark, setDoctorRemark] = useState('');
  const [psycology_recommendation, setPsycologyRecommendation] = useState(0);
  const [psycology_date, setPsycologyDate] = useState(new Date());
  const [psycology_remark, setPsycologyRemark] = useState('');
  const [decision_central_commision, setDecisionCentralCommision] = useState(0);
  const [date_central_commision, setDateCentralCommision] = useState(new Date());
  const [general_remark, setGeneralRemark] = useState('');
  const [date_referal, setDateReferal] = useState(new Date());
  const [rehabitation_center, setRehabitationCenter] = useState(0);
  const [rehabitationCenterList, setRehabitationCenterList] = useState([]);
  const [participant_number, setParticipantNumber] = useState('');
  const [date_rehabitation_center, setDateRehabitationCenter] = useState(new Date());
  const [typeToStayList, setTypeToStayList] = useState([{id: 1, name: 'Stacjonarny'}, {id: 2, name: 'Niestacjonarny'}])
  const [type_to_stay, setTypeToStay] = useState(0);
  const [participant_remark, setParticipantRemark] = useState('');
  const [progressStatus, setProgressStatus] = useState(false);
  const [error, setError] = useState({});
  const [openModal, setOpenModal] = useState(false);

  const handleExportPdf = () => {

  }

  const handlePreview = () => {

  }

  const handleDelete = () => {
    setProgressStatus(true);
    candidate
      .delete(id)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(response.message, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
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

  const handleChangeQualificationPoint = (value) => {
    setQualificationPoint(value);
  }

  useEffect(() => {
    candidate.getMarker(qualification_point)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setDoctorList(response.data.doctor);
          setPsycologyList(response.data.psycology);
        }
      });
  }, [qualification_point]);

  useEffect(() => {
    candidate.getInfo()
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setStageList(response.data.stage);
          setQualificationPointList(response.data.qualification_point);
          setRehabitationCenterList(response.data.rehabitation_center);
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
        setComment(response.data.candidate.comment);
        setQualificationPoint(response.data.candidate.qualification_point);
        setName(response.data.candidate.name);
        setSurname(response.data.candidate.surname);
        setPersonId(response.data.candidate.person_id);
        setGender(parseInt(response.data.candidate_info.gender));
        setAdmission(parseInt(response.data.candidate_info.admission));
        setDoctorRecommendation(parseInt(response.data.candidate_info.doctor_recommendation));
        setDoctorRemark(response.data.candidate_info.doctor_remark ? response.data.candidate_info.doctor_remark : '');
        setDoctor(response.data.candidate_info.doctor);
        setDoctorDate(response.data.candidate_info.doctor_date);
        setPsycologyRecommendation(parseInt(response.data.candidate_info.psycology_recommendation));
        setPsycologyRemark(response.data.candidate_info.psycology_remark ? response.data.candidate_info.psycology_remark : '');
        setPsycology(response.data.candidate_info.psycology);
        setPsycologyDate(response.data.candidate_info.psycology_date);
        setDecisionCentralCommision(parseInt(response.data.candidate_info.decision_central_commision));
        setDateCentralCommision(response.data.candidate_info.date_central_commision);
        setGeneralRemark(response.data.candidate_info.general_remark ? response.data.candidate_info.general_remark : '');
        setDateReferal(response.data.candidate_info.date_referal);
        setRehabitationCenter(response.data.candidate_info.rehabitation_center);
        setParticipantNumber(response.data.candidate_info.participant_number);
        setDateRehabitationCenter(response.data.candidate_info.date_rehabitation_center);
        setTypeToStay(response.data.candidate_info.type_to_stay);
        setParticipantRemark(response.data.candidate_info.participant_remark ? response.data.candidate_info.participant_remark : '');
      } 
      setProgressStatus(false);
    })
   
  }, [qualificationPointList]);

  const handleBack = () => {
    history.push('/candidates');
  }

  const handleProfile = () => {
    history.push(`/candidates/edit/${id}`)
  }

  const handleSave = () => {
    if (checkError()) {
      addToast('Proszę wypełnić wszystkie wymagane pola.', { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
      handleError();
    } else {
      setProgressStatus(true);

      candidate.updateCandidateInfo(
        stage, comment,
        qualification_point, gender, doctor, psycology, admission, doctor_recommendation,
        doctor_date, doctor_remark, psycology_recommendation, psycology_date, psycology_remark, decision_central_commision, date_central_commision, general_remark, date_referal,
        rehabitation_center, participant_number, date_rehabitation_center, type_to_stay, participant_remark, id)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(response.message, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
          if (response.code === 200) {
            setTimeout(function(){history.push('/candidates');}, 1000);
          }
          setProgressStatus(false);
        }
      })
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

  const handleChangeStage = (value) => {
    setStage(value);
    let _error = JSON.parse(JSON.stringify(error));
    _error.stage = (parseInt(value) === 0);
    setError(_error);
  }

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
        <Tabs>
          <TabList>
            <Tab>ETAP 1</Tab>
            <Tab>ETAP 2</Tab>
            <Tab>ETAP 3</Tab>
            <Tab>ETAP 4</Tab>
          </TabList>
          <TabPanel>
            <FirstStepView 
              name={name} 
              surname={surname}
              person_id={person_id}
              qualification_point={qualification_point}
              setQualificationPoint={handleChangeQualificationPoint}
              qualificationPointList={qualificationPointList}
              gender={gender}
              setGender={setGender}/>
          </TabPanel>
          <TabPanel>
            <SecondStepView 
              admission={admission} 
              setAdmission={setAdmission}
              doctor_recommendation={doctor_recommendation}
              setDoctorRecommendation={setDoctorRecommendation}
              doctor_date={doctor_date}
              setDoctorDate={setDoctorDate}
              doctor={doctor}
              setDoctor={setDoctor}
              doctor_remark={doctor_remark}
              setDoctorRemark={setDoctorRemark}
              psycology_recommendation={psycology_recommendation}
              setPsycologyRecommendation={setPsycologyRecommendation}
              psycology_date={psycology_date}
              setPsycologyDate={setPsycologyDate}
              psycology={psycology}
              setPsycology={setPsycology}
              psycology_remark={psycology_remark}
              setPsycologyRemark={setPsycologyRemark}
              doctorList={doctorList}
              psycologyList={psycologyList}
              />
          </TabPanel>
          <TabPanel>
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
            <FourthStepView
              date_referal={date_referal}
              setDateReferal={setDateReferal}
              rehabitation_center={rehabitation_center}
              setRehabitationCenter={setRehabitationCenter}
              rehabitationCenterList={rehabitationCenterList}
              participant_number={participant_number}
              setParticipantNumber={setParticipantNumber}
              date_rehabitation_center={date_rehabitation_center}
              setDateRehabitationCenter={setDateRehabitationCenter}
              typeToStayList={typeToStayList}
              type_to_stay={type_to_stay}
              setTypeToStay={setTypeToStay}
              participant_remark={participant_remark}
              setParticipantRemark={setParticipantRemark}
            />
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
                    <SingleSelect value={stage} handleChange={handleChangeStage} list={stageList} error={error.stage}/>
                    <div className={classes.input_box_label} htmlFor="name">Komentarz dotyczący edycji(max 100 znków)</div>
                    <TextareaAutosize className={clsx({[classes.textArea] : true, [classes.error] : error.comment})} value={comment} rowsMin={10} onChange={(e) => handleChangeComment(e.target.value)} placeholder="Utworzenie profilu uczestnika"/>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Button variant="outlined" color="secondary" className={classes.btnOption} onClick={handleExportPdf}>
                          <PictureAsPdfOutlinedIcon/>
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

export default CandidatesInfo;
