import { ImgurService } from './imgur.service';
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricCollectorService, SchemaDataType } from 'src/utils/metric-collector/metric-collector.service';

@Controller('upload')
export class ImgurApiController {

    constructor(private imgurSrv: ImgurService, private metricCollector: MetricCollectorService) {
        this.metricCollector.setMetricSchema('imgurApi', { // tags:
            error: ['no', 'yes'],
            status: ['OK', 'BAD_REQUEST', 'BAD_GATEWAY']
        },{ // Data of this request:
            link: SchemaDataType.INTEGER,
            etype: SchemaDataType.INTEGER
        });
    }

    @Post()
    public name(@Res() response: Response, @Body() body: ImageInput) {
        this.imgurSrv.uploadToImgur(body.image).subscribe(r => {
            if(r.data.data) {
                response.send({image: r.data.data.link});
                this.metricCollector.writeMetric('imgurApi', {error: 'no'}, {link: r.data.data.link, status: 'OK'});
            } else {
                response.status(400).send({error: 'IMGUR RESPONSE FORMAT ERROR.'});
                this.metricCollector.writeMetric('imgurApi', {error: 'yes'}, {etype: 'INVALID-FORMAT', status: 'BAD_REQUEST'});
            }
        }, e => {
            response.status(502).send({error: 'IMGUR ERROR.'});
            this.metricCollector.writeMetric('imgurApi', {error: 'yes'}, {etype: 'IMGUR-SERVICE-ERROR', status: 'BAD_GATEWAY'});
        })
    }

}

interface ImageInput {
    image: string;
}