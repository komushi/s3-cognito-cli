const Amplify = require('aws-amplify');
global.fetch = require('node-fetch');

const fs = require('fs');
const os = require('os');
const path = require('path');

const filename = '.s3cognitorc';
const configFile = path.join(os.homedir(), filename);

module.exports.readConfig = (key) => {
	const jsonConfig = readAllConfig();

	return jsonConfig[key];
}

module.exports.saveConfig = (argv) => {

	const settings = {
		usr: argv.usr,
		pwd: argv.pwd,		
		aws_appsync_authenticationType: argv.aws_appsync_authenticationType,
		aws_appsync_region: argv.aws_appsync_region,
		aws_appsync_graphqlEndpoint: argv.aws_appsync_graphqlEndpoint,
		aws_user_files_s3_bucket_region: argv.aws_user_files_s3_bucket_region,
		aws_user_files_s3_bucket: argv.aws_user_files_s3_bucket,
		aws_user_pools_web_client_id: argv.aws_user_pools_web_client_id,
		aws_user_pools_id: argv.aws_user_pools_id,
		aws_cognito_region: argv.aws_cognito_region,
		aws_cognito_identity_pool_id: argv.aws_cognito_identity_pool_id,
		aws_project_region: argv.aws_project_region,
	};

	let jsonConfig = readAllConfig();

	jsonConfig[argv.key] = settings;

	const output = JSON.stringify(jsonConfig);

	console.log('output', output);

	fs.writeFileSync(configFile, output);	
}

readAllConfig = () => {
	let jsonConfig;

	if (fs.existsSync(configFile)) {
		jsonConfig = JSON.parse(fs.readFileSync(configFile, 'utf8'));
	} else {
		jsonConfig = {};
	}

	return jsonConfig;
}

module.exports.signUp = async ({username, password, email}, config) => {
	configureAmplify(config);

	const authResult = await signUp(
		username, 
		password,
		email
	).catch(e => {
		console.error('SignUp Failure!');
		console.error(e);
	});
}

module.exports.confirmSignUp = async ({username, code}, config) => {
	configureAmplify(config);

	const Auth = Amplify.Auth;

	Auth.confirmSignUp(username, code, {
	    forceAliasCreation: true    
	})
	.then(data => console.log(data))
	.catch(err => console.log(err));
}

const configureAmplify = (config) => {
	Amplify.default.configure(config);
}

const signUp = async(username, password, email) => {
  	console.log('username', username)
  	console.log('password', password)	

	const Auth = Amplify.Auth;

	const rtn = await Auth.signUp({
		username: username,
		password: password,
	    attributes: {
	        email: email
	    },
	});
}


