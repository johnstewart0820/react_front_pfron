import React from "react";
import { withRouter } from "react-router";
import auth from './apis/auth';
import constants from './utils/constants';

// A simple component that shows the pathname of the current location
class AppContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {flag: false};
  }

  componentDidMount() {
    // this.setState({flag: false});
    for (let i = 0; i < constants.unauthenticated_url.length; i ++) {
      if (constants.unauthenticated_url[i] === this.props.location.pathname) {
          this.setState({flag: true});
          return;
      }
    }
    auth
    .validateToken()
    .then(response => {
      if (response.code !== 401) {
        if (this.props.location.pathname !== '/content_management') {
          this.setState({flag: true}) 
        } else {
          if (response.role === '1') {
            this.setState({flag: true}) 
          } else {
            this.setState({flag: false})
            this.props.history.push('/login');            
          }
        }
      }
      else {
        this.setState({flag: false})
        this.props.history.push('/login');
      }
    })
  }
	componentDidUpdate(prevProps) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
      // this.setState({flag: false});
      for (let i = 0; i < constants.unauthenticated_url.length; i ++) {
        if (constants.unauthenticated_url[i] === this.props.location.pathname) {
            this.setState({flag: true});
            return;
        }
      }
      for (let i = 0; i < constants.unauthenticated_url.length; i ++) {
        if (constants.unauthenticated_url[i] === prevProps.location.pathname) {
            this.setState({flag: false});
        }
      }
      auth
      .validateToken()
      .then(response => {
        if (response.code !== 401) {
          if (this.props.location.pathname !== '/content_management') {
            this.setState({flag: true}) 
          } else {
            if (response.role === '1') {
              this.setState({flag: true}) 
            } else {
              this.setState({flag: false})
              this.props.history.push('/login');            
            }
          }
        }
        else {
          this.setState({flag: false})
          this.props.history.push('/login');
        }
      })
		}
	}
	render() {

		return this.state.flag ? <>{this.props.children}</> : <></>;
	}
}

// Create a new component that is "connected" (to borrow redux
// terminology) to the router.
export default AppContainer = withRouter(AppContainer);