// Shared between the server action and the form: the fields, their options and the result shapes.

export const SIZES = ["A5", "A4", "A3"] as const;
export const STOCKS = [
  { value: "uncoated-120", label: "Uncoated, 120gsm" },
  { value: "silk-170", label: "Silk, 170gsm" },
  { value: "gloss-250", label: "Gloss, 250gsm" },
] as const;
export const QUANTITY_MAX = 500;
export const NOTES_MAX = 280;

export type FieldName = "size" | "stock" | "quantity" | "date" | "notes";
export type Values = Record<FieldName, string>;
export type FieldErrors = Partial<Record<FieldName, string>>;

export type ProofState =
  | { status: "idle"; attempt: 0 }
  | { status: "error"; attempt: number; errors: FieldErrors; values: Values }
  | {
      status: "ok";
      attempt: number;
      summary: { size: string; stock: string; quantity: number; date: string; notes: number };
    };

export const INITIAL_STATE: ProofState = { status: "idle", attempt: 0 };

// The order fields appear on the page, so errors are listed in the same order.
export const FIELD_ORDER: FieldName[] = ["size", "stock", "quantity", "date", "notes"];
