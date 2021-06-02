import React, { useEffect, useState } from 'react';
import {
	Page,
	Text,
	View,
	Document,
	StyleSheet,
	Image,
	Font
} from "@react-pdf/renderer";
import theme from 'theme';
import regular from "utils/Roboto-Regular.ttf";
import { getMonth, getYear } from 'date-fns';

Font.register({
	family: "Roboto",
	src: regular
});
const styles = StyleSheet.create({
	page: {
		backgroundColor: "#ffffff",
		padding: '60px 40px',
		fontFamily: 'Roboto'
	},
	header: {
		display: 'flex',
		justifyContent: 'center',
		fontSize: 12,
		fontWeight: 700,
	},
	normal: {
		fontSize: 8,
		display: 'flex',
		flexDirection: 'row'
	},
	top: {
		marginBottom: '10px'
	},
	image: {

	},
	border: {
		width: '100%',
		border: '1px solid #000000',
		padding: '7 0',
		textAlign: 'center',
		backgroundColor: '#6d9EE0'
	},
	content: {
		width: '100%',
		fontSize: 10,
		display: 'flex',
		flexDirection: 'row'
	},
	content_div_1: {
		width: '10%',
	},
	content_div_2: {
		width: '10%',
		fontSize: 8
	},
	content_div_3: {
		width: '80%'
	},
	left_col: {
		width: '50%',
		border: '1px solid #000000',
		padding: 7,
		textAlign: 'right',
		fontWeight: 700,
	},
	right_col: {
		width: '50%',
		border: '1px solid #000000',
		padding: 7,
		textAlign: 'left',
	},
	section: {
		marginBottom: '10'
	},
	div_1: {
		width: '10%',
		border: '1px solid #000000',
		padding: 7,
	},
	div_2: {
		width: '24.8%',
		border: '1px solid #000000',
		padding: 7,
	},
	div_3: {
		width: '10.45%',
		border: '1px solid #000000',
		padding: 7,
	},
	div_4: {
		width: '14.4%',
		border: '1px solid #000000',
		padding: 7,
	},
	div_7: {
		width: '20%',
		height: 40,
		padding: '7 1',
	},
	div_5: {
		width: '30%',
		border: '1px solid #000000',
		textAlign: 'center'
		// padding: 7,
	},
	div_6: {
		width: '20%',
		height: 40,
		borderRight: '1px solid #00000',
		padding: '7 1',
	},
	content_text_1: {
		border: '1px solid #000000',
		height: 50,
		width: '100%',
		padding: 7
	},
});

