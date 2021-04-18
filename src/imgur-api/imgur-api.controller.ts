import { ImgurService } from './imgur.service';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricCollectorService } from 'src/utils/core-utils/metric-collector/metric-collector.service';
import { RealIP } from 'nestjs-real-ip';

@Controller('upload')
export class ImgurApiController {

    constructor(private imgurSrv: ImgurService, private metricCollector: MetricCollectorService) { }

    @Post()
    public name(@Res() response: Response, @Body() body: ImageInput, @RealIP() ip: string) {
        let size = body.image.length;
        this.imgurSrv.uploadToImgur(body.image).subscribe(r => {
            if(r.data.data) {
                this.metricCollector.writeMetric('imgur-api', {
                    size,
                    ip
                }, {
                    status: 'ok'
                });
                response.send({image: r.data.data.link});
            } else {
                this.metricCollector.writeMetric('imgur-api', { type: 'format-error', ip, size}, { status: 'err' });
                response.status(400).send({error: 'IMGUR RESPONSE FORMAT ERROR.'});
            }
        }, e => {
            this.metricCollector.writeMetric('imgur-api', { type: 'bad-gateway', ip, size }, { status: 'err' });
            response.status(502).send({error: 'IMGUR ERROR.'});
        })
    }

}

interface ImageInput {
    image: string;
}