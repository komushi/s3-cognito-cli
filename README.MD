# CLI App of Project s3-cognito-access

### This is a simple reference architecture and demo to enable external users to access your internal S3 storage with Cognito Userpool. 

# 1. Quick Start
## 1-1. Installation - only once
```
$ npm install -g s3-cognito-cli
```

## 1-2. Profile Configuration - which S3 Bucket, which Cognito Userpool to use - only once for one S3 & Cognito environment
```
$ s3cognito config --set <aws-exports.json> --usr <user> --pwd <pwd>
```
### Generate aws-exports.json by referencing to the guide of amplify-s3-cognito
### This guide below teaches creating S3 and Cognito in an easy way.
https://github.com/komushi/amplify-s3-cognito

## 1-3. SignUp a Cognito Userpool User - only once if only using this user
```
$ s3cognito signup --usr <user> --pwd <pass> --email <email_address>
```

## 1-4. Confirm SignUp - only once for this user
```
$ s3cognito confirm --usr <user> --code <confirmation_code>
```

## 1-5. Upload your file
```
$ s3cognito upload <your_file_relative_path>
```
# 2. TODO
* Add Tags for original file name
* Add download, list, describe features
* Enable file share between users