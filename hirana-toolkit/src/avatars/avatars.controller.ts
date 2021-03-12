import { AvatarService } from './avatar.service';
import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';


@Controller('avatar')
export class AvatarsController {

    constructor(private avatarSrv: AvatarService) {}

    @Get('')
    public getAvatar(@Req() request: Request, @Res() response: Response, @Query('usr') user: string) {
        this.avatarSrv.getAvatarOfUser(user).then(r => {
            response.type(r.type);
            response.send(r.body);
        }).catch(e => {
            response.status(500).send('Internal exception: ' + e);
        });
    }

}
