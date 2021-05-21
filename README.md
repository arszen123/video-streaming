# Simple video streaming site

## Features

- Upload video in chunks
- Stream video in chunks
- Auth
- Create comment
- List comments

## Prerequisites
- GCP project
    1. Create a new GCP project.
    2. Open Cloud shell.
    3. Clone the repository.
    4. Run ```. setup/setup_environment.sh```. It will enable the required services, create an app engine and create the necessary buckets.
- Firebase project (Required for user authentication)

## Set up local development

### Backend service
1. Install ```gcloud```, and initialize project with ```gcloud init```.
2. Create and init local service account.
```bash
# Create new service account
gcloud iam service-accounts create local-dev-env
# Set service account role.
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:local-dev-env@"$PROJECT_ID".iam.gserviceaccount.com" --role="roles/owner"
# Generate service-account.json key file.
gcloud iam service-accounts keys create service-account.json --iam-account=local-dev-env@$PROJECT_ID.iam.gserviceaccount.com
# Export key file path
export GOOGLE_APPLICATION_CREDENTIALS=$PWD"/service-account.json"
```
3. Run ```npm install``` and ```npm start```.

### Frontend service
1. Create an "environment.ts" file based on the "environment.sample.ts" and configure it.
2. Run ```npm install``` and ```npm start```.

## Deploy in the cloud

### Prerequisites
1. Create an "environment.prod.ts" file based on the "environment.sample.ts" and configure it.
2. Run ```gsutil cp environment.prod.ts gs://$GCLOUD_ENV_BUCKET```, to copy the file to the ```$GCLOUD_ENV_BUCKET``` bucket.

### Deploy from Cloud Shell
1. Follow the steps in the "cloudbuild.yaml" file.

### Deploy with Cloud Build
1. Create a new Cloud Source Repository and upload the source code or set it up as an external repository.
2. Under Cloud Build set up a new trigger.
3. Under IAM & Admin assign the necessary roles to "@cloudbuild.gserviceaccount.com" service account. (App Engine Deployer, App Engine Service Admin, Cloud Build Service Account, Cloud Build Editor, Cloud Build Service Agent, Compute Storage Admin, Service Account User)
4. Run the trigger manually to deploy the application.
