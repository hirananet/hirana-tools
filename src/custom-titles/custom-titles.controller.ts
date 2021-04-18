import { Controller, Get, Query} from '@nestjs/common';
import { CustomTitlesService } from './custom-titles.service';

@Controller('customr')
export class CustomTitlesController {

    constructor(private cusTtlSrv: CustomTitlesService) {
        
    }

    @Get('')
    public async getCustomRange(@Query('usr') user: string, @Query('chn') channel: string) {
        let rData = await this.cusTtlSrv.getChannelCustom(channel, user);
        if(!rData) {
            rData = await this.cusTtlSrv.getGlobalCustom(user);
        }
        if(!rData) {
            return {
                exists: false
            }
        } else {
            return {
                exists: true,
                color: rData.color,
                rango: rData.rango
            }
        }
    }

}
