import React from "react";
import { withRouter } from "react-router";
import auth from './apis/auth';
import constants from './utils/constants';

// A simple component that shows the pathname of the current location
class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {role: 0};
  }

  componentDidMount() {
    // this.setState({flag: false});
    for (let i = 0; i < constants.unauthenticated_url.length; i ++) {
      if (constants.unauthenticated_url[i] === this.props.location.pathname) {
          this.setState({role: 1});
          return;
      }
    }
    auth
    .validateToken()
    .then(response => {
      if (response.code !== 401) {
        this.setState({role: response.role}) 
      }
      else {
        this.setState({role: 0})
        this.props.history.push('/login');
      }
    })
  }
	componentDidUpdate(prevProps) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
      // this.setState({flag: false});
      for (let i = 0; i < constants.unauthenticated_url.length; i ++) {
        if (constants.unauthenticated_url[i] === this.props.location.pathname) {
            this.setState({role: 1});
            return;
        }
      }
      for (let i = 0; i < constants.unauthenticated_url.length; i ++) {
        if (constants.unauthenticated_url[i] === prevProps.location.pathname) {
            this.setState({role: 0});
        }
      }
      auth
      .validateToken()
      .then(response => {
        if (response.code !== 401) {
          this.setState({role: response.role}) 
        }
        else {
          this.setState({role: 0})
          this.props.history.push('/login');
        }
      })
		}
	}
	render() {
		return this.state.role !== 0 ? <>{React.cloneElement(this.props.children, {role: this.state.role})}</> : <></>;
	}
}

// Create a new component that is "connected" (to borrow redux
// terminology) to the router.
export default AppContainer = withRouter(AppContainer);