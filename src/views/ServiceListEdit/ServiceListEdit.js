import React, { useState, useEffect } from 'react';
import useStyles from './style';
import {
  Button, Grid, Card, TextField, CircularProgress, FormControlLabel, Checkbox
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { useToasts } from 'react-toast-notifications'
import { Breadcrumb, SingleSelect } from 'components';
import service_list from '../../apis/service-list';
import clsx from 'clsx';
import {DeleteModal} from '../ServiceList/components';

const ServiceListEdit = props => {
  const { children } = props;
  const { history } = props;
  const classes = useStyles();
  const { addToast } = useToasts()
  const breadcrumbs = [{active: true, href: '/', label: 'Usługi'}, {active: true, label: 'Lista dostępnych usług', href: '/service_list'}, {active:false, label: 'Dodaj Usługę'}];
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [module, setModule] = useState(0);
  const [moduleList, setModuleList] = useState([]);
  const [type, setType] = useState(0);
  const [typeList, setTypeList] = useState([]);
  const [amount_usage, setAmountUsage] = useState('');
  const [unit, setUnit] = useState(0);
  const [unitList, setUnitList] = useState([]);
  const [amount_takes, setAmountTakes] = useState('');
  const [is_required, setIsRequired] = useState(false);
  const [not_applicable, setNotApplicable] = useState(false); 
  const [progressStatus, setProgressStatus] = useState(false);
  const id = props.match.params.id;
  const [error, setError] = useState({});
  const [openModal, setOpenModal] = useState(false);
  
  useEffect(() => {
    service_list.getInfo()
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          setUnitList(response.data.units);
          setModuleList(response.data.modules);
		  setTypeList(response.data.types);
        }
      })
  }, []);

  useEffect(() => {
    service_list.get(id)
    .then(response => {
      if (response.code === 401) {
        history.push('/login');
      } else {
        setNumber(response.data.service_list.number)
        setName(response.data.service_list.name);
        setModule(response.data.service_list.module);
		setType(response.data.service_list.type);
        setAmountUsage(response.data.service_list.amount_usage);
        setUnit(response.data.service_list.unit);
        setAmountTakes(response.data.service_list.amount_takes);
        setIsRequired(response.data.service_list.is_required === 1 ? true : false);
        setNotApplicable(response.data.service_list.not_applicable === 1 ? true : false);
      }
    })
  }, [moduleList]);
