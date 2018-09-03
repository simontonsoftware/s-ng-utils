import { Component } from "@angular/core";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { click, find, findButton } from "../test-helpers";
import { AutoDestroyable } from "./auto-destroyable";
import {
  FormControlSuperclass,
  provideValueAccessor,
} from "./form-control-superclass";

describe("FormControlSuperclass", () => {
  let fixture: ComponentFixture<TestComponent>;
  let el: HTMLElement;

  function init(initialAttrs?: Partial<TestComponent>) {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CounterComponent, TestComponent],
      providers: [{ provide: ComponentFixtureAutoDetect, useValue: true }],
    });
    fixture = TestBed.createComponent(TestComponent);
    Object.assign(fixture.componentInstance, initialAttrs);
    tick();
    el = fixture.nativeElement;
  }

  function incrementButton() {
    return find<HTMLButtonElement>(fixture, "s-counter-component button");
  }

  function toggleDisabledButton() {
    return findButton(fixture, "Toggle Disabled");
  }

  ///////

  it("provides help for 2-way binding", fakeAsync(() => {
    init({ value: 15 });
    expect(fixture.componentInstance.value).toBe(15);
    expect(fixture.nativeElement.innerText).toContain("15");

    click(incrementButton());
    expect(fixture.componentInstance.value).toBe(16);
    expect(fixture.nativeElement.innerText).toContain("16");
  }));

  it("provides help for `onTouched`", fakeAsync(() => {
    init();
    expect(fixture.nativeElement.innerText).not.toContain("Touched!");
    click(incrementButton());
    expect(fixture.nativeElement.innerText).toContain("Touched!");
  }));

  it("provides help for `[disabled]`", fakeAsync(() => {
    init({ shouldDisable: true });
    expect(incrementButton().disabled).toBe(true);

    click(toggleDisabledButton());
    expect(incrementButton().disabled).toBe(false);
  }));

  it("is autodestroyable", () => {
    const component = new CounterComponent();
    expect(component instanceof AutoDestroyable).toBe(true);
    expect(component.subscribeTo).toBeTruthy();
  });
});

@Component({
  template: `
    <s-counter-component
      [(ngModel)]="value"
      #counter="ngModel"
      [disabled]="shouldDisable"
    ></s-counter-component>
    <div *ngIf="counter.touched">Touched!</div>
    <button (click)="shouldDisable = !shouldDisable">Toggle Disabled</button>
  `,
})
class TestComponent {
  value = 0;
  shouldDisable = false;
}

@Component({
  selector: `s-counter-component`,
  template: `
    <button (click)="increment()" [disabled]="isDisabled">{{ counter }}</button>
  `,
  providers: [provideValueAccessor(CounterComponent)],
})
class CounterComponent extends FormControlSuperclass<number> {
  counter = 0;

  writeValue(value: number) {
    this.counter = value;
  }

  increment() {
    this.onChange(++this.counter);
    this.onTouched();
  }
}
