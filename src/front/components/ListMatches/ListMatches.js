import React, { useState, useEffect } from 'react';
import { 
    Grid, 
    Card, 
    CardActions, 
    CardHeader, 
    CardContent,
    Typography,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
} from '@material-ui/core';
import ExpandMoreIcon  from '@material-ui/icons/ExpandMore'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    card: {
      minWidth: 275,
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
    pos: {
      marginBottom: 12,
    },
  });

const WeeklyMatches = ( {weekId, matches , id } ) => {
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
        let list=  Object.keys( matches ).map( matchKey => {
           let winner = matches[matchKey].teams.home.isWinner ? matches[matchKey].teams.home : matches[matchKey].teams.away;
           let winnerType = matches[matchKey].teams.home.isWinner ? 'home' : 'away';
           let loser = !matches[matchKey].teams.home.isWinner ? matches[matchKey].teams.home : matches[matchKey].teams.away;
           let diff =  winner.score - loser.score;
           obj[matchKey] = { diff: diff, winner: winner, winnerType:  winnerType } 
           return (
               <Grid item xs={12} >
                   <Typography> { matches[matchKey].teams.home.name } vs { matches[matchKey].teams.away.name } </Typography>
                   <Typography> {winner.name} ganó por</Typography>
                   <Typography className={classes.importantNumber}> { diff } pts </Typography>
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
        <Card key={ id } className={ classes.card }>
            <CardHeader title={`Semana #${ weekId }`}>
            </CardHeader>
            <CardContent>
                <Typography  color="textSecondary" gutterBottom>
                    Puntos totales en la semana: <Typography className={classes.points}> { totalPts } </Typography>
                </Typography>
                <Typography  color="textSecondary" gutterBottom>
                    Puntos promedio: <Typography className={classes.points}>{ avgPts }</Typography> 
                </Typography>
                <Typography  color="textSecondary" gutterBottom>
                    Puntos de diferencia promedio: <Typography className={classes.points}>{ avgPointsMatch( matchesDiff ) }</Typography> 
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
                    <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                        <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                        >
                        <Typography className={classes.heading}>Resultados por partido</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Grid container direction='column'>
                                { renderMatches()}
                            </Grid>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Grid>
               
            </CardContent>
        </Card>        
    )
}

const ListMatches = ({ weeks }) => {
    return ( 
        <Grid container direction={'row'} alignItems='center' spacing={3}>
            { weeks.map( week => (
                <Grid item xs={6}>
                    <WeeklyMatches key={ week._id} weekId={week.weekId} matches={week.matches} id={ week._id } /> 
                </Grid>
            )
            )}
        </Grid>

    )
}

export default ListMatches;