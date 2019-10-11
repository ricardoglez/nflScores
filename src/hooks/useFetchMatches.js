import React ,{ useEffect, useState } from 'react';
import API from '../API';
import firstBy from 'thenby';


const useFetchMatches = ( week ) => {
    // console.log( 'Fetch Matches from this week with custom hook', week );
    let [response, setResponse ] = useState(null);
    let [isError , setError] = useState(null);
    let [isLoading , setLoading] = useState(null);
    week = !week | week > 17 ? 1 : week; 
    
    useEffect(  () => {
        setLoading(true);
        API.fetchMatches( week )
        .then( response => {
            let sortedData = response.data.sort( 
                firstBy( 'weekId' )
            );
            setResponse( sortedData );
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setError( { error: true , message: err } )
        });
    }, []);

    return {response , isError, isLoading}
}

export default useFetchMatches;