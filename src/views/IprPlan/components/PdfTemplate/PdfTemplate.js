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
		width: '25%',
		border: '1px solid #000000',
		padding: 7,
	},
	div_3: {
		width: '10%',
		border: '1px solid #000000',
		padding: 7,
	},
	div_4: {
		width: '15%',
		border: '1px solid #000000',
		padding: 7,
	},
	content_text_1: {
		border: '1px solid #000000',
		height: 60,
		width: '100%',
		padding: 7
	},
});

const PdfTemplate = (props) => {
  const { participant_number, participant_name, ipr_type, number, schedule_date, ork_person, moduleList } = props;
	const getOrkPerson = (module, id_ork, index_module) => {
	  if (id_ork === null || id_ork === undefined)
	  	return '';
	  for (let i = 0; i < module.ork_team.length; i ++) {
			if (module.ork_team[i] === undefined)
				continue;
		  if (module.ork_team[i].id == id_ork || module.ork_team[i].id == id_ork.id) {
			  return module.ork_team[i].name;
		  }
	  }
	  return '';
  }

  return (
		<Document>
			<Page style={styles.page} wrap={true}>				
				<View style={styles.header}>
					<Text style={styles.border}>
						PLAN REALIZACJI INDYWIDUALNEGO PROGRAMU REHABILITACJI
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
				<View wrap={false}>
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
						<Text style={styles.div_3}>
							Wymiar
						</Text>
						<Text style={styles.div_3}>
							Jednostka
						</Text>
						<Text style={styles.div_3}>
							Osoba realizujaca
						</Text>
						<Text style={styles.div_3}>
							Sala
						</Text>
						<Text style={styles.div_4}>
							Uwagi
						</Text>
					</View>
					{
						moduleList.map((module, index_module) => (
							<View style={styles.content} wrap={false}>
								<View style={styles.content_div_1}>
									{
										module.plan.map((service, index) => (
											<Text style={styles.content_text_1}>
												{index + 1}
											</Text>
										))
									}
								</View>
								<View style={styles.content_div_2}>
									<View style={{border: '1px solid #000000', width: '100%', height: module.plan.length * 60}}>
										<Text style={{transform: 'rotate(90deg)', width: 500, transformOrigin: '0% 100%',}}>
											{module.name}
										</Text>
									</View>
								</View>
								<View style={styles.content_div_3}>
									{
										module.plan.map((service, index) => (
											<View style={{width: '100%', display: 'flex', flexDirection: 'row'}} >
												<Text style={{width: '33%', fontSize: '8',border: '1px solid #000000', height: 60, padding: 7}}>
													{service.name}
												</Text>
												<Text style={{width: '13%', fontSize: '8',border: '1px solid #000000', height: 60, padding: 7}}>
													{service.amount}
												</Text>
												<Text style={{width: '13%', fontSize: '8',border: '1px solid #000000', height: 60, padding: 7}}>
													{service.unit}
												</Text>
												<Text style={{width: '13%', fontSize: '8',border: '1px solid #000000', height: 60, padding: 7}}>
													{getOrkPerson(module, service.id_ork_person, index_module)}
												</Text>
												<Text style={{width: '13%', fontSize: '8',border: '1px solid #000000', height: 60, padding: 7}}>
													{service.room_number}
												</Text>
												<Text style={{width: '20%', fontSize: '8',border: '1px solid #000000', height: 60, padding: 7}}>
													{service.remarks}
												</Text>
											</View>
										))
									}
								</View>
							</View>
						))
					}
				</View>
			</Page>
			
		</Document>
  );
};

export default PdfTemplate;
