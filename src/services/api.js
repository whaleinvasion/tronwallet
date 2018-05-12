import { stringify } from 'qs';
import { Auth } from 'aws-amplify';
import request from '../utils/request';
// framework default apis
export const signIn = async (email, password) => {
  try {
    const user = await Auth.signIn(email, password);
    let totpCode = null;
    if (user.challengeParam.MFAS_CAN_SETUP) {
      totpCode = await Auth.setupTOTP(user);
    }
    return { user, totpCode };
  } catch (err) {
    throw new Error(err.message || err);
  }
};

export const confirmSignIn = async (user, totpCode, code) =>
  totpCode
    ? Auth.verifyTotpToken(user, code)
    : Auth.confirmSignIn(user, code, 'SOFTWARE_TOKEN_MFA');

export const signOut = async () => Auth.signOut();

export const signUp = async ({ password, email }) => {
  return Auth.signUp({
    username: email,
    password,
    attributes: {
      email,
    },
    validationData: [],
  });
};

export const confirmSignup = async ({ email, code }) => {
  return Auth.confirmSignUp(email, code);
};

export const changePassword = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    const response = await Auth.changePassword(user, 'oldPassword', 'newPassword');
    return response;
  } catch (error) {
    console.log('ChangePassword Error', error);
  }
};

export const forgotPassword = async email => {
  return Auth.forgotPassword(email);
};

export const confirmForgotPassword = async ({ email, code, newPassword }) => {
  return Auth.forgotPasswordSubmit(email, code, newPassword);
};

export const setUserPk = async publickey => {
  const user = await Auth.currentAuthenticatedUser();
  return Auth.updateUserAttributes(user, {
    'custom:publickey': publickey,
  });
};

export const getUserAttributes = async () => {
  const authenticatedUser = await Auth.currentAuthenticatedUser();
  const userAttributes = await Auth.userAttributes(authenticatedUser);
  const user = {};

  for (const attribute of userAttributes) {
    user[attribute.Name] = attribute.Value;
  }
  return user;
};

//= ============================================
export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getTronPrice() {
  // return request('https://min-api.cryptocompare.com/data/histohour?fsym=TRX&tsym=USD&limit=60&aggregate=3&e=CCCAGG');
  return { "Response": "Success", "Type": 100, "Aggregated": true, "Data": [{ "time": 1525496400, "close": 0.08962, "high": 0.09099, "low": 0.08884, "open": 0.08979, "volumefrom": 3405128.16, "volumeto": 306188.5 }, { "time": 1525507200, "close": 0.0881, "high": 0.08972, "low": 0.08695, "open": 0.08962, "volumefrom": 6776995.62, "volumeto": 598123.74 }, { "time": 1525518000, "close": 0.08731, "high": 0.08943, "low": 0.08657, "open": 0.08814, "volumefrom": 6274115.82, "volumeto": 550393.5 }, { "time": 1525528800, "close": 0.08716, "high": 0.0877, "low": 0.08693, "open": 0.08734, "volumefrom": 3891750.39, "volumeto": 339670.16 }, { "time": 1525496400, "close": 0.08962, "high": 0.09099, "low": 0.08884, "open": 0.08979, "volumefrom": 3405128.16, "volumeto": 306188.5 }, { "time": 1525507200, "close": 0.0881, "high": 0.08972, "low": 0.08695, "open": 0.08962, "volumefrom": 6776995.62, "volumeto": 598123.74 }, { "time": 1525518000, "close": 0.08731, "high": 0.08943, "low": 0.08657, "open": 0.08814, "volumefrom": 6274115.82, "volumeto": 550393.5 }, { "time": 1525528800, "close": 0.08716, "high": 0.0877, "low": 0.08693, "open": 0.08734, "volumefrom": 3891750.39, "volumeto": 339670.16 }], "TimeTo": 1526144400, "TimeFrom": 1525496400, "FirstValueInArray": true, "ConversionType": { "type": "direct", "conversionSymbol": "" } };
}