import { SetMetadata } from '@nestjs/common';
import { ROLE } from 'src/common/enums';

export const Roles = (...roles: ROLE[]) => SetMetadata('roles', roles);
