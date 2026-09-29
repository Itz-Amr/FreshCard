import "server-only";
import { z } from "zod";
import { fetchAuthenticated } from "@/lib/backend";
import {
  type AddressInput,
  addressesResponseSchema,
  addressIdSchema,
  addressInputSchema,
  addressMutationSchema,
} from "./addresses.schemas";

export class AddressApiError extends Error {}
const unavailable =
  "Unable to complete your address request. Please try again.";
async function request(path: string, init?: RequestInit) {
  const response = await fetchAuthenticated(path, init);
  const body: unknown = await response.json().catch(() => null);
  if (
    !response.ok ||
    (typeof body === "object" &&
      body !== null &&
      "status" in body &&
      body.status !== "success")
  ) {
    const error = z
      .object({ message: z.string().trim().min(1).max(1000) })
      .safeParse(body);
    throw new AddressApiError(error.success ? error.data.message : unavailable);
  }
  return body;
}
export async function getAddresses() {
  const parsed = addressesResponseSchema.safeParse(await request("/addresses"));
  if (!parsed.success) throw new AddressApiError(unavailable);
  return parsed.data.data;
}
export async function addAddress(input: AddressInput) {
  const body = addressInputSchema.parse(input);
  const parsed = addressMutationSchema.safeParse(
    await request("/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
  if (!parsed.success) throw new AddressApiError(unavailable);
  return parsed.data.message;
}
export async function deleteAddress(addressId: string) {
  const id = addressIdSchema.parse(addressId);
  const parsed = addressMutationSchema.safeParse(
    await request(`/addresses/${id}`, { method: "DELETE" }),
  );
  if (!parsed.success) throw new AddressApiError(unavailable);
  return parsed.data.message;
}
