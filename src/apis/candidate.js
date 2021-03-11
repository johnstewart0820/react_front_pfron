import axios from 'axios';
import authHeader from './auth-header';
import storage from '../utils/storage';
class Candidate {
    getInfo = () => {
        return axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/candidate/info`, {
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
		getHistoryInfo = () => {
			return axios
			.get(`${process.env.REACT_APP_BACKEND_URL}/candidate/history_info`, {
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
        .get(`${process.env.REACT_APP_BACKEND_URL}/candidate`, {
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

    getCandidateInfo = (id) => {
        return axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/candidate/candidate_info`, {
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
    

    getMarker = (qualification_point) => {
        return axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/candidate/get_marker`, {
            headers: authHeader(storage.getStorage('token')),
            params: {
                qualification_point: qualification_point
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

    updateCandidateInfo = (stage, comment, qualification_point, gender, doctor, psycology, admission, doctor_recommendation,
    doctor_date, doctor_remark, psycology_recommendation, psycology_date, psycology_remark, decision_central_commision, date_central_commision, general_remark, date_referal,
    rehabitation_center, participant_number, date_rehabitation_center, type_to_stay, participant_remark, id) => {
        return axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/candidate/candidate_info`, {
            stage: stage,
            comment: comment,
            qualification_point: qualification_point,
            gender: gender,
            doctor: doctor,
            psycology: psycology,
            admission: admission,
            doctor_recommendation: doctor_recommendation,
            doctor_date: doctor_date,
            doctor_remark: doctor_remark,
            psycology_recommendation: psycology_recommendation,
            psycology_date: psycology_date,
            psycology_remark: psycology_remark,
            decision_central_commision: decision_central_commision,
            date_central_commision: date_central_commision,
            general_remark: general_remark,
            date_referal: date_referal,
            rehabitation_center: rehabitation_center,
            participant_number: participant_number,
            date_rehabitation_center: date_rehabitation_center,
            type_to_stay: type_to_stay,
            participant_remark: participant_remark,
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

	updateCandidateStep1 = (stage, status, comment, qualification_point, gender, id) => {
		return axios
		.put(`${process.env.REACT_APP_BACKEND_URL}/candidate/step1`, {
			stage: stage,
			status: status,
			comment: comment,
			qualification_point: qualification_point,
			gender: gender,
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

	updateCandidateStep2 = (stage, status, comment, doctor, psycology, admission, doctor_recommendation,
		doctor_date, doctor_remark, psycology_recommendation, psycology_date, psycology_remark, id) => {
		return axios
		.put(`${process.env.REACT_APP_BACKEND_URL}/candidate/step2`, {
			stage: stage,
			status: status,
			comment: comment,
			doctor: doctor,
			psycology: psycology,
			admission: admission,
			doctor_recommendation: doctor_recommendation,
			doctor_date: doctor_date,
			doctor_remark: doctor_remark,
			psycology_recommendation: psycology_recommendation,
			psycology_date: psycology_date,
			psycology_remark: psycology_remark,
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

	updateCandidateStep3 = (stage, status, comment, decision_central_commision, date_central_commision, general_remark, id) => {
		return axios
		.put(`${process.env.REACT_APP_BACKEND_URL}/candidate/step3`, {
			stage: stage,
			status: status,
			comment: comment,
			decision_central_commision: decision_central_commision,
			date_central_commision: date_central_commision,
			general_remark: general_remark,
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

	updateCandidateStep4 = (comment, is_participant, date_referal,
		rehabitation_center, participant_number, date_rehabitation_center, type_to_stay, participant_remark, id) => {
		return axios
		.put(`${process.env.REACT_APP_BACKEND_URL}/candidate/step4`, {
			comment: comment,
			is_participant: is_participant,
			date_referal: date_referal,
			rehabitation_center: rehabitation_center,
			participant_number: participant_number,
			date_rehabitation_center: date_rehabitation_center,
			type_to_stay: type_to_stay,
			participant_remark: participant_remark,
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

    create = (name, surname, person_id, date_of_birth, place_of_birth, street, house_number, apartment_number, post_code, post_office, city, 
        second_street, second_house_number, second_apartment_number, second_post_code, second_post_office, second_city,
        voivodeship, community, county, mobile_phone, home_phone, email, family_home_phone, family_mobile_phone,
        education, academic_title, stay_status, children_applicable, children_amount, children_age,
        employed_status, employed_type, employed_in, occupation, unemployed_status,
        have_unemployed_person_status, unemployed_person_id, long_term_employed_status, seek_work_status,
        passive_person_status, full_time_status, evening_student_status, disabled_person_status,
        number_certificate, date_of_certificate, level_certificate, code_certificate, necessary_certificate,
        ethnic_minority_status, homeless_person_status, stay_house_status, house_hold_status, house_hold_adult_status, uncomfortable_status,
        stage, id_status, comment) => {
        return axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/candidate`, {
            name: name,
            surname: surname,
            person_id: person_id,
            date_of_birth: date_of_birth,
            place_of_birth: place_of_birth,
            street: street,
            house_number: house_number,
            apartment_number: apartment_number,
            post_code: post_code,
            post_office: post_office,
            city: city,
            second_street: second_street,
            second_house_number: second_house_number,
            second_apartment_number: second_apartment_number,
            second_post_code: second_post_code,
            second_post_office: second_post_office,
            second_city: second_city,
            voivodeship: voivodeship,
            community: community,
            county: county,
            mobile_phone: mobile_phone,
            home_phone: home_phone,
            email: email,
            family_home_phone: family_home_phone,
            family_mobile_phone: family_mobile_phone,
            education: education,
            academic_title: academic_title,
            stay_status: stay_status,
            children_applicable: children_applicable,
            children_amount: children_amount,
            children_age: children_age,
            employed_status: employed_status,
            employed_type: employed_type,
            employed_in: employed_in,
            occupation: occupation,
            unemployed_status: unemployed_status,
            have_unemployed_person_status: have_unemployed_person_status,
            unemployed_person_id: unemployed_person_id,
            long_term_employed_status: long_term_employed_status,
            seek_work_status: seek_work_status,
            passive_person_status: passive_person_status,
            full_time_status: full_time_status,
            evening_student_status: evening_student_status,
            disabled_person_status: disabled_person_status,
            number_certificate: number_certificate,
            date_of_certificate: date_of_certificate,
            level_certificate: level_certificate,
            code_certificate: code_certificate,
            necessary_certificate: necessary_certificate,
            ethnic_minority_status: ethnic_minority_status,
            homeless_person_status: homeless_person_status,
            stay_house_status: stay_house_status,
            house_hold_status: house_hold_status,
            house_hold_adult_status: house_hold_adult_status,
            uncomfortable_status: uncomfortable_status,
            stage: stage,
			id_status: id_status,
            comment: comment
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
    
    getListByOption = (sort_column, sort_order, count, page, searchId, searchName, searchSurname, searchQualificationPoint, searchStage, searchStatus,searchDateModified) => {
        return axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/candidate/getListByOption`, {
            sort_column: sort_column,
            sort_order: sort_order,
            count: count,
            page: page,
            searchId: searchId,
            searchName: searchName,
            searchSurname: searchSurname,
            searchQualificationPoint: searchQualificationPoint,
            searchStage: searchStage,
						searchStatus: searchStatus,
            searchDateModified: searchDateModified
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

		getHistoryListByOption = (id, sort_column, sort_order, count, page, searchId, searchCreatedAt, searchDescription, searchUser) => {
			return axios
			.post(`${process.env.REACT_APP_BACKEND_URL}/candidate/getHistoryListByOption`, {
					id: id,
					sort_column: sort_column,
					sort_order: sort_order,
					count: count,
					page: page,
					searchId: searchId,
					searchCreatedAt: searchCreatedAt,
					searchDescription: searchDescription,
					searchUser: searchUser,
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

    update = (name, surname, person_id, date_of_birth, place_of_birth, street, house_number, apartment_number, post_code, post_office, city, 
        second_street, second_house_number, second_apartment_number, second_post_code, second_post_office, second_city,
        voivodeship, community, county, mobile_phone, home_phone, email, family_home_phone, family_mobile_phone,
        education, academic_title, stay_status, children_applicable, children_amount, children_age,
        employed_status, employed_type, employed_in, occupation, unemployed_status,
        have_unemployed_person_status, unemployed_person_id, long_term_employed_status, seek_work_status,
        passive_person_status, full_time_status, evening_student_status, disabled_person_status,
        number_certificate, date_of_certificate, level_certificate, code_certificate, necessary_certificate,
        ethnic_minority_status, homeless_person_status, stay_house_status, house_hold_status, house_hold_adult_status, uncomfortable_status,
        comment, id) => {
        return axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/candidate`, {
            name: name,
            surname: surname,
            person_id: person_id,
            date_of_birth: date_of_birth,
            place_of_birth: place_of_birth,
            street: street,
            house_number: house_number,
            apartment_number: apartment_number,
            post_code: post_code,
            post_office: post_office,
            city: city,
            second_street: second_street,
            second_house_number: second_house_number,
            second_apartment_number: second_apartment_number,
            second_post_code: second_post_code,
            second_post_office: second_post_office,
            second_city: second_city,
            voivodeship: voivodeship,
            community: community,
            county: county,
            mobile_phone: mobile_phone,
            home_phone: home_phone,
            email: email,
            family_home_phone: family_home_phone,
            family_mobile_phone: family_mobile_phone,
            education: education,
            academic_title: academic_title,
            stay_status: stay_status,
            children_applicable: children_applicable,
            children_amount: children_amount,
            children_age: children_age,
            employed_status: employed_status,
            employed_type: employed_type,
            employed_in: employed_in,
            occupation: occupation,
            unemployed_status: unemployed_status,
            have_unemployed_person_status: have_unemployed_person_status,
            unemployed_person_id: unemployed_person_id,
            long_term_employed_status: long_term_employed_status,
            seek_work_status: seek_work_status,
            passive_person_status: passive_person_status,
            full_time_status: full_time_status,
            evening_student_status: evening_student_status,
            disabled_person_status: disabled_person_status,
            number_certificate: number_certificate,
            date_of_certificate: date_of_certificate,
            level_certificate: level_certificate,
            code_certificate: code_certificate,
            necessary_certificate: necessary_certificate,
            ethnic_minority_status: ethnic_minority_status,
            homeless_person_status: homeless_person_status,
            stay_house_status: stay_house_status,
            house_hold_status: house_hold_status,
            house_hold_adult_status: house_hold_adult_status,
            uncomfortable_status: uncomfortable_status,
            comment: comment,
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

    updateInfo = (stage, comment, id) => {
        return axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/candidate/info`, {
            stage: stage,
            comment: comment,
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
        .delete(`${process.env.REACT_APP_BACKEND_URL}/candidate`, {
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
export default new Candidate();