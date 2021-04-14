import { environments } from 'src/environment';
import { Injectable, HttpService } from '@nestjs/common';
import * as FormData from 'form-data';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios'

@Injectable()
export class ImgurService {

    constructor(private httpC: HttpService) { }

    uploadToImgur(image: string): Observable<AxiosResponse<any>> {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('type', 'base64');
        return this.httpC.post(environments.imgurApiURL, formData, {
            headers: {
                'Authorization': 'Client-ID ' + environments.imgurApiClientID,
                ...formData.getHeaders()
            }
        });
    }

}
