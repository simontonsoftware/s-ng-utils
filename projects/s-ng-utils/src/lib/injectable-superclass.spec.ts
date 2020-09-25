import { Component, Directive, Injectable } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { expectSingleCallAndReset } from 's-ng-dev-utils';
import { ComponentContext } from '../to-replace/component-context';
import { InjectableSuperclass } from './injectable-superclass';

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
  template: `<p *ngIf="showThings" sDestroyableDirective>I'm showing.</p>`,
})
class TestComponent {
  showThings = true;
}

class TestComponentContext extends ComponentContext<TestComponent> {
  subject = new Subject();

  protected componentType = TestComponent;

  constructor() {
    super({ declarations: [DestroyableDirective, TestComponent] });
    TestBed.overrideProvider(Subject, { useValue: this.subject });
  }
}

describe('InjectableSuperclass', () => {
  let ctx: TestComponentContext;
  beforeEach(async () => {
    ctx = new TestComponentContext();
  });

  it('cleans up subscriptions when destroyed by angular', () => {
    ctx.run(() => {
      expect(ctx.subject.observers.length).toBe(2);

      ctx.fixture.componentInstance.showThings = false;
      ctx.fixture.detectChanges();
      expect(ctx.subject.observers.length).toBe(0);
    });
  });

  it('has .destruction$ which emits and completes upon destruction', () => {
    const next = jasmine.createSpy();
    const complete = jasmine.createSpy();
    ctx.run(() => {
      const host = ctx.fixture.debugElement.query(
        By.directive(DestroyableDirective),
      );
      const service = host.injector.get(DestroyableService);
      service.destruction$.subscribe({ next, complete });

      ctx.fixture.componentInstance.showThings = false;
      ctx.fixture.detectChanges();
      expectSingleCallAndReset(next, undefined);
      expectSingleCallAndReset(complete);
    });
  });
});
