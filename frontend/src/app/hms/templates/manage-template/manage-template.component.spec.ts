import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../shared/shared.module';
import { AppConfig } from '../../../core/config/config';

import { ManageTemplateComponent } from './manage-template.component';

describe('ManageTemplateComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageTemplateComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, NoopAnimationsModule, SharedModule]
    }).compileComponents();

    /// TemplateService reads BASE_URL in its constructor and AppConfig throws
    /// when the key is absent, so seed it before the component is created.
    TestBed.inject(AppConfig).set('BASE_URL', 'http://localhost:5000');
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ManageTemplateComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should default to the email channel and require a subject', () => {
    const fixture = TestBed.createComponent(ManageTemplateComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isEmail()).toBe(true);

    component.templateForm.patchValue({ message_template: '<p>x</p>' });
    expect(component.templateForm.get('subject_template')?.hasError('required')).toBe(true);
  });

  it('should swap the required field when the channel changes', () => {
    const fixture = TestBed.createComponent(ManageTemplateComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.templateForm.get('channel')?.setValue('in_app');
    fixture.detectChanges();

    expect(component.isEmail()).toBe(false);
    expect(component.templateForm.get('title_template')?.hasError('required')).toBe(true);
  });

  it('should add and remove variables without duplicates', () => {
    const fixture = TestBed.createComponent(ManageTemplateComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.addVariable('user_name');
    component.addVariable('otp');
    expect(component.variables).toEqual(['user_name', 'otp']);

    /// Adding the same name twice must not duplicate it.
    component.addVariable('otp');
    expect(component.variables).toEqual(['user_name', 'otp']);

    component.removeVariable('otp');
    expect(component.variables).toEqual(['user_name']);
  });

  it('should report placeholders that are used but not declared', () => {
    const fixture = TestBed.createComponent(ManageTemplateComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.variables = ['user_name'];
    component.templateForm.patchValue({
      message_template: '<p>{{ user_name }} code {{ otp }}</p>'
    });

    expect(component.undeclaredVariables()).toEqual(['otp']);
  });

  it('should report no undeclared placeholders when all are declared', () => {
    const fixture = TestBed.createComponent(ManageTemplateComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.variables = ['user_name', 'otp'];
    component.templateForm.patchValue({
      message_template: '<p>{{ user_name }} code {{ otp }}</p>'
    });

    expect(component.undeclaredVariables()).toEqual([]);
  });

  it('should ignore tokens that are not bare identifiers', () => {
    const fixture = TestBed.createComponent(ManageTemplateComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.variables = [];
    component.templateForm.patchValue({
      message_template: '<p>{{ a.b }} {{ 1+1 }} {% raw %}</p>'
    });

    /// The renderer leaves these alone, so they must not be reported as
    /// missing variables -- otherwise saving would be blocked by noise.
    expect(component.undeclaredVariables()).toEqual([]);
  });

  it('should supply a sample value for every declared variable', () => {
    const fixture = TestBed.createComponent(ManageTemplateComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    component.variables = ['user_name', 'brand_new_variable'];
    const context = component['buildSampleContext']();

    expect(context['user_name']).toBeTruthy();
    expect(context['brand_new_variable']).toBe('[brand_new_variable]');
  });
});