import { ImgurService } from './imgur.service';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricCollectorService } from 'src/utils/metric-collector/metric-collector.service';

@Controller('upload')
export class ImgurApiController {

    constructor(private imgurSrv: ImgurService, private metricCollector: MetricCollectorService) { }

    @Post()
    public name(@Res() response: Response, @Body() body: ImageInput) {
        this.imgurSrv.uploadToImgur(body.image).subscribe(r => {
            if(r.data.data) {
                response.send({image: r.data.data.link});
                this.metricCollector.writeMetric('imgur-api', {status: 'OK'});
            } else {
                response.status(400).send({error: 'IMGUR RESPONSE FORMAT ERROR.'});
                this.metricCollector.writeMetric('imgur-api', {status: 'NOK'});
            }
        }, e => {
            response.status(500).send({error: 'IMGUR ERROR.'});
            this.metricCollector.writeMetric('imgur-api', {status: 'ERROR'});
        })
    }

}

interface ImageInput {
    image: string;
}