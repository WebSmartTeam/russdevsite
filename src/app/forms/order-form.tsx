"use client";

import { useActionState, useEffect, useId, useRef, useState } from "react";
import { checkProof } from "./actions";
import {
  FIELD_ORDER,
  INITIAL_STATE,
  NOTES_MAX,
  QUANTITY_MAX,
  SIZES,
  STOCKS,
  type FieldName,
} from "./proof-order";

const LABELS: Record<FieldName, string> = {
  size: "Paper size",
  stock: "Paper stock",
  quantity: "Quantity",
  date: "Proof needed by",
  notes: "Notes for the printer",
};

export function OrderForm() {
  const id = useId();
  const [state, action, pending] = useActionState(checkProof, INITIAL_STATE);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : undefined;

  // After each answer, move focus to what changed: the error summary or the confirmation.
  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
    if (state.status === "ok") successRef.current?.focus();
  }, [state]);

  const fid = (name: FieldName) => `${id}-${name}`;
  const describedBy = (name: FieldName, ...extra: string[]) =>
    [errors[name] ? `${fid(name)}-error` : "", ...extra].filter(Boolean).join(" ") || undefined;

  const listed = FIELD_ORDER.filter((name) => errors[name]);

  return (
    <div className="order">
      {state.status === "ok" ? (
        <div ref={successRef} tabIndex={-1} className="order-success" role="region" aria-labelledby={`${id}-ok-title`}>
          <p className="rail">Proof accepted</p>
          <h3 id={`${id}-ok-title`} className="h3 mt-3">
            Checked and passed<span className="stop">.</span>
          </h3>
          <dl className="order-summary">
            <dt>Paper</dt>
            <dd>
              {state.summary.size}, {state.summary.stock}
            </dd>
            <dt>Quantity</dt>
            <dd>{state.summary.quantity}</dd>
            <dt>Needed by</dt>
            <dd>{state.summary.date}</dd>
            <dt>Notes</dt>
            <dd>{state.summary.notes === 0 ? "None" : `${state.summary.notes} characters`}</dd>
          </dl>
          <p className="secondary mt-4">
            Nothing was ordered and nothing was kept. The server checked your answers and sent them back;
            it does not store, email or log them.
          </p>
        </div>
      ) : null}

      {listed.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          className="error-summary"
          role="region"
          aria-labelledby={`${id}-problem-title`}
        >
          <h3 id={`${id}-problem-title`} className="h3">
            There is a problem
          </h3>
          <ul className="mt-3">
            {listed.map((name) => (
              <li key={name}>
                <a href={`#${fid(name)}`}>{errors[name]}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <form key={state.attempt} action={action} noValidate className="order-form">
        <fieldset className="order-field" aria-describedby={describedBy("size")}>
          <legend className="field-label">{LABELS.size}</legend>
          {errors.size ? (
            <span id={`${fid("size")}-error`} className="field-error">
              <span className="sr-only">Error: </span>
              {errors.size}
            </span>
          ) : null}
          <div className="flex flex-wrap gap-x-8">
            {SIZES.map((size, i) => (
              <label key={size} className="choice">
                <input
                  id={i === 0 ? fid("size") : undefined}
                  type="radio"
                  name="size"
                  value={size}
                  required
                  defaultChecked={values?.size === size}
                />
                {size}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="order-field">
          <label htmlFor={fid("stock")} className="field-label">
            {LABELS.stock}
          </label>
          {errors.stock ? (
            <span id={`${fid("stock")}-error`} className="field-error">
              <span className="sr-only">Error: </span>
              {errors.stock}
            </span>
          ) : null}
          <select
            id={fid("stock")}
            name="stock"
            className="input"
            required
            defaultValue={values?.stock ?? ""}
            aria-invalid={errors.stock ? true : undefined}
            aria-describedby={describedBy("stock")}
          >
            <option value="" disabled>
              Choose a stock
            </option>
            {STOCKS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="order-field">
          <label htmlFor={fid("quantity")} className="field-label">
            {LABELS.quantity}
          </label>
          <span id={`${fid("quantity")}-hint`} className="field-hint">
            How many copies, from 1 to {QUANTITY_MAX}
          </span>
          {errors.quantity ? (
            <span id={`${fid("quantity")}-error`} className="field-error">
              <span className="sr-only">Error: </span>
              {errors.quantity}
            </span>
          ) : null}
          <input
            id={fid("quantity")}
            name="quantity"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            className="input input-short"
            required
            defaultValue={values?.quantity ?? ""}
            aria-invalid={errors.quantity ? true : undefined}
            aria-describedby={describedBy("quantity", `${fid("quantity")}-hint`)}
          />
        </div>

        <div className="order-field">
          <label htmlFor={fid("date")} className="field-label">
            {LABELS.date}
          </label>
          <span id={`${fid("date")}-hint`} className="field-hint">
            Today or any day in the next year
          </span>
          {errors.date ? (
            <span id={`${fid("date")}-error`} className="field-error">
              <span className="sr-only">Error: </span>
              {errors.date}
            </span>
          ) : null}
          <input
            id={fid("date")}
            name="date"
            type="date"
            className="input input-date"
            required
            defaultValue={values?.date ?? ""}
            aria-invalid={errors.date ? true : undefined}
            aria-describedby={describedBy("date", `${fid("date")}-hint`)}
          />
        </div>

        <NotesField
          id={fid("notes")}
          label={LABELS.notes}
          error={errors.notes}
          defaultValue={values?.notes ?? ""}
          describedBy={describedBy("notes", `${fid("notes")}-count`)}
        />

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" className="button" disabled={pending}>
            {pending ? "Checking…" : "Check my proof"}
          </button>
          <p className="mono-note" aria-live="polite">
            {pending ? "Sending your answers to the server to be checked." : ""}
          </p>
        </div>
      </form>
    </div>
  );
}

// Lives inside the form, so it remounts with it and its count always matches what is in the box.
function NotesField({
  id,
  label,
  error,
  defaultValue,
  describedBy,
}: {
  id: string;
  label: string;
  error?: string;
  defaultValue: string;
  describedBy?: string;
}) {
  const [length, setLength] = useState(defaultValue.length);
  const over = length > NOTES_MAX;
  return (
    <div className="order-field">
      <label htmlFor={id} className="field-label">
        {label} <span className="field-hint inline">(optional)</span>
      </label>
      {error ? (
        <span id={`${id}-error`} className="field-error">
          <span className="sr-only">Error: </span>
          {error}
        </span>
      ) : null}
      <textarea
        id={id}
        name="notes"
        className="input"
        rows={4}
        defaultValue={defaultValue}
        onChange={(e) => setLength(e.target.value.length)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
      <span id={`${id}-count`} className={over ? "field-error" : "field-hint"}>
        {over ? `${length - NOTES_MAX} characters too many` : `Up to ${NOTES_MAX} characters. ${NOTES_MAX - length} left.`}
      </span>
    </div>
  );
}
