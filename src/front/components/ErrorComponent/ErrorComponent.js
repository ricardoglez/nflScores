import React from 'react';
import {Paper} from '@material-ui/core';
const ErrorComponent = ( { isError , error } ) => {
    if( !isError ){ return null}

    return(
    <Paper>
        Error:{ error }
    </Paper>
    )
};


export default ErrorComponent;