#!/usr/bin/env node

const username = 'xu';
const password = 'pa55word';
const filePath = 'yoda.jpg';

const aws_exports = require('./aws-exports').getConfig();
const Amplify = require('aws-amplify');
const AWS = require('aws-sdk');
const ShortUniqueId = require('short-unique-id');
const fs = require('fs');
const path = require('path');

global.fetch = require('node-fetch');
// global.navigator = {};

const createUploadJob = `mutation CreateUploadJob($input: CreateUploadJob!) {
  createUploadJob(input: $input) {
    user
    objKey
    fileKey
    fileName
    status
    uploadedOn
  }
}
`;

const configureAmplify = () => {
	Amplify.default.configure(aws_exports);

	// Amplify.default.configure({
 //    Auth: {

 //      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
 //      identityPoolId: aws_exports.aws_cognito_identity_pool_id,
      
 //      // REQUIRED - Amazon Cognito Region
 //      region: aws_exports.aws_project_region,

 //      // OPTIONAL - Amazon Cognito User Pool ID
 //      userPoolId: aws_exports.aws_user_pools_id,

 //      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
 //      userPoolWebClientId: aws_exports.aws_user_pools_web_client_id,

 //    },
 //    Analytics: {
 //      // OPTIONAL - disable Analytics if true
 //      disabled: true,
 //    }
	// });

}

const initiateCognitoAuth = async() => {
	configureAmplify();

	const Auth = Amplify.Auth;

	await Auth.signIn(username, password).catch((err) => {
	  // console.log(err);
	  throw err;
	});

	const [
	  currentUserInfo,
	  currentUserCredentials,
	] = 
	  await Promise.all([
	    Auth.currentUserInfo(),
	    Auth.currentUserCredentials()
	  ]);

	console.log('identity_id', currentUserCredentials.identityId);
	
	console.log('***** Begin currentUserInfo *****');
	console.log(JSON.stringify(currentUserInfo));
	console.log('***** End currentUserInfo *****');

	AWS.config = new AWS.Config({
	  credentials: currentUserCredentials, region: aws_exports.aws_cognito_region
	});

	return {
		username: currentUserInfo.username,
		identityId: currentUserCredentials.identityId
	};

}

const multiUpload = async({username, identityId}) => {

	const uid = new ShortUniqueId();

	const fileKey = uid.randomUUID(6);
	const objKey = `protected/${identityId}/${fileKey}`;
	const bucket = aws_exports.aws_user_files_s3_bucket;

  const fileStream = fs.createReadStream(path.resolve(filePath));

	const params = {Bucket: bucket, Key: objKey, Body: fileStream};
	const options = {partSize: 10 * 1024 * 1024, queueSize: 10};

	const s3 = new AWS.S3({apiVersion: '2006-03-01'});
	const s3upload = s3.upload(params, options);

	s3upload.on('httpUploadProgress', evt => { console.log('httpUploadProgress', evt) });

	return new Promise((resolve, reject) => {
			s3upload.send((err, data) => {
				if (err) {
					console.log("An error occurred", err);
					reject(err);
				} else {
					console.log("Uploaded the file at", data.Location);		
					resolve({ objKey, fileKey, fileName: filePath, user: username });
				}
			});
	    });
}

const saveUploadJob = async ({objKey, fileKey, fileName, user}) => {

	const API = Amplify.API;
	const graphqlOperation = Amplify.graphqlOperation;

	const input = {
	    user,
	    objKey,
	    fileKey,
	    fileName,
	    status: 'Done',
	    uploadedOn: new Date().toISOString()
	};

    const rtn = await API.graphql(graphqlOperation(createUploadJob, { input }))
      .catch(e => {
        // console.error('createUploadJob', e);
        throw e;
      });

  	// console.log('saveUploadJob rtn', rtn);
  	console.log('***** Begin createUploadJob *****');
    console.log(rtn);
    console.log('***** End createUploadJob *****');

  	return { fileKey, data: rtn };
}

initiateCognitoAuth()
	.then(multiUpload)
	// .then(saveUploadJob)
	.catch(e => console.error(e));

