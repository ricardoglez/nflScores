import { AppProps } from 'next/app';
import React from 'react';

const Index = (props: AppProps) =>  {
  console.log(props);
  return ( <h1> rendering Index </h1> );
};

export default Index;