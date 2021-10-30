import React, { useState, useEffect } from 'react';
import { 
    Grid, 
    Card, 
    CardActions, 
    CardHeader, 
    CardContent,
    Typography,
    Paper,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    CircularProgress,
} from '@material-ui/core';
import ExpandMoreIcon  from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles';
import { fetchMatches } from '../../../API';
import useFetchMatches from '../../../hooks/useFetchMatches';

const useStyles = makeStyles( theme => ({
    paper:{
        background:'rgba(20,20,20,.4)',
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        color: '#ffff'
    },
    card: {
      minWidth: 100,
    },
    importantNumber: {
        fontSize:'1.5em',
        fontWeight: 'bolder',
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      textTransform:'uppercase',
      fontSize: '2em',
    },
    points: {
      fontSize: '1.5em',
      fontWeight:'bolder',
    },
    weekContainer:{
      textAlign: 'center',
      margin: theme.spacing(1),          
    },
    pos: {
      marginBottom: 12,
    },
  }));

const WeeklyMatches = ( {weekId, matches  } ) => {
    let [ totalPts, setTotalPts ] = useState(0);
    let [ avgPts, setAvgPts ] = useState(0);
    let [ avgDiffPts, setAvgDiffPts ] = useState(0);
    let [ matchesDiff, setMatchesDiff ] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const classes = useStyles();


    const handleChange = panel => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
      };

    useEffect( () => {
        let totalPts = totalPoints();

        setTotalPts( totalPts );

        setAvgPts( avgPoints( totalPts ) );

        setMatchesDiff( initializeMatchesPonitsDiff( ) );

        
        
    }, [])

    const totalPoints = () => {
        return Object.keys(matches).reduce( (acc, curr) => {
            return acc + matches[curr].teams.home.score + matches[curr].teams.away.score 
        }, 0 );
    }

    const avgPoints = ( total ) => {
        return Math.ceil(total / Object.keys(matches).length);
    }

    const renderMatches = () => {
        let obj= {}
        console.log(matches);
        let list=  Object.keys( matches ).map( matchKey => {
           let winner = matches[matchKey].teams.home.isWinner ? matches[matchKey].teams.home : matches[matchKey].teams.away;
           let winnerType = matches[matchKey].teams.home.isWinner ? 'home' : 'away';
           let loser = !matches[matchKey].teams.home.isWinner ? matches[matchKey].teams.home : matches[matchKey].teams.away;
           let diff =  winner.score - loser.score;
           obj[matchKey] = { diff: diff, winner: winner, winnerType:  winnerType } 
           return (
               <Grid item xs={12} key={ matchKey }>
                   <Typography color="textSecondary"> { matches[matchKey].teams.home.name } vs { matches[matchKey].teams.away.name } </Typography>
                   <Typography color="textSecondary"> <strong>{winner.name}</strong> ganó por</Typography>
                   <Typography color="textSecondary" className={classes.importantNumber}> { diff } pts </Typography>
               </Grid>
           )
        });
        return list
    }

    const initializeMatchesPonitsDiff = ( ) => {
        let obj= {}
        Object.keys( matches ).forEach( matchKey => {
           let winner = matches[matchKey].teams.home.isWinner ? matches[matchKey].teams.home : matches[matchKey].teams.away;
           let winnerType = matches[matchKey].teams.home.isWinner ? 'home' : 'away';
           let loser = !matches[matchKey].teams.home.isWinner ? matches[matchKey].teams.home : matches[matchKey].teams.away;
           let diff =  winner.score - loser.score;
           obj[matchKey] = { diff: diff, winner: winner, winnerType:  winnerType } 
        });
        return obj
    }

    const avgPointsMatch = ( diffMatches ) => {
        let difK =  Object.keys( diffMatches );
        let totalDiff = difK.reduce( (acc, k) => acc + diffMatches[k].diff , 0)
        return Math.ceil(totalDiff /difK.length);
    }

    const typeWinnerCounter = ( diffMatches ) => {
        let difK =  Object.keys( diffMatches );
        let totalW = difK.reduce( (acc, k) => {
            if(diffMatches[k].winnerType == 'home'){
                acc.homeWins +=1;
                return acc
            }
            else {
                acc.awayWins +=1;
                return acc
            }
        } , {homeWins: 0, awayWins: 0} );
        return totalW
    }
    let winnerCounter = typeWinnerCounter( matchesDiff );
    return ( 
        <Card key={ weekId } className={ classes.card }>
            <CardHeader title={`Semana #${ weekId }`}>
            </CardHeader>
            <CardContent>
                <Typography  color="textSecondary" gutterBottom>
                    Puntos totales en la semana: <strong className={classes.points}> { isNaN(totalPts) ? '-': totalPts } </strong>
                </Typography>
                <Typography  color="textSecondary" gutterBottom>
                    Puntos promedio: <strong className={classes.points}>{ isNaN( avgPts ) ? '-': avgPts }</strong> 
                </Typography>
                <Typography  color="textSecondary" gutterBottom>
                    Puntos de diferencia promedio: <strong className={classes.points}>{ isNaN( avgPointsMatch( matchesDiff ) ) ? '-': avgPointsMatch( matchesDiff ) }</strong> 
                </Typography>
                <Grid container direction={'row'}>
                    <Grid item xs={6}>
                        <Typography >Ganados Local</Typography>
                        <Typography className={classes.points}>{ winnerCounter.homeWins}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography >Ganados Visita</Typography>
                        <Typography className={classes.points}>{ winnerCounter.awayWins}</Typography>
                    </Grid>
                </Grid>
                <Grid container direction='row'>
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        >
                        <Typography className={classes.heading}>Resultados por partido</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container direction='column'>
                                { renderMatches()}
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                </Grid>
            </CardContent>
        </Card>        
    )
}