const handleError = () => {
    let _error = {}
    _error.number = (number.length === 0);
    _error.name = (name.length === 0);
    _error.module = (parseInt(module) === 0);
	_error.type = (parseInt(type) === 0);
    _error.unit = (parseInt(unit) === 0);
    setError(_error);
  };

  const handleChangeName = (value) => {
    setName(value);
    let _error = JSON.parse(JSON.stringify(error));
    _error.name = (value.length === 0);
    setError(_error);
  }

  const handleChangeNumber = (value) => {
    if (!isNaN(value)) {
      setNumber(value);
      let _error = JSON.parse(JSON.stringify(error));
      _error.number = (value.length === 0);
      setError(_error);
    }
  }

  const handleChangeModule = (value) => {
    setModule(value);
    let _error = JSON.parse(JSON.stringify(error));
    _error.module = (parseInt(value) === 0);
    setError(_error);
  }

  const handleChangeType = (value) => {
	  setType(value);
	  let _error = JSON.parse(JSON.stringify(error));
	  _error.type = (parseInt(value) === 0);
	  setError(_error);
  }

  const handleChangeUnit = (value) => {
    setUnit(value);
    let _error = JSON.parse(JSON.stringify(error));
    _error.unit = (parseInt(value) === 0);
    setError(_error);
  }
  
  const handleChangeAmountUsage = (value) => {
	setAmountUsage(value);
  }

  const handleChangeAmountTakes = (value) => {
	setAmountTakes(value);
  }
  
  const checkError = () => {
    return name.length === 0 || number.length === 0 || parseInt(module) === 0 || parseInt(type) === 0 || parseInt(unit) === 0;
  }

  const handleBack = () => {
    history.push('/service_list');
  }

  const handleSave = () => {
    if (checkError()) {
      addToast(<label>Proszę wypełnić wszystkie wymagane pola.</label>, { appearance: 'error', autoDismissTimeout: 3000, autoDismiss: true })
      handleError();
    } else {
      setProgressStatus(true);

      service_list.update(number, name, module, type, amount_usage, unit, amount_takes, is_required, not_applicable, id)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
          if (response.code === 200) {
            setTimeout(function(){history.push('/service_list');}, 1000);
          }
          setProgressStatus(false);
        }
      })
    }
  }

  const handleDelete = () => {
    setProgressStatus(true);
    service_list
      .delete(id)
      .then(response => {
        if (response.code === 401) {
          history.push('/login');
        } else {
          addToast(<label>{response.message}</label>, { appearance: response.code === 200 ? 'success' : 'error', autoDismissTimeout: response.code === 200 ? 1000 : 3000, autoDismiss: true})
          if (response.code === 200) {
            setTimeout(function(){history.push('/service_list');}, 1000);
          }
          setProgressStatus(false);
        }
      })
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  }

  return (
    <>
    <div className={classes.public}>
      <div className={classes.controlBlock}>
        <Breadcrumb list={breadcrumbs} />
        <Button variant="outlined" color="secondary" className={classes.btnBack} onClick={handleBack}>
					Wróć do listy usług
        </Button>
      </div>
      <Grid container spacing={3} className={classes.formBlock}>
        <Grid item xs={9}>
          <Card className={classes.form}>
            <Grid container spacing={3}>
              <Grid item xs={3} className={classes.form_title}>
                Dane podstawowe
              </Grid>
              <Grid item xs={9}>
                <Grid container spacing={1}>
                  <Grid item xs={3}>
                    <div className={classes.top_label}><label htmlFor="number">Numer</label></div>
                    <input className={clsx({[classes.input_box] : true, [classes.error] : error.number})} id="number" type="name" value={number} name="name" onChange={(e) => handleChangeNumber(e.target.value)} />
                  </Grid>
                  <Grid item xs={9}>
                    <div className={classes.top_label}><label htmlFor="name">Nazwa usługi</label></div>
                    <input className={clsx({[classes.input_box] : true, [classes.error] : error.name})} id="name" type="name" value={name} name="name" onChange={(e) => handleChangeName(e.target.value)} />
                  </Grid>
                  <Grid item xs={6}>
                    <div className={classes.input_box_label} htmlFor="type">Sekcja</div>
                    <SingleSelect value={module} handleChange={handleChangeModule} list={moduleList} error={error.module}/>
                  </Grid>
				  <Grid item xs={6}>
                    <div className={classes.input_box_label} htmlFor="type">Rodzaj</div>
                    <SingleSelect value={type} handleChange={handleChangeType} list={typeList} error={error.type}/>
                  </Grid>
				  <Grid item xs={12}>
					<div className={classes.label}>Minimalny zakres usługi</div>
				  </Grid>
                  <Grid item xs={3}>
                    <div className={classes.input_box_label}><label htmlFor="amount_usage">Liczba</label></div>
                    <input className={classes.input_box} type="name" value={amount_usage} id="amount_usage" name="name" onChange={(e) => handleChangeAmountUsage(e.target.value)} />
                  </Grid>
                  <Grid item xs={5}>
                    <div className={classes.input_box_label}>Jednostka</div>
                    <SingleSelect value={unit} handleChange={handleChangeUnit} list={unitList} error={error.unit}/>
                  </Grid>
                  <Grid item xs={4}>
                    <div className={classes.input_box_label}><label htmlFor="amount_takes">Czas trwania (w minutach)</label></div>
                    <input className={classes.input_box} type="name" value={amount_takes} name="name" id="amount_takes" onChange={(e) => handleChangeAmountTakes(e.target.value)} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      className={classes.rememberMe}
                      control={
                        <Checkbox
                          checked={is_required}
                          onChange={() => setIsRequired(!is_required)}
                        />
                      }
                      label="Usługa obowiązkowa"
                    />  
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      className={classes.rememberMe}
                      control={
                        <Checkbox
                          checked={not_applicable}
                          onChange={() => setNotApplicable(!not_applicable)}
                        />
                      }
                      label='Zezwalaj na "Nie dotyczy"'
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.form}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Button variant="outlined" color="secondary" className={classes.btnSave} onClick={handleSave}>
                  Zapisz
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button variant="outlined" color="secondary" className={classes.btnDelete} onClick={handleDelete}>
                  <DeleteIcon/>
                </Button>
              </Grid>
            </Grid>
          </Card>
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
    </>
  );
};

export default ServiceListEdit;
