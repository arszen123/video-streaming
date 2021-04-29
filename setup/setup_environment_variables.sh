#!/bin/bash

# According to https://cloud.google.com/free/docs/gcp-free-tier
# us-central1 region is included in the free tier.
export ZONE=us-central1
export GCLOUD_PROJECT=$DEVSHELL_PROJECT_ID
export GCLOUD_MEDIA_BUCKET=$GCLOUD_PROJECT-media
export GCLOUD_MEDIA_TEMP_BUCKET=$GCLOUD_PROJECT-media-temp