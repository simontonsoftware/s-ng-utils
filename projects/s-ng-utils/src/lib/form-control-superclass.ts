import { Type } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { Function0, Function1, noop } from "micro-dash";
import { AutoDestroyable } from "./auto-destroyable";

export function provideValueAccessor(type: Type<any>) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: type,
    multi: true,
  };
}

export abstract class FormControlSuperclass<T> extends AutoDestroyable
  implements ControlValueAccessor {
  onChange: (value: T) => void = noop;
  onTouched = noop;
  isDisabled = false;

  abstract writeValue(value: T): void;

  registerOnChange(fn: Function1<T, void>) {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function0<void>) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.isDisabled = isDisabled;
  }
}
