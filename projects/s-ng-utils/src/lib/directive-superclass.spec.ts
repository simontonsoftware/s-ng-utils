import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
} from '@angular/core';
import {
  ComponentFixture,
  ComponentFixtureAutoDetect,
  fakeAsync,
  flushMicrotasks,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { expectSingleCallAndReset } from 's-ng-dev-utils';
import { click, find, findButton } from '../test-helpers';
import { DirectiveSuperclass } from './directive-superclass';

@Component({
  template: `
    <button (click)="toggle('prefix', 'Dark')">Dark</button>
    <button (click)="toggle('prefix2', 'Slate')">Slate</button>
    <button (click)="toggle('prefix', 'Dark'); toggle('prefix2', 'Slate')">
      Both
    </button>
    <button (click)="hide = !hide">Hide</button>
    <s-color-text
      *ngIf="!hide"
      [prefix]="prefix"
      [prefix2]="prefix2"
    ></s-color-text>
  `,
})
class TestComponent {
  color$ = new BehaviorSubject<string>('Green');
  prefix?: string;
  prefix2?: string;
  hide = false;

  toggle(key: 'prefix' | 'prefix2', value: string): void {
    this[key] = this[key] ? undefined : value;
  }
}

@Component({
  selector: 's-color-text',
  template: ` <span [style.background]="color">{{ color }}</span> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ColorTextComponent extends DirectiveSuperclass {
  @Input() prefix?: string;
  @Input() prefix2?: string;
  @Input() unspecified?: string;
  color!: string;

  constructor(
    @Inject('color$') color$: Observable<string>,
    injector: Injector,
  ) {
    super(injector);
    this.bindToInstance(
      'color',
      combineLatest([
        this.getInput$('prefix'),
        this.getInput$('prefix2'),
        color$,
      ]).pipe(map((parts) => parts.filter((p) => p).join(''))),
    );
  }
}

describe('DirectiveSuperclass', () => {
  let fixture: ComponentFixture<TestComponent>;
  let color$: BehaviorSubject<string>;
  let colorTextComponent: ColorTextComponent;

  function init(initialAttrs?: Partial<TestComponent>): void {
    color$ = new BehaviorSubject('Grey');
    TestBed.configureTestingModule({
      declarations: [ColorTextComponent, TestComponent],
      providers: [
        { provide: 'color$', useValue: color$ },
        { provide: ComponentFixtureAutoDetect, useValue: true },
      ],
    });
    fixture = TestBed.createComponent(TestComponent);
    Object.assign(fixture.componentInstance, initialAttrs);
    fixture.detectChanges();
    flushMicrotasks();
    colorTextComponent = fixture.debugElement.query(
      By.directive(ColorTextComponent),
    ).componentInstance;
  }

  function darkButton(): HTMLButtonElement {
    return findButton(fixture, 'Dark');
  }

  function slateButton(): HTMLButtonElement {
    return findButton(fixture, 'Slate');
  }

  function bothButton(): HTMLButtonElement {
    return findButton(fixture, 'Both');
  }

  function hideButton(): HTMLButtonElement {
    return findButton(fixture, 'Hide');
  }

  function colorSpan(): HTMLSpanElement {
    return find<HTMLSpanElement>(fixture, 's-color-text span');
  }

  /////////

  describe('.inputChanges$', () => {
    it('emits the keys that change', fakeAsync(() => {
      init();
      const stub = jasmine.createSpy();
      colorTextComponent.inputChanges$.subscribe(stub);
      expect(stub).not.toHaveBeenCalled();

      click(darkButton());
      expectSingleCallAndReset(stub, new Set(['prefix']));

      click(slateButton());
      expectSingleCallAndReset(stub, new Set(['prefix2']));

      click(bothButton());
      expectSingleCallAndReset(stub, new Set(['prefix', 'prefix2']));
    }));
  });

  describe('.getInput$()', () => {
    it('emits the value of an input when it changes', fakeAsync(() => {
      init();
      const stub = jasmine.createSpy();
      colorTextComponent.getInput$('prefix2').subscribe(stub);
      expect(stub).toHaveBeenCalledTimes(1);
      expect(stub.calls.argsFor(0)).toEqual([undefined]);

      click(darkButton());
      expect(stub).toHaveBeenCalledTimes(1);

      click(slateButton());
      expect(stub).toHaveBeenCalledTimes(2);
      expect(stub.calls.argsFor(1)).toEqual(['Slate']);

      click(bothButton());
      expect(stub).toHaveBeenCalledTimes(3);
      expect(stub.calls.argsFor(2)).toEqual([undefined]);
    }));

    // https://github.com/simontonsoftware/s-ng-utils/issues/10
    it('emits `undefined` for unspecified inputs', fakeAsync(() => {
      init();
      const stub = jasmine.createSpy();
      colorTextComponent.getInput$('unspecified').subscribe(stub);
      expectSingleCallAndReset(stub, undefined);
    }));
  });

  describe('.bindToInstance()', () => {
    it('sets the local value', fakeAsync(() => {
      init();
      expect(colorSpan().innerText).toBe('Grey');
      expect(colorSpan().style.backgroundColor).toBe('grey');

      click(darkButton());
      expect(colorSpan().innerText).toBe('DarkGrey');
      expect(colorSpan().style.backgroundColor).toBe('darkgrey');

      click(slateButton());
      expect(colorSpan().innerText).toBe('DarkSlateGrey');
      expect(colorSpan().style.backgroundColor).toBe('darkslategrey');

      click(bothButton());
      expect(colorSpan().innerText).toBe('Grey');
      expect(colorSpan().style.backgroundColor).toBe('grey');
    }));

    it('triggers change detection', fakeAsync(() => {
      init();

      color$.next('Blue');
      fixture.detectChanges();
      expect(colorSpan().innerText).toBe('Blue');
      expect(colorSpan().style.backgroundColor).toBe('blue');

      click(bothButton());
      expect(colorSpan().innerText).toBe('DarkSlateBlue');
      expect(colorSpan().style.backgroundColor).toBe('darkslateblue');
    }));
  });

  describe('.subscribeTo()', () => {
    it('cleans up subscriptions', fakeAsync(() => {
      init();
      expect(color$.observers.length).toBe(1);

      click(hideButton());
      expect(color$.observers.length).toBe(0);
    }));
  });
});
