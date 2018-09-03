import { Component, Directive, Injectable } from "@angular/core";
import { ComponentFixtureAutoDetect, TestBed } from "@angular/core/testing";
import { Subject } from "rxjs";
import { AutoDestroyable } from "./auto-destroyable";

describe("AutoDestroyable", () => {
  it("cleans up subscriptions when destroyed by angular", () => {
    const subject = new Subject();
    TestBed.configureTestingModule({
      declarations: [DestroyableDirective, TestComponent],
      providers: [
        { provide: Subject, useValue: subject },
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    });

    const fixture = TestBed.createComponent(TestComponent);
    expect(subject.observers.length).toBe(2);

    fixture.componentInstance.showThings = false;
    fixture.detectChanges();
    expect(subject.observers.length).toBe(0);
  });
});

@Injectable()
class DestroyableService extends AutoDestroyable {}

@Directive({
  selector: `[sDestroyableDirective]`,
  providers: [DestroyableService],
})
class DestroyableDirective extends AutoDestroyable {
  constructor(subject: Subject<any>, service: DestroyableService) {
    super();
    this.subscribeTo(subject);
    service.subscribeTo(subject);
  }
}

@Component({
  template: `<p *ngIf="showThings" sDestroyableDirective>I'm showing.</p>`,
})
class TestComponent {
  showThings = true;
}
