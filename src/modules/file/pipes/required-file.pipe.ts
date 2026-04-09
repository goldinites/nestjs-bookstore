import { ParseFilePipeBuilder } from '@nestjs/common';

export function RequiredFilePipe() {
  return new ParseFilePipeBuilder().build({ fileIsRequired: true });
}
