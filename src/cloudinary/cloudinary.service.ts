import { Injectable } from '@nestjs/common'
import { UploadApiOptions, UploadApiResponse, v2 } from 'cloudinary'
import toStream = require('buffer-to-stream')

@Injectable()
export class CloudinaryService {
  uploadImage(file: Express.Multer.File, options?: UploadApiOptions): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream({ ...options }, (error, result) => {
        if (error) return reject(error)
        if (result) resolve(result)
      })
      toStream(file.buffer).pipe(upload)
    })
  }
}
