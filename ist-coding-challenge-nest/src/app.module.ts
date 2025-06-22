import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VatModule } from './vat-checker/vat.module';

@Module({
  imports: [VatModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
