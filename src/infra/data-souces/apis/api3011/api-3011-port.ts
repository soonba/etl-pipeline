import { Injectable } from '@nestjs/common';
import { ReactiveDataSource } from '../../reactive-data-source';
import { DataEntity } from '../../../../domain/data.entity';
import { catchError, delay, EMPTY, from, Observable } from 'rxjs';
import axios from 'axios';
import { Api3011Response } from './api3011.response';
import { mergeMap } from 'rxjs/operators';
import { getDelayInMs } from '../rate-limit.util';
import { mapToEntity } from './map-to-entity';

@Injectable()
export class Api3011Port implements ReactiveDataSource {
  private readonly BASE_URL = 'http://localhost:3011';
  private readonly MAXIMUM_REQUEST_PER_SECOND = 1;

  //todo: 확장시 별도 db로 분리
  private lastPage = 1;

  fetch$(): Observable<DataEntity> {
    return from(axios.get<Api3011Response>(this.BASE_URL, { params: { page: this.lastPage } })).pipe(
      delay(getDelayInMs(this.MAXIMUM_REQUEST_PER_SECOND)),
      mergeMap((res) => {
        const { maxPage, data } = res.data;
        if (this.lastPage >= maxPage) {
          return EMPTY;
        }
        this.lastPage++;
        return from(data.map((item) => mapToEntity(item)));
      }),
      catchError((err) => {
        //todo: logger 통해서 남기도록 수정
        console.log(`페이지 ${this.lastPage} fetch 에러`, err);
        return EMPTY;
      }),
    );
  }
}