const WeekInfo = ({ week }) => {
    let [ weekInfo , setWeekInfo ] = useState( null);
    let [ isLoading, setLoading ] = useState( false );
    let [ isMounted, setMounted ] = useState( false );
    let [isError, setError] = useState( false );

       
    useEffect(  () => {
        setLoading(true);
        fetchMatches( week.weekId )
        .then( response => {
            console.log(response);
            // let sortedData = response.data.sort( 
            //     firstBy( 'weekId' )
            // );
            setWeekInfo( response.data );
            setLoading(false);
            setMounted( true );
        }).catch(err => {
            console.error(err);
            setMounted( true );
            setError( { error: true , message: err } )
        });
    }, []);

    const classes = useStyles();

    console.log('Week ', week.weekId ,' response:',weekInfo);


    if( isLoading || !isMounted ){
        return (
        <Grid item xs={12} className={classes.weekContainer}>
            <CircularProgress/>
            <Typography>Cargando S#{week.weekId}</Typography>
        </Grid>
        )
    }
    else {
        return (
            <Grid item className={classes.weekContainer}>
                <Paper className={ classes.paper }>
                    <WeeklyMatches weekId={week.weekId} matches={weekInfo.matches}  />
                </Paper>
            </Grid>
            )
    }

}

const SelectedWeeks = ({ selectedWeeks }) => {
    if( !selectedWeeks ){ 
        return <Typography>Selecciona una semana</Typography>
    } 
    let activeWeeks = selectedWeeks.filter( w => w.isActive );

     return activeWeeks.map( w => (
            <Grid key={w.weekId} item > 
                <WeekInfo week={ w }/> 
            </Grid>
            ) 
        );

}

const ListMatches = ({ selectedWeeks, currentWeek }) => {

    const classes = useStyles();
    return ( 
        <Grid container direction={'row'} alignItems='center' spacing={2} >
            <SelectedWeeks selectedWeeks={ selectedWeeks }/>
                { /*
                    weeks.map( week => (
                    <Grid item xs={6} key={ week._id} >
                        <WeeklyMatches  weekId={week.weekId} matches={week.matches} id={ week._id } /> 
                    </Grid>
                    ))
                    */}
        </Grid>
    )
}

export default ListMatches;