const PdfTemplateSchedule = (props) => {
	const { participant_number, participant_name, ipr_type, number, schedule_date, ork_person, moduleList, dayList, onDocumentLoadSuccess } = props;
	const monthList = ['STYCZ', 'LUT', 'MAR', 'KWIE', 'MAJ', 'CZERW', 'LIP', 'SIERP', 'WRZES', 'PAZDZIER', 'LISTOPAD', 'GRUD']
	const getOrkPerson = (module, id_ork, index_module) => {
		if (id_ork === null)
			return '';
		for (let i = 0; i < module.ork_team.length; i++) {
			if (Number(module.ork_team[i].id) === Number(id_ork) || Number(module.ork_team[i].id) === Number(id_ork.id)) {
				return module.ork_team[i].name;
			}
		}
		return '';
	}

	const getDay = (value, id) => {
		let date = new Date(value);
		let day_result = date.getDate() + '.' + (date.getMonth() + 1)
		let days = ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek']
		return day_result + ' ' + days[id];
	}

	const getTotalAmount = (index_module, index) => {
		let sum = 0;
		moduleList.map((module) => {
			sum += parseInt(module[index_module].service_list[index].schedule != undefined && module[index_module].service_list[index].schedule.total_amount ? module[index_module].service_list[index].schedule.total_amount : 0);
		})
		return sum;
	}

	return (
		<Document
			onRender={onDocumentLoadSuccess}>
			<Page style={styles.page} wrap={true} orientation="landscape" size="A3">
				<View style={styles.top}>
					<Image src='/images/logos/1.png' style={styles.image} />
				</View>
				<View style={styles.header}>
					<Text style={styles.border}>
						PLAN REALIZACJI INDYWIDUALNEGO PROGRAMU REHABILITACJI - HARMONOGRAM
					</Text>
				</View>
				<View style={styles.section}>
					<View style={styles.normal}>
						<Text style={styles.left_col}>
							Nr
						</Text>
						<Text style={styles.right_col}>
							{number}
						</Text>
					</View>
					<View style={styles.normal}>
						<Text style={styles.left_col}>
							Typ
						</Text>
						<Text style={styles.right_col}>
							{ipr_type}
						</Text>
					</View>
					<View style={styles.normal}>
						<Text style={styles.left_col}>
							Data wypełnienia
						</Text>
						<Text style={styles.right_col}>
							{schedule_date}
						</Text>
					</View>
					<View style={styles.normal}>
						<Text style={styles.left_col}>
							Specjalista ds. zarządzania rehabilitacją
						</Text>
						<Text style={styles.right_col}>
							{ork_person ? ork_person : ''}
						</Text>
					</View>
					<View style={styles.normal}>
						<Text style={styles.left_col}>
							Imię i nazwisko uczestnika
						</Text>
						<Text style={styles.right_col}>
							{participant_name}
						</Text>
					</View>
					<View style={styles.normal}>
						<Text style={styles.left_col}>
							Numer uczestnika w ORK
						</Text>
						<Text style={styles.right_col}>
							{participant_number}
						</Text>
					</View>
				</View>
			</Page>
			{
				moduleList.length > 0 && moduleList[0].map((module, index_module) => (
					<Page style={styles.page} wrap={true} orientation="landscape" size="A3">
						<View>
							{
								index_module === 0 &&
								<View>
									<View style={styles.top}>
										<Image src='/images/logos/1.png' style={styles.image} />
									</View>
									<View style={styles.normal}>
										<Text style={styles.div_1}>
											Lp.
										</Text>
										<Text style={styles.div_1}>
											Moduł
										</Text>
										<Text style={styles.div_2}>
											Procedury/Usługi
										</Text>
										<View style={styles.div_5}>
											<Text style={{ width: '100%', height: 20, borderBottom: '1px solid #000000' }}>
												Miesiąc: {monthList[getMonth(new Date(dayList[0]))]} {getYear(new Date(dayList[0]))}
											</Text>
											<View style={{ display: 'flex', flexDirection: 'row' }}>
												<Text style={styles.div_6}>
													{dayList && getDay(dayList[0], 0)}
												</Text>
												<Text style={styles.div_6}>
													{dayList && getDay(dayList[1], 1)}
												</Text>
												<Text style={styles.div_6}>
													{dayList && getDay(dayList[2], 2)}
												</Text>
												<Text style={styles.div_6}>
													{dayList && getDay(dayList[3], 3)}
												</Text>
												<Text style={styles.div_7}>
													{dayList && getDay(dayList[4], 4)}
												</Text>
											</View>
										</View>
										<Text style={styles.div_3}>
											Łączny czas - godz
										</Text>
										<Text style={styles.div_4}>
											Imię, nazwisko i podpis realizującego
									</Text>
									</View>
								</View>
							}
							{index_module > 0 &&
								<View style={styles.top}>
									<Image src='/images/logos/1.png' style={styles.image} />
								</View>
							}
							<View style={styles.content} wrap={false}>
								<View style={styles.content_div_1}>
									{
										module.service_list.map((service, index) => (
											<Text style={styles.content_text_1}>
												{index + 1}
											</Text>
										))
									}
								</View>
								<View style={styles.content_div_2}>
									<View style={{ border: '1px solid #000000', width: '100%', height: module.service_list.length * 50 }}>
										<Text style={{ transform: 'rotate(90deg)', width: 500, transformOrigin: '0% 100%', }}>
											{module.name}
										</Text>
									</View>
								</View>
								<View style={styles.content_div_3}>
									{
										module.service_list.map((service, index) => (
											<View style={{ width: '100%', display: 'flex', flexDirection: 'row' }} >
												<View style={{ width: '31%', fontSize: '8', border: '1px solid #000000', height: 50, padding: 7 }}>
													<Text >
														{service.name}
													</Text>
												</View>
												<View style={{ width: '7.5%', fontSize: '8', border: '1px solid #000000', height: 50, padding: 7 }}>
													<Text>
														{!service.schedule || service.schedule === undefined ? '' : service.schedule.total_amount}
													</Text>
												</View>
												<View style={{ width: '7.5%', fontSize: '8', border: '1px solid #000000', height: 50, padding: 7 }}>
													<Text>
														{
															!moduleList[1][index_module].service_list[index].schedule
																|| moduleList[1][index_module].service_list[index].schedule === undefined
																? '' : moduleList[1][index_module].service_list[index].schedule.total_amount}
													</Text>
												</View>
												<View style={{ width: '7.5%', fontSize: '8', border: '1px solid #000000', height: 50, padding: 7 }}>
													<Text>
														{
															!moduleList[2][index_module].service_list[index].schedule
																|| moduleList[2][index_module].service_list[index].schedule === undefined
																? '' : moduleList[2][index_module].service_list[index].schedule.total_amount}
													</Text>
												</View>
												<View style={{ width: '7.5%', fontSize: '8', border: '1px solid #000000', height: 50, padding: 7 }}>
													<Text>
														{
															!moduleList[3][index_module].service_list[index].schedule
																|| moduleList[3][index_module].service_list[index].schedule === undefined
																? '' : moduleList[3][index_module].service_list[index].schedule.total_amount}
													</Text>
												</View>
												<View style={{ width: '7.5%', fontSize: '8', border: '1px solid #000000', height: 50, padding: 7 }}>
													<Text>
														{
															!moduleList[4][index_module].service_list[index].schedule
																|| moduleList[4][index_module].service_list[index].schedule === undefined
																? '' : moduleList[4][index_module].service_list[index].schedule.total_amount}
													</Text>
												</View>
												<View style={{ width: '13%', fontSize: '8', border: '1px solid #000000', height: 50, padding: 7 }}>
													<Text>
														{
															getTotalAmount(index_module, index)
														}
													</Text>
												</View>
												<View style={{ width: '18%', fontSize: '8', border: '1px solid #000000', height: 50, padding: 7 }}>
													<Text>

													</Text>
												</View>

											</View>
										))
									}
								</View>
							</View>
						</View>
					</Page>
				))
			}
		</Document >
	);
};

export default PdfTemplateSchedule;
