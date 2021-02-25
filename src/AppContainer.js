import React from "react";
import { withRouter } from "react-router";
import auth from './apis/auth';
import constants from './utils/constants';

class AppContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = { role: 0 };
	}

	checkValidity() {
		if (constants.unauthenticated_url.indexOf(this.props.location.pathname) !== -1) {
			this.setState({ role: 1 });
		} else {
			auth
				.validateToken()
				.then(response => {
					if (response.code !== 401) {
						let roleList = response.role.split(',');
						let count = 0;
						roleList.map((item, index) => {
							constants.authenticated_url[item - 1].map((item, index) => {
								if (item.endsWith('*')) {
									let arr = this.props.location.pathname.split('/');
									arr.pop();
									let str = arr.join('/');
									if (str === item.split('/*')[0])
										count ++;
								}
								if (this.props.location.pathname === item) {
									count ++;
								}
							})
						})
						
						if (count != 0)
							this.setState({ role: response.role });
						else {
							this.setState({ role: 0});
							this.props.history.push('/login');
						}
					}
					else {
						this.setState({ role: 0 })
						this.props.history.push('/login');
					}
				})
		}
	}

	componentDidMount() {
		this.checkValidity();
	}
	componentDidUpdate(prevProps) {
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.checkValidity();
		}
	}
	render() {
		return this.state.role !== 0 ? <>{React.cloneElement(this.props.children, { role: this.state.role })}</> : <></>;
	}
}

export default AppContainer = withRouter(AppContainer);