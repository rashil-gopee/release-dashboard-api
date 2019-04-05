module.exports = {
	mail_api_key: 'd5b2a7c0d7d2fdf4a3aba259c25d6d47',
	mail_api_secret: 'c4036f419faeb1cbcd506f8dbb94a77f',
	from_email: 'isswarraj.gopee@gmail.com',
	from_name: 'Release Dashboard',

	//jwt token config
	secret: 'Nv4Mt82x358318FY5530w8vZmCfeh8G2',
	algorithm: 'HS256', // HS256(default) HS384 HS512 RS256
	duration: 1,
	durationType: 'days',

	mongodb:
		process.env.MONGO_PATH ||
		'mongodb+srv://dev:mizbTb2MYTqzAZf2@dev-o850d.mongodb.net/release-dashboard?retryWrites=true',
	port: process.env.PORT || 80
};
