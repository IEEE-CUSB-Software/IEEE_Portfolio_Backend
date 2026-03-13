import { PartialType } from '@nestjs/swagger';
import { CreateCommitteeDto } from './create-committee.dto';

export class UpdateCommitteeDto extends PartialType(CreateCommitteeDto) {}
