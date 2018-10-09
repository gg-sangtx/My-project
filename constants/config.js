const env = process.env || {}; // eslint-disable-line no-process-env

[
  'NODE_ENV',
  'APP_PORT',
  'API_URL'
].forEach((name) => {
  if (!env[name]) {
    console.log(`Environment variable ${name} is missing, use default instead.`);
  }
});

const config = {
  ENV: env.NODE_ENV || 'development',
  staticURL: env.STATIC_URL || 'http://localhost:3000',
  API_URL: env.API_URL || 'http://899b51aa.ngrok.io/api',
  API_GOV: env.API_GOV || 'http://192.168.1.75:8000/api',
  API_GOV_KEY: env.API_GOV_KEY || 'http://192.168.1.75:8000/api',
  PORT: Number(env.APP_PORT || 3000),
  USER_BASIC_AUTH: env.USER_BASIC_AUTH || 'yom',
  PASSWORD_BASIC_AUTH: env.PASSWORD_BASIC_AUTH || 'marlmarl',
  CLOUD_BUCKET: 'dev-static-photostudio',
  DATA_BACKEND: 'datastore',
  GCLOUD_PROJECT: 'photostudio-198503'
};

module.exports = config;
