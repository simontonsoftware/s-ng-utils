import { OnDestroy } from "@angular/core";
import { SubscriptionManager } from "s-rxjs-utils";

/**
 * Use as the superclass for anything managed by angular's dependency injection for care-free use of `subscribeTo()`. It simply calls `unsubscribe()` during `ngOnDestroy()`. If you override `ngOnDestroy()` in your subclass, be sure to invoke the super implementation.
 *
 * ```ts
 * @Injectable()
 * // or @Component()
 * // or @Directive()
 * // or @Pipe()
 * class MyThing extends AutoDestroyable {
 *   constructor(somethingObservable: Observable) {
 *     super();
 *     this.subscribeTo(somethingObservable);
 *   }
 *
 *   ngOnDestroy() {
 *     // if you override ngOnDestroy, be sure to call this too
 *     super.ngOnDestroy();
 *   }
 * }
 * ```
 */
export abstract class AutoDestroyable extends SubscriptionManager
  implements OnDestroy {
  ngOnDestroy() {
    this.unsubscribe();
  }
}