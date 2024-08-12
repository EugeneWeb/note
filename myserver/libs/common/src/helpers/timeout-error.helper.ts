import { BadRequestException, RequestTimeoutException } from "@nestjs/common";
import { catchError, Observable, timeout, TimeoutError } from "rxjs";

export function handleTimeoutAndErrors<T = unknown>() {
    return (source$: Observable<T>) =>
        source$.pipe(
            timeout(5000),
            catchError((err) => {
                if(err instanceof TimeoutError) {
                    throw new RequestTimeoutException()
                }
                throw new BadRequestException(err)
            })
        )
}