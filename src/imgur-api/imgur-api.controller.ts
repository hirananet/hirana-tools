import { ImgurService } from './imgur.service';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('upload')
export class ImgurApiController {

    constructor(private imgurSrv: ImgurService) { }

    @Post()
    public name(@Res() response: Response, @Body() body: ImageInput) {
        this.imgurSrv.uploadToImgur(body.image).subscribe(r => {
            response.send({image: r.data.data.link});
        }, e => {
            response.status(400).send({error: 'IMGUR ERROR.'});
        })
    }

}

interface ImageInput {
    image: string;
}