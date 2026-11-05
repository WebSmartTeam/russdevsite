"use server";

import {
  NOTES_MAX,
  QUANTITY_MAX,
  SIZES,
  STOCKS,
  type FieldErrors,
  type ProofState,
  type Values,
} from "./proof-order";

// Validates a test-print order and returns either the errors or a summary. Nothing is stored, sent or
// logged: the submitted values exist only for the length of this request.

const MAX_FIELD = 2000; // read no more than this from any field, whatever the client sends

function field(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === "string" ? value.slice(0, MAX_FIELD).trim() : "";
}

// Today's date in London as YYYY-MM-DD, and the same a year on.
function londonToday(): { today: string; yearOn: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const [y, m, d] = parts.split("-").map(Number);
  const yearOn = new Date(Date.UTC(y + 1, m - 1, d)).toISOString().slice(0, 10);
  return { today: parts, yearOn };
}

function isRealDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function ukDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export async function checkProof(previous: ProofState, form: FormData): Promise<ProofState> {
  const values: Values = {
    size: field(form, "size"),
    stock: field(form, "stock"),
    quantity: field(form, "quantity"),
    date: field(form, "date"),
    notes: field(form, "notes"),
  };
  const errors: FieldErrors = {};

  if (!SIZES.includes(values.size as (typeof SIZES)[number])) {
    errors.size = "Choose a paper size";
  }

  const stock = STOCKS.find((s) => s.value === values.stock);
  if (!stock) {
    errors.stock = "Choose a paper stock";
  }

  const quantity = Number(values.quantity);
  if (values.quantity === "") {
    errors.quantity = "Enter how many copies you need";
  } else if (!/^\d+$/.test(values.quantity) || quantity < 1 || quantity > QUANTITY_MAX) {
    errors.quantity = `Quantity must be a whole number from 1 to ${QUANTITY_MAX}`;
  }

  const { today, yearOn } = londonToday();
  if (values.date === "") {
    errors.date = "Enter the date you need the proof by";
  } else if (!isRealDate(values.date)) {
    errors.date = "The proof date must be a real date";
  } else if (values.date < today) {
    errors.date = "The proof date must be today or in the future";
  } else if (values.date > yearOn) {
    errors.date = `The proof date must be on or before ${ukDate(yearOn)}`;
  }

  if (values.notes.length > NOTES_MAX) {
    errors.notes = `Notes must be ${NOTES_MAX} characters or fewer`;
  }

  // The previous state travels from the browser, so treat it as untrusted too.
  const attempt = (Number.isSafeInteger(previous?.attempt) ? previous.attempt : 0) + 1;

  if (Object.keys(errors).length > 0 || !stock) {
    return { status: "error", attempt, errors, values };
  }

  return {
    status: "ok",
    attempt,
    summary: {
      size: values.size,
      stock: stock.label,
      quantity,
      date: ukDate(values.date),
      notes: values.notes.length,
    },
  };
}
