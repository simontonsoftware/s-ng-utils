import {
  OnChanges,
  SimpleChanges,
  Injector,
  ChangeDetectorRef,
} from "@angular/core";
import { keys } from "micro-dash/lib/object/keys";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";
import { AutoDestroyable } from "./auto-destroyable";

/**
 * Extend this when creating a directive (including a component, which is a kind of directive) to gain access to the helpers demonstrated below. **Warning:** You _must_ include a constructor in your subclass.
 *
 * ```ts
 * @Component({
 *   selector: "s-color-text",
 *   template: `
 *     <span [style.background]="color">{{ color }}</span>
 *   `,
 *   // note that `bindToInstance()` works even with OnPush change detection
 *   changeDetection: ChangeDetectionStrategy.OnPush,
 * })
 *  class ColorTextComponent extends DirectiveSuperclass {
 *   @Input() prefix?: string;
 *   @Input() prefix2?: string;
 *   color!: string;
 *
 *   // Even if you don't need extra arguments injector, you must still include a constructor. It is required for angular to provide `Injector`.
 *   constructor(
 *     @Inject("color$") color$: Observable<string>,
 *     injector: Injector,
 *   ) {
 *     super(injector);
 *
 *     // combine everything to calculate `color` and keep it up to date
 *     this.bindToInstance(
 *       "color",
 *       combineLatest(
 *         this.getInput$("prefix"),
 *         this.getInput$("prefix2"),
 *         color$,
 *       ).pipe(map((parts) => parts.filter((p) => p).join(""))),
 *     );
 *   }
 * }
 * ```
 */
export abstract class DirectiveSuperclass extends AutoDestroyable
  implements OnChanges {
  /** Emits the set of `@Input()` property names that change during each call to `ngOnChanges()`. */
  // lastChangedKeys$ = new Subject<Set<keyof this>>();
  lastChangedKeys$ = new BehaviorSubject<Set<keyof this>>(new Set());

  protected changeDetectorRef: ChangeDetectorRef;

  constructor(injector: Injector) {
    super();
    this.changeDetectorRef = injector.get(ChangeDetectorRef);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.lastChangedKeys$.next(
      new Set(Object.getOwnPropertyNames(changes) as Array<keyof this>),
    );
  }

  /** @return an observable of the values for one of this directive's `@Input()` properties */
  getInput$<K extends keyof this>(key: K): Observable<this[K]> {
    return this.lastChangedKeys$.pipe(
      filter((keys) => keys.has(key)),
      map(() => this[key]),
    );
  }

  /**
   *  Binds an observable to one of this directive's instance variables. When the observable emits the instance variable will be updated, and change detection will be triggered to propagate any changes. Use this an an alternative to repeating `| async` multiple times in your template. */
  bindToInstance<K extends keyof this>(key: K, value$: Observable<this[K]>) {
    this.subscribeTo(value$, (value) => {
      this[key] = value;
      this.changeDetectorRef.markForCheck();
    });
  }
}
