# CLI App of Project s3-cognito-access

### This is a simple reference architecture and demo to enable external users to access your internal S3 storage with Cognito Userpool. 

# 1. Quick Start
## 1-1. Installation
```
$ npm install -g s3-cognito-cli
```

## 1-2. Installation
```
$ s3cognito config --set <aws-exports.json> --usr <usr> --pwd <pwd>
```
### Generate aws-exports.json by referencing to the guide of amplify-s3-cognito

## 1-3. Upload your file
```
$ s3cognito upload <your_file_relative_path>
```

## 1-4. Register -- TODO
```
$ s3cognito register
```
https://aws-amplify.github.io/amplify-js/api/classes/authclass.html#signup
https://aws-amplify.github.io/amplify-js/api/classes/authclass.html#confirmsignup
