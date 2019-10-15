import React from 'react';
import {Paper, Typography, Button } from '@material-ui/core';
const ErrorComponent = ( { isError , error } ) => {
    if( !isError || isError.success ){ return null}
    return(
    <Paper>
        <Typography>
            Error: 
        </Typography>
        <Typography>
            Algo se rompió
        </Typography>
        <div>
            <Button onClick={() => { window.location.reload() }}> Intentar nuevamente </Button>
        </div>
    </Paper>
    )
};


export default ErrorComponent;