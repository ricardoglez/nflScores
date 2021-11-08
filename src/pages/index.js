import MyHome from '../front/components/MyHome';

export async function getStaticProps(context) {
  console.log('Getstatic props', context)
  return {
    props: {details:[ 0,1,2] }, // will be passed to the page component as props
  }
}

export default MyHome;


