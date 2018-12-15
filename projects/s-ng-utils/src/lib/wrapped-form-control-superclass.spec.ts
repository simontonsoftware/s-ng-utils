import { ChangeDetectionStrategy, Component, Injector } from "@angular/core";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  fakeAsync,
  flushMicrotasks,
  TestBed,
} from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { click, find, findButton, setValue } from "../test-helpers";
import { AutoDestroyable } from "./auto-destroyable";
import { provideValueAccessor } from "./form-control-superclass";
import { WrappedFormControlSuperclass } from "./wrapped-form-control-superclass";

describe("WrappedFormControlSuperclass", () => {
  let fixture: ComponentFixture<TestComponent>;
  let el: HTMLElement;

  function init(initialAttrs?: Partial<TestComponent>) {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [DateComponent, StringComponent, TestComponent],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    });
    fixture = TestBed.createComponent(TestComponent);
    Object.assign(fixture.componentInstance, initialAttrs);
    fixture.detectChanges();
    flushMicrotasks();
    el = fixture.nativeElement;
  }

  function stringInput() {
    return find<HTMLInputElement>(fixture, "s-string-component input");
  }

  function dateInput() {
    return find<HTMLInputElement>(fixture, "s-date-component input");
  }

  function toggleDisabledButton() {
    return findButton(fixture, "Toggle Disabled");
  }

  ///////

  it("provides help for 2-way binding", fakeAsync(() => {
    init({ string: "initial value" });
    expect(stringInput().value).toBe("initial value");

    setValue(stringInput(), "edited value");
    expect(fixture.componentInstance.string).toBe("edited value");
  }));

  it("can translate between inner and outer values", fakeAsync(() => {
    init({ date: new Date("2018-09-03T21:00Z") });
    expect(dateInput().value).toBe("2018-09-03T21:00");

    setValue(dateInput(), "1980-11-04T10:00");
    expect(fixture.componentInstance.date).toEqual(
      new Date("1980-11-04T10:00Z"),
    );
  }));

  it("provides help for `onTouched`", fakeAsync(() => {
    init();
    expect(fixture.nativeElement.innerText).not.toContain("Touched!");
    stringInput().dispatchEvent(new Event("blur"));
    expect(fixture.nativeElement.innerText).toContain("Touched!");
  }));

  it("provides help for `[disabled]`", fakeAsync(() => {
    init({ shouldDisable: true });
    expect(stringInput().disabled).toBe(true);

    click(toggleDisabledButton());
    expect(stringInput().disabled).toBe(false);

    click(toggleDisabledButton());
    expect(stringInput().disabled).toBe(true);
  }));

  it("does not emit after an incoming change", fakeAsync(() => {
    init();
    expect(fixture.componentInstance.emissions).toBe(0);

    setValue(stringInput(), "changed from within");
    expect(fixture.componentInstance.emissions).toBe(1);

    fixture.componentInstance.string = "changed from without";
    fixture.detectChanges();
    flushMicrotasks();
    expect(fixture.componentInstance.emissions).toBe(1);

    click(toggleDisabledButton());
    click(toggleDisabledButton());
    expect(fixture.componentInstance.emissions).toBe(1);
  }));

  it("is autodestroyable", fakeAsync(() => {
    init();
    const string = fixture.debugElement.query(By.directive(StringComponent))
      .componentInstance;
    expect(string instanceof AutoDestroyable).toBe(true);
    expect(string.subscribeTo).toBeTruthy();
  }));
});

@Component({
  template: `
    <s-string-component
      [(ngModel)]="string"
      (ngModelChange)="emissions = emissions + 1"
      #stringControl="ngModel"
      [disabled]="shouldDisable"
    ></s-string-component>
    <div *ngIf="stringControl.touched">Touched!</div>
    <button (click)="shouldDisable = !shouldDisable">Toggle Disabled</button>
    <hr />
    <s-date-component [(ngModel)]="date"></s-date-component>
  `,
})
class TestComponent {
  emissions = 0;
  string = "";
  date = new Date();
  shouldDisable = false;
}

@Component({
  selector: `s-string-component`,
  template: `
    <input [formControl]="formControl" />
  `,
  providers: [provideValueAccessor(StringComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class StringComponent extends WrappedFormControlSuperclass<string> {
  constructor(injector: Injector) {
    super(injector);
  }
}

@Component({
  selector: `s-date-component`,
  template: `
    <input type="datetime-local" [formControl]="formControl" />
  `,
  providers: [provideValueAccessor(DateComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class DateComponent extends WrappedFormControlSuperclass<Date, string> {
  constructor(injector: Injector) {
    super(injector);
  }

  protected innerToOuter(value: string): Date {
    return new Date(value + "Z");
  }

  protected outerToInner(value: Date): string {
    if (value === null) {
      return ""; // happens during initialization
    }
    return value.toISOString().substr(0, 16);
  }
}
