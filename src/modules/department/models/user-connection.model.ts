import { ObjectType } from '@nestjs/graphql'
import PaginatedResponse from '../../../common/pagination/pagination'
import { Department } from 'src/@generated/department/department.model'

@ObjectType()
export class DepartmentConnection extends PaginatedResponse(Department) {}
