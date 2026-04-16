import { Injectable } from "@nestjs/common";
import { Uploader } from "@/domain/forum/application/storage/uploader.js";

@Injectable()
export class LocalUploader implements Uploader {
    async upload({ fileName }: any) {
        return {
            url: `http://localhost/files/${fileName}`,
        }
    }
}