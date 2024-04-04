export type Result<Ok, Err> =
  | { ok: true; value: Ok }
  | { ok: false; error: Err };
export const Ok = <Ok>(value: Ok) => ({ ok: true, value }) as const;
export const Err = <Err>(error: Err) => ({ ok: false, error }) as const;
