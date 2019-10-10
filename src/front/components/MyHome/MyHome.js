import React, { useEffect, useState } from 'react';
import API from '../../../API';
import ListMatches from '../ListMatches';
import { Grid, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import firstBy from 'thenby';

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
    const [ spacing, setSpacing ]     = useState(2);
    const [ matchesList, setMatches ] = useState(null);
    const [ isMounted, setMounted ]   = useState(false);

    const classes = useStyles();

    useEffect( () => {
        API.fetchMatches(  )
        .then( response => {
            console.log(response.data)
            let sortedData = response.data.sort( 
                firstBy( 'weekId' )
            );
            
            setMatches( sortedData );

            setMounted(true)
        }) 
    }, [])

    return (
        <Grid 
            container
            direction="column"
            justify="center"
            alignItems="center">
         {
             isMounted
             ?
             <ListMatches weeks={matchesList}/>
             :
             <CircularProgress className={ classes.progress }/>
         }
        </Grid>
    )
}

export default MyHome;