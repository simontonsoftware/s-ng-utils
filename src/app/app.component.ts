import { Component, Injector } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  DirectiveSuperclass,
  FormControlSuperclass,
  InjectableSuperclass,
  provideValueAccessor,
  WrappedFormControlSuperclass,
} from 's-ng-utils';

// used in a stackoverflow answer: https://stackoverflow.com/a/55091023/1836506

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'failure';
  location = { city: 'Portage', country: 'Michigan' };
  requiredFormControl = new FormControl('initial', Validators.required);

  constructor(injector: Injector) {
    // use each function once just to show in can be imported
    // tslint:disable:no-unused-expression
    new (class extends DirectiveSuperclass {})(injector);
    new (class extends InjectableSuperclass {})();
    provideValueAccessor(AppComponent);
    new (class extends FormControlSuperclass<string> {
      handleIncomingValue(): void {}
    })(injector);
    new (class extends WrappedFormControlSuperclass<string> {})(injector);

    this.title = 's-ng-utils-platform';
  }
}
