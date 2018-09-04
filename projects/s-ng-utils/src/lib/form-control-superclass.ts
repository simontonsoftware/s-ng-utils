import { Type, Injector, ChangeDetectorRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Function0, Function1, noop } from "micro-dash";
import { AutoDestroyable } from "./auto-destroyable";

/**
 * Use in the `providers` of a component that implements `ControlValueAccessor` to reduce some boilerplate.
 *
 * ```ts
 * @Component({ providers: [provideValueAccessor(MyFormControl)] }
 * class MyFormControl extends BaseFormControl {
 *   // ...
 * }
 */
export function provideValueAccessor(type: Type<any>) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: type,
    multi: true,
  };
}

/**
 * Extend this when creating a form control to reduce some boilerplate. **Special note:** You _must_ include a constructor in your subclass.
 *
 * This example allows 2-way binding to a number via `[(ngModel)]`, `[formControl]`, or any other technique that leverages the `ControlValueAccessor` interface.
 * ```ts
 * @Component({
 *   template: `
 *     <button (click)="increment()" [disabled]="isDisabled">{{ counter }}</button>
 *   `,
 *   providers: [provideValueAccessor(CounterComponent)],
 * })
 * class CounterComponent extends FormControlSuperclass<number> {
 *   counter = 0;
 *
 *   // This looks unnecessary, but is required for Angular to provide `Injector`
 *   constructor(injector: Injector) {
 *     super(injector);
 *   }
 *
 *   handleIncomingValue(value: number) {
 *     this.counter = value;
 *   }
 *
 *   increment() {
 *     this.emitOutgoingValue(++this.counter);
 *     this.onTouched();
 *   }
 * }
 * ```
 */
export abstract class FormControlSuperclass<T> extends AutoDestroyable
  implements ControlValueAccessor {
  /** Call this to emit a new value when it changes. */
  emitOutgoingValue: (value: T) => void = noop;

  /** Call this to "commit" a change, traditionally done e.g. on blur. */
  onTouched = noop;

  /** You can bind to this in your template as needed. */
  isDisabled = false;

  private changeDetectorRef: ChangeDetectorRef;

  constructor(injector: Injector) {
    super();
    this.changeDetectorRef = injector.get(ChangeDetectorRef);
  }

  /** Implement this to handle a new value coming in from outside. */
  abstract handleIncomingValue(value: T): void;

  /** Called as angular propagates values changes to this `ControlValueAccessor`. */
  writeValue(value: T) {
    this.handleIncomingValue(value);
    this.changeDetectorRef.markForCheck();
  }

  /** Called as angular sets up the binding to this `ControlValueAccessor`. */
  registerOnChange(fn: Function1<T, void>) {
    this.emitOutgoingValue = fn;
  }

  /** Called as angular sets up the binding to this `ControlValueAccessor`. */
  registerOnTouched(fn: Function0<void>) {
    this.onTouched = fn;
  }

  /** Called as angular propagates disabled changes to this `ControlValueAccessor`. */
  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
    this.changeDetectorRef.markForCheck();
  }
}
