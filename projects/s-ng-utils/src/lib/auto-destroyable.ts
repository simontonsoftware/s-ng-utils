import { OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

export abstract class AutoDestroyable implements OnDestroy {
  destruction$ = new Subject();

  ngOnDestroy() {
    this.destruction$.next();
  }

  subscribeTo<T>(
    observable: Observable<T>,
    next?: (value: T) => void,
    error?: (error: any) => void,
    complete?: () => void,
  ) {
    observable
      .pipe(takeUntil(this.destruction$))
      .subscribe(this.bind(next), this.bind(error), this.bind(complete));
  }

  private bind(fn?: (val: any) => void) {
    return fn && fn.bind(this);
  }
}
