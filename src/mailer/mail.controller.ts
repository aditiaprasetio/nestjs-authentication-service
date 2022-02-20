import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { EFeatureList } from '../services/feature.enum';

@ApiUseTags('Mail')
@Controller('mail')
// @UseGuards(RolesGuard)
@ApiBearerAuth()
export class MailController {
  constructor(public service: MailService) {}

  @Post('test')
  async send(): Promise<any> {
    const data = {
      user: {
        first_name: 'Aditia',
        last_name: 'Prasetio',
        name: 'Aditia Prasetio',
      },
    };
    return this.service.send('aditia.prasetio11@gmail.com', 'Forgot Password', data, EFeatureList.FORGOT_PASSWORD);
  }
}
