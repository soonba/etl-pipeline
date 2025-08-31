import * as dayjs from 'dayjs';
import { Api3011Data, Api3011LogStatus } from './api-3011.response';
import { LogLevel } from '../../../../domain/vo/log-level';
import { DataEntity } from '../../../../domain/data.entity';

export const mapStatusToLevel = (status: Api3011LogStatus): LogLevel => {
  if (status === 'SUCCESS') {
    return LogLevel.INFO;
  } else {
    return LogLevel.ERROR;
  }
};

export const mapToEntity = (api3011Data: Api3011Data): DataEntity => {
  const { date, status, node, detail } = api3011Data;
  return {
    source: 'api-3011',
    level: mapStatusToLevel(status),
    message: node + detail,
    timestamp: date ? dayjs(date).toDate() : null,
  };
};
