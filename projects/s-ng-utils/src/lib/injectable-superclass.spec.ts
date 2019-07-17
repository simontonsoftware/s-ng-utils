import { Component, Directive, Injectable } from "@angular/core";
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  TestBed,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { expectSingleCallAndReset } from "s-ng-dev-utils";
import { InjectableSuperclass } from "./injectable-superclass";

@Injectable()
class DestroyableService extends InjectableSuperclass {}

@Directive({
  selector: `[sDestroyableDirective]`,
  providers: [DestroyableService],
})
class DestroyableDirective extends InjectableSuperclass {
  constructor(subject: Subject<any>, public service: DestroyableService) {
    super();
    this.subscribeTo(subject);
    service.subscribeTo(subject);
  }
}

@Component({
  template: `
    <p *ngIf="showThings" sDestroyableDirective>I'm showing.</p>
  `,
})
class TestComponent {
  showThings = true;
}

describe("InjectableSuperclass", () => {
  let subject: Subject<void>;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    subject = new Subject();
    TestBed.configureTestingModule({
      declarations: [DestroyableDirective, TestComponent],
      providers: [
        { provide: Subject, useValue: subject },
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    });
    await TestBed.compileComponents();

    fixture = TestBed.createComponent(TestComponent);
  });

  it("cleans up subscriptions when destroyed by angular", () => {
    expect(subject.observers.length).toBe(2);

    fixture.componentInstance.showThings = false;
    fixture.detectChanges();
    expect(subject.observers.length).toBe(0);
  });

  it("has .destruction$ which emits and completes upon destruction", () => {
    const next = jasmine.createSpy();
    const complete = jasmine.createSpy();
    const host = fixture.debugElement.query(By.directive(DestroyableDirective));
    const service = host.injector.get(DestroyableService);
    service.destruction$.subscribe({ next, complete });

    fixture.componentInstance.showThings = false;
    fixture.detectChanges();
    expectSingleCallAndReset(next, undefined);
    expectSingleCallAndReset(complete);
  });
});
