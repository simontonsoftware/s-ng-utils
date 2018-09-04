import { FormControl } from "@angular/forms";
import { FormControlSuperclass } from "./form-control-superclass";

/**
 *
 */
export abstract class WrappedFormControlSuperclass<
  OuterType,
  InnerType = OuterType
> extends FormControlSuperclass<OuterType> {
  formControl = new FormControl();

  constructor() {
    super();
    this.subscribeTo(this.formControl.valueChanges, (value) => {
      this.onChange(this.innerToOuter(value));
    });
  }

  writeValue(value: OuterType) {
    this.formControl.setValue(this.outerToInner(value), { emitEvent: false });
  }

  setDisabledState(isDisabled: boolean) {
    super.setDisabledState(this.isDisabled);
    if (isDisabled) {
      this.formControl.disable({ emitEvent: false });
    } else {
      this.formControl.enable({ emitEvent: false });
    }
  }

  protected outerToInner(value: OuterType): InnerType {
    return (value as any) as InnerType;
  }

  protected innerToOuter(value: InnerType): OuterType {
    return (value as any) as OuterType;
  }
}
