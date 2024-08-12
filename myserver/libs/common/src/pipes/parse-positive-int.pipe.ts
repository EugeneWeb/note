import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParsePositiveNumPipe implements PipeTransform {
  transform(val: number): number {
    if (val < 1) {
      throw new BadRequestException(`Ошибка при валидации. Значение должно быть целым числом и больше либо равно 1.`);
    }
    return val;
  }
}