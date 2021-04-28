/**
 * Declaration
 */
const form = document.getElementById('upload-form');
const fileElement = document.getElementById('file');
const fileProgressElement = document.getElementById('file-progress');
const videoIdElement = document.getElementById('video-id');
const submitElement = document.getElementById('submit');
const progressInfoElement = document.getElementById('proggress-info');

/**
 * Form validation
 */
form.addEventListener('submit', function (event) {
    if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
    }
    window.onbeforeunload = null;
    form.classList.add('was-validated')
}, false)

/**
 * Handle file upload.
 */
fileElement.addEventListener('change', function () {
    const file = this.files[0];
    const fileUploader = new FileUploader(file, 'http://localhost:8080/api/video/upload');
    progressInfoElement.innerText = '';
    fileProgressElement.setAttribute('aria-valuenow', 0);
    fileProgressElement.style.setProperty('width', 0);
    
    
    /**
     * Prevent navigation, when file uploaded or upload in progress.
     */
    window.onbeforeunload = function () {
        return "Are you sure you want to leave without saving the modifications?"
    }
    /**
     * Update DOM when a chunk is uploaded
     */
    fileUploader.addEventListener('chunkuploaded', function () {
        const uploadedPercentage = Math.ceil(this.getUploadedSize() * 100 / this.getFileSize());
        
        fileProgressElement.setAttribute('aria-valuenow', uploadedPercentage);
        fileProgressElement.style.setProperty('width', `${uploadedPercentage}%`);
        
        progressInfoElement.innerText = 'Uploading...'
        if (uploadedPercentage === 100) {
            progressInfoElement.innerText = 'Uploaded!';
        }
    });
    /**
     * If upload compelted update DOM and set videoId.
     */
    fileUploader.addEventListener('uploaded', function () {
        videoIdElement.value = this.getVideoId();
        submitElement.removeAttribute('disabled');
    });
    /**
     * Update DOM if upload failed
     */
    fileUploader.addEventListener('error', function () {
        progressInfoElement.innerText = 'Failed to upload video! Pleas try again later.';
    });
    /**
     * Start file upload
     */
    fileUploader.upload();
});