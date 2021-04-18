import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthCheckController {

    @Get('')
    public getHealth() {
        return 'OK';
    }

}
