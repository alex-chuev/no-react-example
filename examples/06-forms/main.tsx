import { computed, render, Signal, signal } from 'no-react';

// Two-way binding is a reactive `value` plus an `onInput` that writes back.
const bindText = (target: Signal<string>) => ({
  value: target,
  onInput: (event: Event) => target.set((event.target as HTMLInputElement).value),
});

const name = signal('');
const email = signal('');
const password = signal('');
const plan = signal<'free' | 'pro' | 'team'>('free');
const country = signal('de');
const bio = signal('');
const newsletter = signal(true);
const touched = signal(false);
const submitted = signal<object | null>(null);

const errors = computed(() => {
  const list: { [field: string]: string } = {};

  if (name().trim().length < 2) list.name = 'At least 2 characters.';
  if (!/^\S+@\S+\.\S+$/.test(email())) list.email = 'Enter a valid email.';
  if (password().length < 8) list.password = 'At least 8 characters.';

  return list;
});
const valid = computed(() => Object.keys(errors()).length === 0);
const strength = computed(() => [/[a-z]/, /[A-Z]/, /\d/, /[^\w]/].filter(rule => rule.test(password())).length);

// Errors show up only after the first submit attempt.
const FieldError = ({field}: { field: string }) => (
  <span className="error">{() => touched() ? errors()[field] : ''}</span>
);

const countries = {nl: 'Netherlands', de: 'Germany', fr: 'France', es: 'Spain'};

const submit = (event: Event) => {
  event.preventDefault();
  touched.set(true);

  if (valid()) {
    submitted.set({name: name(), email: email(), plan: plan(), country: country(), bio: bio(), newsletter: newsletter()});
  }
};

render(
  <form className="card form" onSubmit={submit} noValidate>
    <label>Name <input type="text" {...bindText(name)} /> <FieldError field="name" /></label>
    <label>Email <input type="email" {...bindText(email)} /> <FieldError field="email" /></label>
    <label>
      Password <input type="password" {...bindText(password)} /> <FieldError field="password" />
      <meter min="0" max="4" low="2" high="3" optimum="4" value={strength} />
    </label>

    <fieldset>
      <legend>Plan</legend>
      {(['free', 'pro', 'team'] as const).map(value => (
        <label className="inline">
          <input type="radio" name="plan" value={value} checked={() => plan() === value} onChange={() => plan.set(value)} /> {value}
        </label>
      ))}
    </fieldset>

    <label>
      Country{' '}
      <select value={country} onChange={(event: Event) => country.set((event.target as HTMLSelectElement).value)}>
        {Object.entries(countries).map(([code, label]) => <option value={code}>{label}</option>)}
      </select>
    </label>

    <label>Bio <textarea rows="3" maxLength="140" {...bindText(bio)} /> <span className="muted">{() => 140 - bio().length} left</span></label>

    <label className="inline">
      <input type="checkbox" checked={newsletter} onChange={() => newsletter.update(v => !v)} /> Send me the newsletter
    </label>

    <div className="row">
      <button className="primary" disabled={() => touched() && !valid()}>Sign up</button>
      <button type="button" onClick={() => [name, email, password, bio].forEach(field => field.set(''))}>Clear text fields</button>
    </div>

    {() => submitted() && <pre>{JSON.stringify(submitted(), null, 2)}</pre>}
  </form>,
  document.getElementById('app')!,
);
