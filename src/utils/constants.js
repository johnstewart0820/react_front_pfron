class constants {
    CHECK_ALL_FIELDS = "Proszę uzupełnić wszystkie pola.";
    ENTER_VALID_EMAIL = "Proszę wprowadzić poprawny adres e-mail.";
    ENTER_PASSWORD = "Hasło musi mmieć co namniej 6 znaków.";
    ENTER_SAME_PASSWORD = "Hasła muszą być takie same.";
    CHECK_POLICY = "Proszę zaakceptować regulamin.";
    unauthenticated_url = [
        '/not-found',
        '/login',
        '/forgotpassword',
        '/verification',
        '/reset_password'
    ];

	authenticated_url = [
		[
			'/cockpit',

			'/candidates',
			'/candidates/create',
			'/candidates/edit/*',
			'/candidates/info/step1/*',
			'/candidates/info/step2/*',
			'/candidates/info/step3/*',
			'/candidates/info/step4/*',
			
			'/qualification_points',
			'/qualification_points/create',
			'/qualification_points/edit/*',

			'/specialists',
			'/specialists/create',
			'/specialists/edit/*',

			'/participants',

			'/ork_teams',
			'/ork_teams/create',
			'/ork_teams/edit/*',

			'/ipr_list',

			'/service_list',
			'/service_list/create',
			'/service_list/edit/*',

			'/working_shop',

			'/notifications',

			'/ork_list',
			'/ork_list/create',
			'/ork_list/edit/*',

			'/payments',
			'/payments/create',
			'/payments/edit/*',

			'/reports',

			'/users',
			'/users/create',
			'/users/edit/*',

			'/profile',

			'/logs',
		],
		[
			'/cockpit',

			'/candidates',
			'/candidates/create',
			'/candidates/edit/*',
			'/candidates/info/step1/*',
			'/candidates/info/step2/*',
			'/candidates/info/step4/*',

			'/qualification_points',
			'/qualification_points/create',
			'/qualification_points/edit/*',

			'/specialists',
			'/specialists/create',
			'/specialists/edit/*',

			'/participants',

			'/ork_teams',
			'/ork_teams/create',
			'/ork_teams/edit/*',

			'/ipr_list',

			'/service_list',
			'/service_list/create',
			'/service_list/edit/*',

			'/working_shop',

			'/ork_list',
			'/ork_list/create',
			'/ork_list/edit/*',

			'/payments',
			'/payments/create',
			'/payments/edit/*',

			'/reports',

			'/profile',
		],
		[
			'/cockpit',

			'/candidates',
			'/candidates/create',
			'/candidates/edit/*',
			'/candidates/info/step1/*',
			'/candidates/info/step2/*',
		]
	];
}

export default new constants();
