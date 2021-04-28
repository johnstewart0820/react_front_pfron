import React from "react";
import { withRouter } from "react-router";
import auth from './apis/auth';
import constants from './utils/constants';
import SkipLinks from 'skip-links'

class AppContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = { role: 0 };
		this.login_links = [
			{title: 'Przejdź do logowania', to: 'email' },
		];
		this.links = [
			{title: 'Przejdź do treści', to: 'main'},
		];
	}

	keydownHandler(e){
    if (e.keyCode===36 && e.ctrlKey)
		{
			let dom = document.getElementsByClassName('c-links__item')[0];
			dom.focus();
		}
  };

  componentWillUnmount(){
    document.removeEventListener('keydown',this.keydownHandler);
  };

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
		
		document.addEventListener('keydown',this.keydownHandler);
	}

	componentDidUpdate(prevProps) {
		let dom = document.getElementsByClassName('c-links')[0];
		let child = document.getElementsByClassName('u-vs-hidden');
		if (child.length > 0)
		dom.removeChild(child[0]);
		let link_title = document.getElementsByClassName('c-links__item');
		if (link_title.length > 0)
			link_title[0].setAttribute('aria-label', 
				this.props.location.pathname === '/login' || this.props.location.pathname === '/forgotpassword' ? this.login_links[0].title : this.links[0].title);
		if (this.props.location.pathname !== prevProps.location.pathname) {
			this.checkValidity();
		}
	}
	render() {
		return this.state.role !== 0 ? 
		<>
			<SkipLinks id="skip-link" links={this.props.location.pathname === '/login' || this.props.location.pathname === '/forgotpassword' ? this.login_links : this.links}/>{React.cloneElement(this.props.children, { role: this.state.role })}
		</> 
		: <></>;
	}
}

export default AppContainer = withRouter(AppContainer);