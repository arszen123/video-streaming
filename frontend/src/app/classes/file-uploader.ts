import { HttpClient } from "@angular/common/http";

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

export function FileUploader(file: File, url: string, http: HttpClient) {
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
                setVideoId(res.videoId);
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
    function* uploadNextChunk(): any {
        while (chunkStart < fileSize) {
            const chunkEnds = Math.min(chunkStart + MAX_CHUNK_SIZE, fileSize) 
            const fd = new FormData();
            fd.append('chunk', file.slice(chunkStart, chunkEnds));
            if (videoId) {
                fd.append('videoId', videoId);
            }
            const res = new Promise((res, rej) => {
                http.post(
                    url,
                    fd, {
                    headers: {
                        'Content-Range': `bytes ${chunkStart}-${chunkEnds}/${fileSize}`,
                    }
                }).subscribe(value => {
                    res(value);
                }, err => {
                    rej(err)
                });
            }).then(tap(() => chunkStart = chunkEnds))

            yield res;
        }
    }
    function setVideoId(id) {
        if (!videoId) {
            videoId = id
        }
    }
}