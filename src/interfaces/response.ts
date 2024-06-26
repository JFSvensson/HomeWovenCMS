import { Response as ExpressResponse } from 'express'

export interface Response extends ExpressResponse {
  jsonOverridden?: boolean
  json(data: any): any
}
