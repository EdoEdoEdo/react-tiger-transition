import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  grey,
  blueGrey
} from '@material-ui/core/colors';
import { Screen, Link } from 'react-tiger-transition';
import { Button } from '../../components'
import { DemoContext } from './context';

const colors = [
  lime,
  red,
  blue,
  purple,
  deepOrange,
  grey,
  indigo,
  pink,
  brown,
  cyan,
  lightBlue,
  green,
  deepPurple,
  yellow,
  orange,
  amber,
  teal,
  blueGrey,
  lightGreen,
];

const useStyles = makeStyles({
  screen: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: props => colors[props.color][500]
  },
  paper: {
    display: 'inherit',
    justifyContent: 'inherit',
    alignItems: 'inherit',
    flexDirection: 'inherit',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 40,
    paddingRight: 40,
  },
  button: {
    margin: 8,
    minWidth: 200,
  },
});

const getOpositeDirection = direction => (
  direction === 'left' ? 'right' :
  direction === 'top' ? 'bottom' :
  direction === 'bottom' ? 'top' :
  'left'
);

const changeAxis = direction => (
  direction === 'left' || direction === 'right' ? 'top' : 'left'
);


const DemoNext = ({
  a,
  b,
  location,
  match,
  ...other
}) => {

  const {
    tiger,
    args,
    timeout,
    updateTiger,
    tigers,
  } = useContext(DemoContext);

  const [demoTiger, setDemoTiger] = useState(tiger);

  const { state } = location;

  const [localState, setLocalState] = useState(
    state && state.loop
    ? state
    : {loop: 0}
  );

  const [to, setTo] = useState({
    pathname: `/demo/${tiger.name}/${a ? 'b' : 'a'}`,
    state: {
      loop: localState.loop + 1 < 19 // colors length
      ? localState.loop + 1
      : 0,
    }
  })

  useEffect(() => {
    if (match && match.params.tiger !== tiger.name){
      const paramTiger = tigers.filter(t => t.name === match.params.tiger);
      if (paramTiger.length === 1){
        updateTiger(match.params.tiger);
        setDemoTiger(paramTiger[0]);
        setTo({
          ...to,
          pathname: `/demo/${paramTiger[0].name}/${a ? 'b' : 'a'}`
        })
      }
      else {
        history.push('/demo/glide')
      }
    };
  }, []);

  const classes = useStyles({color: to.state.loop});

  const hasDirection = demoTiger.args.direction !== undefined;

  const tigerIndex = tigers.findIndex((element, index, array) => (
    array[index] === demoTiger
  ));

  const tigersLen = tigers.length - 1;
  const nextTiger = tigerIndex + 1 > tigersLen ? 0 : tigerIndex + 1;
  const previousTiger = tigerIndex - 1 < 0 ? tigersLen : tigerIndex - 1;

  return (
    <Screen className={classes.screen}>

      <Paper className={classes.paper}>

        {!hasDirection ?

          <Button
            className={classes.button}
            variant='contained'
            color='primary'
            component={Link}
            to={to}
            transition={`${demoTiger.name}-demo`}
            timeout={timeout}
          >
            Continue
          </Button>

          :

          <React.Fragment>
            {['left', 'right', 'top', 'bottom'].map(direction => (
              <Button
                key={direction}
                className={classes.button}
                variant='contained'
                color='primary'
                component={Link}
                to={to}
                onClick={() => demoTiger.func({
                  name: `${demoTiger.name}-demo`,
                  ...args,
                  direction: direction
                })}
                transition={`${demoTiger.name}-demo`}
                timeout={timeout}
              >
                {direction}
              </Button>
            ))}
          </React.Fragment>
        }

        <Button
          className={classes.button}
          variant='outlined'
          color='primary'
          component={Link}
          to={{
            ...to,
            pathname: `/demo/${tigers[nextTiger].name}/${a ? 'b' : 'a'}`
          }}
          transition={`${tigers[nextTiger].name}-demo`}
          timeout={timeout}
          onClick={() => {
            updateTiger(tigers[nextTiger].name)
          }}
        >
          Next transition
        </Button>

        <Button
          className={classes.button}
          variant='outlined'
          component={Link}
          color='primary'
          to={{
            ...to,
            pathname: `/demo/${tigers[previousTiger].name}/${a ? 'b' : 'a'}`
          }}
          transition={`${tigers[previousTiger].name}-demo`}
          timeout={timeout}
          onClick={() => {
            updateTiger(tigers[previousTiger].name)
          }}
        >
          Previous transition
        </Button>

        <Button
          className={classes.button}
          variant='outlined'
          color='primary'
          component={Link}
          to={`/demo/${tiger.name}`}
          transition={`${tiger.name}-demo`}
          timeout={timeout}
        >
          Back to settings
        </Button>
      </Paper>

    </Screen>
  )
}


export default withRouter(DemoNext);
