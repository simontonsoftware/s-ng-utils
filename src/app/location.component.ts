import { Component, Injector } from "@angular/core";
import { FormControlSuperclass, provideValueAccessor } from "s-ng-utils";

// used in a stackoverflow answer: https://stackoverflow.com/a/55091023/1836506

interface Location {
  city: string;
  country: string;
}

@Component({
  selector: "app-location",
  template: `
    City:
    <input
      [ngModel]="location?.city"
      (ngModelChange)="modifyLocation('city', $event)"
    />
    Country:
    <input
      [ngModel]="location?.country"
      (ngModelChange)="modifyLocation('country', $event)"
    />
  `,
  providers: [provideValueAccessor(LocationComponent)],
})
export class LocationComponent extends FormControlSuperclass<Location> {
  location!: Location;

  constructor(injector: Injector) {
    super(injector);
  }

  handleIncomingValue(value: Location) {
    this.location = value;
  }

  modifyLocation<K extends keyof Location>(field: K, value: Location[K]) {
    this.location = { ...this.location, [field]: value };
    this.emitOutgoingValue(this.location);
  }
}
