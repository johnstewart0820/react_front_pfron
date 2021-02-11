import axios from 'axios';
import authHeader from './auth-header';
import storage from '../utils/storage';
class OrkTeam {
    getInfo = () => {
        return axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/ork-team/info`, {
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
    get = (id) => {
        return axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/ork-team`, {
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
    create = (name, rehabitation_center, specialization, is_accepted, date_of_acceptance) => {
        return axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/ork-team`, {
            name: name,
            rehabitation_center: rehabitation_center,
            specialization: specialization,
            is_accepted: is_accepted,
            date_of_acceptance: date_of_acceptance
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
    
    getListByOption = (sort_column, sort_order, count, page, searchId, searchName, searchRehabitationCenter, searchSpecialization) => {
        return axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/ork-team/getListByOption`, {
            sort_column: sort_column,
            sort_order: sort_order,
            count: count,
            page: page,
            searchId: searchId,
            searchName: searchName,
            searchRehabitationCenter: searchRehabitationCenter,
            searchSpecialization: searchSpecialization
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

    update = (name, rehabitation_center, specialization, is_accepted, date_of_acceptance, id) => {
        return axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/ork-team`, {
            name: name,
            rehabitation_center: rehabitation_center,
            specialization: specialization,
            is_accepted: is_accepted,
            date_of_acceptance: date_of_acceptance,
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
        .delete(`${process.env.REACT_APP_BACKEND_URL}/ork-team`, {
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
export default new OrkTeam();