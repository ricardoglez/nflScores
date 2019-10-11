import React, { useEffect, useState } from 'react';
import API from '../../../API';
import ErrorComponent from '../ErrorComponent';
import ListMatches from '../ListMatches';
import { Grid, CircularProgress } from '@material-ui/core';
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
  }));

const MyHome = () => {
    // const [ matchesList, setMatches ] = useState( null );
    const [ isMounted, setMounted ]   = useState(false);
    const [currentWeek, setCurrentWeek ] = useState( 1 );
    // const [ isError, setError ]   = useState(false);
    
    const res = useFetchMatches(1);

    const matchesList = res.response;
    const isError = res.isError;

    const classes = useStyles();

      useEffect( () => {
        API.getCurrentWeek()
          .then( response => {
            setCurrentWeek(response.data);
          })
          .catch( error => {
            console.error(error)
          });
      }, []);

    return (
        <Grid 
            container
            direction="column"
            justify="center"
            alignItems="center">
            <h3>NFL Review Semanal</h3>
            {
                !res.response || res.isLoading
                ?
                <CircularProgress className={ classes.progress }/>
                :
                <ListMatches weeks={matchesList}/>
             }
             <ErrorComponent isError={isError }/>
        </Grid>
    )
}

export default MyHome;