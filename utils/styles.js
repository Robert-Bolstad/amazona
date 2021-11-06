import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  navBar: {
    backgroundColor: '#203040',
    ' & a': {
      color: '#ffffff',
      marginLeft: 10,
    },
  },
  main: {
    minHeight: '80vh',
  },
  footer: {
    marginTop: '10px',
    textAlign: 'center',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  grow: {
    flexGrow: 1,
  },
  section: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  cursor: {
    cursor: 'pointer',
  },
});

export default useStyles;
