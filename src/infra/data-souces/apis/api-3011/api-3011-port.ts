import { Injectable } from '@nestjs/common';
import { DataSource } from '../../data-source';
import { catchError, concatMap, delay, EMPTY, from, range, switchMap } from 'rxjs';
import axios from 'axios';
import { Api3011Response } from './api-3011.response';
import { getDelayInMs } from '../rate-limit.util';
import { mergeMap } from 'rxjs/operators';
import { mapToEntity } from './map-to-entity';

@Injectable()
export class Api3011Port implements DataSource {
  private readonly KEY = 'api-3011';
  private readonly BASE_URL = 'http://localhost:3011';
  private readonly MAXIMUM_REQUEST_PER_SECOND = 1;

  fetch$(lastPage: number) {
    return from(axios.get<Api3011Response>(this.BASE_URL, { params: { page: lastPage } })).pipe(
      switchMap(({ data: { maxPage } }) => {
        console.log('이번 대상', lastPage, ' ', maxPage - lastPage);
        return range(lastPage, maxPage - lastPage).pipe(
          concatMap((page) =>
            from(axios.get<Api3011Response>(this.BASE_URL, { params: { page } })).pipe(
              delay(getDelayInMs(this.MAXIMUM_REQUEST_PER_SECOND)),
              mergeMap(({ data: { data: fetched } }) => fetched.map((fetch) => mapToEntity(this.KEY, fetch))),
              catchError((err) => {
                console.error(err);
                return EMPTY;
              }),
            ),
          ),
        );
      }),
    );
  }
  getKey(): string {
    return this.KEY;
  }
}
