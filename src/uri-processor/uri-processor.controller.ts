import { Controller, Get, Query } from '@nestjs/common';
import { UriProcService } from './uri-proc.service';

@Controller('detail')
export class UriProcessorController {

    constructor(private uriSrv: UriProcService) {

    }

    @Get()
    public async getDetailOfUrl(@Query('url') url: string) {
        return this.uriSrv.getDetailOf(url);
    }

}
