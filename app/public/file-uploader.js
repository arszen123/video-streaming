function tap(fn) {
    return function (res) {
        fn(res);
        return res;
    }
}

/**
 * File uploader.
 * @param {File} file 
 * @param {string} url 
 */
function FileUploader(file, url) {
    const self = this;
    const eventListeners = ['chunkuploaded', 'uploaded', 'error'].reduce((a,c) => {a[c] = []; return a;}, {});
    const fileSize = file.size;
    const MAX_CHUNK_SIZE = 10 ** 6; // 1MB;
    let chunkStart = 0;
    let videoId;
    this.getFileSize = () => fileSize;
    this.getUploadedSize = () => chunkStart;
    this.getVideoId = () => videoId;
    this.addEventListener = function (event, cb) {
        if (typeof eventListeners[event] !== 'undefined') {
            eventListeners[event].push(cb);
        }
    }
    this.upload = function () {
        function uploadActualChunk() {
            setTimeout(() => uploadNextChunk()
                .then(tap(() => fireEvent('chunkuploaded', self)))
                .then(() => {
                    if (chunkStart < fileSize) {
                        return uploadActualChunk();
                    }
                    fireEvent('uploaded', self)
                })
                .catch((e) => fireEvent('error', self))
            , 200);
        }
        uploadActualChunk();
    }
    return this;

    function fireEvent(event, self) {
        eventListeners[event].forEach(listener => listener.call(self));
    }
    function uploadNextChunk() {
        const chunkEnds = Math.min(chunkStart + MAX_CHUNK_SIZE, fileSize) 
        const fd = new FormData();
        fd.append('chunk', file.slice(chunkStart, chunkEnds));
        if (videoId) {
            fd.append('videoId', videoId);
        }
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Range': `bytes ${chunkStart}-${chunkEnds}/${fileSize}`,
            },
            body: fd
        }).then(tap(() => chunkStart = chunkEnds))
        .then(tap(setVideoId));
    }
    function setVideoId(res) {
        res.json().then(data => {
            videoId = data.videoId;
        })
    }
}