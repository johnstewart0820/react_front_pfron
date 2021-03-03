import axios from 'axios';
import authHeader from './auth-header';
import storage from '../utils/storage';
class Ipr {
    getInfo = () => {
        return axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/ipr/info`, {
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

	getOrkPerson = (id) => {
        return axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/ipr/ork_person`, {
            headers: authHeader(storage.getStorage('token')),
			params: {
				id: id
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

    get = (id) => {
        return axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/ipr`, {
            headers: authHeader(storage.getStorage('token')),
            params: {
                id: id
            },
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
    create = (id_candidate, ipr_type, number, schedule_date, ork_person, profession) => {
        return axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/ipr`, {
            id_candidate: id_candidate,
            ipr_type: ipr_type,
            number: number,
			schedule_date: schedule_date,
			ork_person: ork_person,
			profession: profession,
        }, {
            headers: authHeader(storage.getStorage('token'))
        }).then(response => {
            if (response.data.code === 401)
                storage.removeStorage('token');
            return response.data;
        }).catch(error => {
            return error;
        })
    }
    
    getListByOption = (sort_column, sort_order, count, page, searchId, searchName, searchIprType, searchNumber, searchCreatedAt, searchScheduleDate) => {
        return axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/ipr/getListByOption`, {
            sort_column: sort_column,
            sort_order: sort_order,
            count: count,
            page: page,
            searchId: searchId,
            searchName: searchName,
            searchIprType: searchIprType,
            searchNumber: searchNumber,
			searchCreatedAt: searchCreatedAt,
			searchScheduleDate: searchScheduleDate
        }, {
            headers: authHeader(storage.getStorage('token'))
        })
        .then(response => {
            if (response.data.code === 401)
                storage.removeStorage('token');
            return response.data;
        }).catch(error => {
            return error;
        })
    }

    update = (id_candidate, ipr_type, number, schedule_date, ork_person, profession, id) => {
        return axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/ipr`, {
            id_candidate: id_candidate,
            ipr_type: ipr_type,
            number: number,
			schedule_date: schedule_date,
			ork_person: ork_person,
			profession: profession,
            id: id
        }, {
            headers: authHeader(storage.getStorage('token'))
        })
        .then(response => {
            if (response.data.code === 401)
                storage.removeStorage('token');
            return response.data;
        }).catch(error => {
            return error;
        })
    }

    delete = (id) => {
        return axios
        .delete(`${process.env.REACT_APP_BACKEND_URL}/ipr`, {
            headers: authHeader(storage.getStorage('token')),
            params: {
                id: id
            }, 
        })
        .then(response => {
            if (response.data.code === 401)
                storage.removeStorage('token');
            return response.data;
        }).catch(error => {
            return error;
        })
    }
}
export default new Ipr();