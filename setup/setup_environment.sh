#!/bin/bash

$(dirname $0)/setup_environment_variables.sh

# Enable services 
#gcloud services enable firestore.googleapis.com
gcloud services enable datastore.googleapis.com storage-component.googleapis.com storage.googleapis.com

# create app engine
gcloud app create --region=us-central
# create buckets
gsutil mb -p $GCLOUD_PROJECT -c STANDARD -l US-CENTRAL1 gs://$GCLOUD_MEDIA_BUCKET
gsutil mb -p $GCLOUD_PROJECT -c STANDARD -l US-CENTRAL1 gs://$GCLOUD_MEDIA_TEMP_BUCKET
gsutil mb -p $GCLOUD_PROJECT gs://$GCLOUD_ENV_BUCKET