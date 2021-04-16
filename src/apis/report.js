import axios from 'axios';
import authHeader from './auth-header';
import storage from '../utils/storage';
class Report {
    getServiceInfo = () => {
        return axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/report/service_info`, {
            headers: authHeader(storage.getStorage('token')),
        })
        .then(response => {
            if (response.data.code === 401) {
                storage.removeStorage('token');
                storage.removeStorage('role');
                return response.data;
            } else if (response.data.code === 200) {
                return response.data;
            }
        }).catch(error => {
            return error;
        })
    }
		getServiceQuarter = (rehabitation_center) => {
			return axios
			.get(`${process.env.REACT_APP_BACKEND_URL}/report/service_quater`, {
					headers: authHeader(storage.getStorage('token')),
					params: {
						rehabitation_center: rehabitation_center
					}
			})
			.then(response => {
					if (response.data.code === 401) {
							storage.removeStorage('token');
							storage.removeStorage('role');
							return response.data;
					} else if (response.data.code === 200) {
							return response.data;
					}
			}).catch(error => {
					return error;
			})
	}
	getServiceData = (rehabitation_center, participant, quater) => {
		return axios
		.get(`${process.env.REACT_APP_BACKEND_URL}/report/service_data`, {
				headers: authHeader(storage.getStorage('token')),
				params: {
					rehabitation_center: rehabitation_center,
					participant: participant,
					quater: quater
				}
		})
		.then(response => {
				if (response.data.code === 401) {
						storage.removeStorage('token');
						storage.removeStorage('role');
						return response.data;
				} else if (response.data.code === 200) {
						return response.data;
				}
		}).catch(error => {
				return error;
		})
}
}
export default new Report();