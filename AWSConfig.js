const AWS = require("aws-sdk");
const jwt_decode = require("jwt-decode");
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");

//variable set
let cognitoAttributeList = [];
const poolData = {
  UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
  ClientId: process.env.AWS_COGNITO_CLIENT_ID,
};

//-------attribute type
const attributes = (key, value) => {
  return {
    Name: key,
    Value: value,
  };
};

//inital AWS instance
function initAWS(
  region = process.env.AWS_COGNITO_REGION,
  identityPoolId = process.env.AWS_COGNITO_IDENTITY_POOL_ID
) {
  AWS.config.region = region; // Region
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: identityPoolId,
  });
}

//--------setter  attribute list
function setCognitoAttributeList(email, agent) {
  let attributeList = [];
  attributeList.push(attributes("email", email));
  attributeList.forEach((element) => {
    cognitoAttributeList.push(
      new AmazonCognitoIdentity.CognitoUserAttribute(element)
    );
  });
}

//--------setter method for get all arrtibuteList
function getCognitoAttributeList() {
  return cognitoAttributeList;
}

//--------------------------------user-------------------------------------------
//setter method for get congitoUser
function getCognitoUser(email) {
  const userData = {
    Username: email,
    Pool: getUserPool(),
  };
  return new AmazonCognitoIdentity.CognitoUser(userData);
}

//inital instance userpool
function getUserPool() {
  return new AmazonCognitoIdentity.CognitoUserPool(poolData);
}
//--------------------------------------------------------------------------------

//getter detail to auth
function getAuthDetails(email, password) {
  var authenticationData = {
    Username: email,
    Password: password,
  };
  return new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
}

//method to decode the JWT
function decodeJWTToken(token) {
  const { email, exp, auth_time, token_use, sub } = jwt_decode(token.idToken);
  return { token, email, exp, uid: sub, auth_time, token_use };
}

module.exports = {
  initAWS,
  getCognitoAttributeList,
  getUserPool,
  getCognitoUser,
  setCognitoAttributeList,
  getAuthDetails,
  decodeJWTToken,
};
