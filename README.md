# Simple video streaming site

## Features

- Upload video in chunks
- Stream video in chunks

## Setup (GCP local)
1. Create new GCP project.
2. Open Cloud shell.
3. Install ```node```, ```npm```.
4. Clone repository.
4. Run ```./setup_environment.sh```
5. Run ```npm install```
6. Run ```npm start```
6. Click "Web preview" > "Preview on port 8080"

## Deploy from Cloud Shell
1. Clone repository.
2. Run ```./setup_environment.sh``` (Only need to run once, to enable services and create buckets).
3. Run ```sed -i 's/{PROJECT_ID}/'$DEVSHELL_PROJECT_ID'/g' app.yaml``` to replace {PROJECT_ID} with the actual project id in the app.yaml.
4. Run ```gcloud app deploy``` to deploy.

## Deploy with Cloud Build
1. Create a new Cloud Source Repository and upload the source code or set it up as an external repository.
2. Under Cloud Build set up a new trigger.
3. Under IAM & Admin assign the necessary roles to "@cloudbuild.gserviceaccount.com" service account. (App Engine Deployer, App Engine Service Admin, Cloud Build Service Account, Cloud Build Editor, Cloud Build Service Agent, Compute Storage Admin, Service Account User)
4. Run the trigger manually to deploy the application.
