// todo refactor.
function tap(fn) {
    return function (res) {
        fn(res);
        return res;
    }
}

type EventType = 'chunkuploaded' | 'uploaded' | 'error';
export interface IFileUploader {
    getFileSize(): number;
    getUploadedSize(): number;
    getVideoId(): any;
    addEventListener(event: EventType, cb: CallableFunction): void;
    upload(): Promise<void>;
}
/**
 * File uploader.
 * @param {File} file 
 * @param {string} url 
 */
export function FileUploader(file, url) {
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
    this.upload = async function () {
        try {
            for await (const res of uploadNextChunk()) {
                if (!res.ok) {
                    throw new Error('Upload failed!');
                }
                setVideoId((await res.json()).videoId);
                fireEvent('chunkuploaded', self);
            }
            fireEvent('uploaded', self);
        } catch (e) {
            fireEvent('error', self);
        }
    }
    return this;

    function fireEvent(event, self) {
        eventListeners[event].forEach(listener => listener.call(self));
    }
    /**
     * @returns {Response[]}
     */
    function* uploadNextChunk() {
        while (chunkStart < fileSize) {
            const chunkEnds = Math.min(chunkStart + MAX_CHUNK_SIZE, fileSize) 
            const fd = new FormData();
            fd.append('chunk', file.slice(chunkStart, chunkEnds));
            if (videoId) {
                fd.append('videoId', videoId);
            }
            yield fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Range': `bytes ${chunkStart}-${chunkEnds}/${fileSize}`,
                },
                body: fd
            }).then(tap(() => chunkStart = chunkEnds))
        }
    }
    function setVideoId(id) {
        if (!videoId) {
            videoId = id
        }
    }
}