import ReactDOM from 'react-dom';
import React from 'react';
import MyHome from './components/MyHome';

const MyApp = (props) => {

    console.log('props', props)
    return ( <MyHome />
    )
}

let myAppWrapper = document.getElementById('app');


ReactDOM.render( < MyApp / > , myAppWrapper)