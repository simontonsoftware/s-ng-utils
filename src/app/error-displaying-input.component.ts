import { Component, Injector, Self } from "@angular/core";
import { NgControl } from "@angular/forms";
import { WrappedFormControlSuperclass } from "s-ng-utils";

// used to answer https://github.com/simontonsoftware/s-ng-utils/issues/4#issuecomment-484048187

@Component({
  selector: "app-error-displaying-input",
  template: `
    <input [formControl]="formControl" />
    <div *ngIf="control.errors?.required">I'm required!</div>
  `,
})
export class ErrorDisplayingInputComponent extends WrappedFormControlSuperclass<
  string
> {
  constructor(@Self() public control: NgControl, injector: Injector) {
    super(injector);
    control.valueAccessor = this;
  }
}
