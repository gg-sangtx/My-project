'use strict';

const Storage = require('@google-cloud/storage');
const config = require('constants/config');

const CLOUD_BUCKET = config.get('CLOUD_BUCKET');

const storage = Storage({
  projectId: config.get('GCLOUD_PROJECT')
});
const bucket = storage.bucket(CLOUD_BUCKET);

// Returns the public, anonymously accessable URL to a given Cloud Storage
// object.
// The object's ACL has to be set to public read.
// [START public_url]
function getPublicUrl (filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}

module.exports = {
  getPublicUrl
};