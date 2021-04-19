import { Controller, Get, HttpException, Query } from '@nestjs/common';
import { UriProcService } from './uri-proc.service';

@Controller('detail')
export class UriProcessorController {

    constructor(private uriSrv: UriProcService) {

    }

    @Get()
    public async getDetailOfUrl(@Query('url') url: string) {
        try {
            return this.uriSrv.getDetailOf(url);
        } catch(e) {
            throw new HttpException('failed fetch', 502);
        }
    }

}
