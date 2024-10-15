import { IsEnum } from 'class-validator';
import { ROLE } from 'src/common/enums';

export class CreateRoleDto {
  @IsEnum(ROLE)
  roleName: ROLE;
}
