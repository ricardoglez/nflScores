import React, { useState, useEffect } from 'react';
import { 
    Grid, 
    Card, 
    CardActions, 
    CardHeader, 
    CardContent,
    Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    card: {
      minWidth: 275,
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    points: {
      fontSize: 14,
      fontWeight:'bolder'
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
    const classes = useStyles();

    useEffect( () => {
        let totalPts = totalPoints();

        setTotalPts( totalPts );

        setAvgPts( avgPoints( totalPts ) );
    }, [])

    const totalPoints = () => {
        return Object.keys(matches).reduce( (acc, curr) => {
            return acc + matches[curr].teams.home.score + matches[curr].teams.away.score 
        }, 0 );
    }

    const avgPoints = ( total ) => {
        return total / Object.keys(matches).length;
    }

    const renderMatches = () => {
       return Object.keys( matches ).map( matchKey => {
           let winner = matches[matchKey].teams.home.isWinner ? matches[matchKey].teams.home : matches[matchKey].teams.away;
           let loser = !matches[matchKey].teams.home.isWinner ? matches[matchKey].teams.home : matches[matchKey].teams.away;
           let diff =  winner.score - loser.score;
           console.log( '  ',diff )
           return (
               <Grid container direction='column' >
                   <Typography> { matches[matchKey].teams.home.name } vs { matches[matchKey].teams.away.name } </Typography>
                   <Typography> {winner.name} ganó por { diff} pts </Typography>
               </Grid>
           )
        })
    }

    const avgDiffPoints = ( ) => {

    }

    return ( 
        <Card key={ id } className={ classes.card }>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Semana #{ weekId }
                </Typography>
                <Typography className={classes.points} color="textSecondary" gutterBottom>
                    Puntos totales en la semana: { totalPts }
                </Typography>
                <Typography className={classes.points} color="textSecondary" gutterBottom>
                    Puntos promedio: { avgPts }
                </Typography>
                {renderMatches()}
            </CardContent>
        </Card>        
    )
}

const ListMatches = ({ weeks }) => {
    return ( 
        <React.Fragment >
            { weeks.map( week => <WeeklyMatches key={ week._id} weekId={week.weekId} matches={week.matches} id={ week._id } /> 
            )}
        </React.Fragment>

    )
}

export default ListMatches;