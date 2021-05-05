# Simple video streaming site

## Features

- Upload video in chunks
- Stream video in chunks

## Prerequisites
1. Create a new GCP project.
2. Open Cloud shell.
3. Clone the repository.
4. Run ```./setup/setup_environment.sh```.

## Set up local development
1. Install ```gcloud```, and initialize project with ```gcloud init```.
2. Create and init local service account.
```bash
# Create new service account
gcloud iam service-accounts create local-dev-env
# Set service account role.
gcloud projects add-iam-policy-binding video-streaming-312208 --member="serviceAccount:local-dev-env@video-streaming-312208.iam.gserviceaccount.com" --role="roles/owner"
# Generate service-account.json key file.
gcloud iam service-accounts keys create service-account.json --iam-account=local-dev-env@video-streaming-312208.iam.gserviceaccount.com
# Export key file path
export GOOGLE_APPLICATION_CREDENTIALS=$PWD"/service-account.json"
```
3. Run ```npm install``` and ```npm start``` in both backend and frontend directories.

## Deploy from Cloud Shell
1. Follow the steps in the "cloudbuild.yaml" file.

## Deploy with Cloud Build
1. Create a new Cloud Source Repository and upload the source code or set it up as an external repository.
2. Under Cloud Build set up a new trigger.
3. Under IAM & Admin assign the necessary roles to "@cloudbuild.gserviceaccount.com" service account. (App Engine Deployer, App Engine Service Admin, Cloud Build Service Account, Cloud Build Editor, Cloud Build Service Agent, Compute Storage Admin, Service Account User)
4. Run the trigger manually to deploy the application.
