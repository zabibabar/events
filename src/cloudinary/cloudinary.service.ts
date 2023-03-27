import { Injectable } from '@nestjs/common'
import { UploadApiOptions, UploadApiResponse, v2 } from 'cloudinary'
import toStream = require('buffer-to-stream')

@Injectable()
export class CloudinaryService {
  uploadImage(
    file: Express.Multer.File | string,
    options?: UploadApiOptions
  ): Promise<UploadApiResponse> {
    if (typeof file === 'string') return this.uploadImageString(file, options)
    return this.uploadFile(file, options)
  }

  private uploadImageString(file: string, options?: UploadApiOptions): Promise<UploadApiResponse> {
    return v2.uploader.upload(file, { ...options })
  }

  private uploadFile(
    file: Express.Multer.File,
    options?: UploadApiOptions
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream({ ...options }, (error, result) => {
        if (error) reject(error)
        if (result) resolve(result)
      })
      toStream(file.buffer).pipe(upload)
    })
  }
}
