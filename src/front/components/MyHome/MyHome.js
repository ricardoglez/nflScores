import React, { useEffect, useState } from 'react';
import { API } from '../../../API';
import ErrorComponent from '../ErrorComponent';
import ListMatches from '../ListMatches';
import { Grid, CircularProgress, Typography } from '@material-ui/core';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import firstBy from 'thenby';
import useFetchMatches from '../../../hooks/useFetchMatches';

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
    progress: {
        margin: theme.spacing(2),
      },
    weeksControls:{
      margin: theme.spacing(2),
    }
  }));

const MyHome = () => {
    // const [ matchesList, setMatches ] = useState( null );
    const [ isMounted, setMounted ]   = useState( false );
    const [ currentWeek, setCurrentWeek ] = useState( null );
    const [ isError, setError ]   = useState(null);
    
    const [selectedWeeks , setSelectedWeeks ] = useState( null );
    const [ toggleButtonsVals , setToggleButtonsValue ] = useState( null );
    // const res = useFetchMatches(1);

    // const matchesList = res.response;
    // const isError = res.isError;

    const changeWeek = ( event , newValue) => {
      let selectedWeeks_ = selectedWeeks;
      
      selectedWeeks_.forEach( w => {
        if( newValue === w.weekId ){
          w.isActive = !w.isActive;
        }
      } );
      setSelectedWeeks(selectedWeeks_);
      setToggleButtonsValue( getSelectedWeeks( selectedWeeks_ ) ); 
    }

    const renderAvailableWeeks = (  ) => {
      let weeks = [...Array( currentWeek ).keys( )] 
      weeks =  weeks.map( index => {
         return (
          <ToggleButton 
              key={ index } 
              value={ index+1 }
              aria-label={`semana ${index+1}`}> 
                Semana { index+1 } 
            </ToggleButton>
         )
       } );
       return weeks;
    } 

    const initializeWvailableWeeks = ( fromWeek ) => {
      return new Promise( (res, rej ) => {
        try{
          let weeks = [ ...Array( fromWeek ).keys( ) ].map( w => {
            w = w+1;
            return {
              weekId: w,
              isActive: w === fromWeek,
            }
          } );
          res( { success:true , data: weeks });
        } 
        catch( error ){
          rej( { success: false, error: error })
        }
        
      } );
    }

    const getSelectedWeeks = ( selectedWeeks ) => {
      console.log(selectedWeeks);
      let ws = []; 
      selectedWeeks.forEach( w =>{ 
        if(w.isActive){ 
          ws.push( w.weekId )
        } } );
        console.log('SelectedWeeks',ws);
        return ws
    }
    const classes = useStyles();

      useEffect( () => {
        API.getCurrentWeek()
          .then( response => {
            setCurrentWeek( parseInt( response.data.currentWeek ) );
            initializeWvailableWeeks( parseInt( response.data.currentWeek ) )
              .then( responseInitialization => {
                if( responseInitialization.success ){
                  setSelectedWeeks( responseInitialization.data );
                  setToggleButtonsValue( getSelectedWeeks( responseInitialization.data ) );
                  setMounted( true );
                }
                else {
                  throw 'Error initializing Weeks'
                }
              } )
              .catch( error => {
                console.log( error );
              })
          })
          .catch( error => {
            console.error(error);
            setMounted( true );
            setError({success: false , error:error })
          });
      }, []);

      if( !isMounted  ){
        return (
          <Grid 
            container
            direction="column"
            justify="center"
            alignItems="center">
              <CircularProgress/>
              <Typography>Cargando información de las semanas...</Typography>
            </Grid>
        )  
      }
      if( isError ){
        return (
          <Grid 
          container
          direction="column"
          justify="center"
          alignItems="center">
            <ErrorComponent isError={ isError }/>
          </Grid>
        )
      }

    return (
        <Grid 
            container
            direction="column"
            justify="center"
            alignItems="center">
            <h3>NFL Review Semanal</h3>
              <Grid item>
                  <ToggleButtonGroup
                    className={classes.weeksControls}
                    value={ toggleButtonsVals }
                    exclusive 
                    onChange={ changeWeek  } 
                    size="small" 
                    aria-label="Select the weeks you want to visualize">
                   { renderAvailableWeeks(  ) }
                  </ToggleButtonGroup>
              </Grid>
              <Grid item>
                <ListMatches currentWeek={ currentWeek } selectedWeeks={selectedWeeks}/> 
              </Grid>
        </Grid>
    )
}

export default MyHome;