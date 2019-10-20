# CLI App of Project s3-cognito-access

### This is a simple reference architecture and demo to enable external users to access your internal S3 storage with Cognito Userpool. 

# 1. Quick Start
## 1-1. Installation
```
$ npm install -g s3-cognito-cli
```

## 1-2. Profile Configuration - which S3 Bucket, which Cognito Userpool to use
```
$ s3cognito config --set <aws-exports.json> --usr <user> --pwd <pwd>
```
### Generate aws-exports.json by referencing to the guide of amplify-s3-cognito

## 1-3. SignUp a Cognito Userpool User
```
$ s3cognito signup --usr <user> --pwd <pass> --email <email_address>
```

## 1-4. Confirm SignUp
```
$ s3cognito confirm --usr <user> --code <confirmation_code>
```

## 1-5. Upload your file
```
$ s3cognito upload <your_file_relative_path>
```

https://aws-amplify.github.io/amplify-js/api/classes/authclass.html#signup
https://aws-amplify.github.io/amplify-js/api/classes/authclass.html#confirmsignup
