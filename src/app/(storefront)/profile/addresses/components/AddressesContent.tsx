"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileIcon from "../../components/ProfileIcon";
import { addAddressAction, deleteAddressAction } from "../addresses.actions";
import {
  type Address,
  type AddressActionResult,
  type AddressInput,
  addressInputSchema,
} from "../addresses.schemas";

export default function AddressesContent({
  addresses,
  error,
}: {
  addresses?: Address[];
  error?: string;
}) {
  const router = useRouter();
  const addDialog = useRef<HTMLDialogElement>(null);
  const deleteDialog = useRef<HTMLDialogElement>(null);
  const locked = useRef(false);
  const [busy, setBusy] = useState(false);
  const [refreshing, startTransition] = useTransition();
  const [selected, setSelected] = useState<Address | null>(null);
  const [failure, setFailure] = useState("");
  const pending = busy || refreshing;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressInputSchema),
    defaultValues: { name: "", details: "", phone: "", city: "" },
  });
  function openAdd() {
    setFailure("");
    reset();
    addDialog.current?.showModal();
  }
  async function mutate(
    action: () => Promise<AddressActionResult>,
    dialog: HTMLDialogElement | null,
  ) {
    if (locked.current || pending) return;
    locked.current = true;
    setBusy(true);
    setFailure("");
    try {
      const result = await action();
      if (!result.success) {
        if (result.code === "login") {
          router.replace("/login");
          return;
        }
        setFailure(result.message);
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      dialog?.close();
      startTransition(() => router.refresh());
    } catch {
      const message =
        "Unable to complete your address request. Please try again.";
      setFailure(message);
      toast.error(message);
    } finally {
      setBusy(false);
      locked.current = false;
    }
  }
  return (
    <>
      <div className="addresses-heading">
        <div>
          <h2>My Addresses</h2>
          <p>Manage your saved delivery addresses</p>
        </div>
        <Button className="address-add" onClick={openAdd} disabled={pending}>
          <ProfileIcon name="plus" />
          <span>Add Address</span>
        </Button>
      </div>
      {!addresses ? (
        <div className="address-message" role="alert">
          <h3>We couldn’t load your addresses</h3>
          <p>{error}</p>
          <Button
            disabled={pending}
            onClick={() => startTransition(() => router.refresh())}
          >
            {refreshing ? "Retrying…" : "Try again"}
          </Button>
        </div>
      ) : addresses.length === 0 ? (
        <div className="address-message">
          <ProfileIcon name="address" />
          <h3>No saved addresses yet</h3>
          <p>Add a delivery address to get started.</p>
          <Button onClick={openAdd} disabled={pending}>
            Add your first address
          </Button>
        </div>
      ) : (
        <ul className="address-grid" aria-busy={pending}>
          {addresses.map((address) => (
            <li
              className="address-card"
              key={address._id}
              data-address-id={address._id}
            >
              <span className="address-card-icon">
                <ProfileIcon name="address" />
              </span>
              <div className="address-card-text">
                <h3>{address.name}</h3>
                <p>{address.details}</p>
                <div className="address-meta">
                  <span>
                    <ProfileIcon name="phone" />
                    {address.phone}
                  </span>
                  <span>
                    <ProfileIcon name="city" />
                    {address.city}
                  </span>
                </div>
              </div>
              <button
                className="address-delete"
                type="button"
                disabled={pending}
                aria-label={`Delete ${address.name}`}
                onClick={() => {
                  setSelected(address);
                  setFailure("");
                  deleteDialog.current?.showModal();
                }}
              >
                <ProfileIcon name="delete" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <dialog
        className="address-dialog"
        ref={addDialog}
        aria-labelledby="add-address-title"
        onCancel={(event) => {
          if (pending) event.preventDefault();
        }}
      >
        <h2 id="add-address-title">Add Address</h2>
        <p>Save a delivery address to your account.</p>
        <form
          onSubmit={handleSubmit((input) =>
            mutate(() => addAddressAction(input), addDialog.current),
          )}
          noValidate
        >
          <fieldset disabled={pending}>
            {(
              [
                ["name", "Address name"],
                ["details", "Address details"],
                ["phone", "Phone number"],
                ["city", "City"],
              ] as const
            ).map(([field, label]) => (
              <div className="address-field" key={field}>
                <label htmlFor={`address-${field}`}>{label}</label>
                <Input
                  id={`address-${field}`}
                  type={field === "phone" ? "tel" : "text"}
                  autoComplete={
                    field === "phone"
                      ? "tel"
                      : field === "city"
                        ? "address-level2"
                        : field === "details"
                          ? "street-address"
                          : "off"
                  }
                  {...register(field)}
                  aria-invalid={!!errors[field]}
                  aria-describedby={
                    errors[field] ? `address-${field}-error` : undefined
                  }
                  required
                />
                {errors[field] && (
                  <p className="address-error" id={`address-${field}-error`}>
                    {errors[field].message}
                  </p>
                )}
              </div>
            ))}
          </fieldset>
          {failure && (
            <p className="address-error" role="alert">
              {failure}
            </p>
          )}
          <div className="address-dialog-actions">
            <Button
              variant="outline"
              disabled={pending}
              onClick={() => addDialog.current?.close()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save Address"}
            </Button>
          </div>
        </form>
      </dialog>
      <dialog
        className="address-dialog"
        ref={deleteDialog}
        aria-labelledby="delete-address-title"
        onCancel={(event) => {
          if (pending) event.preventDefault();
        }}
      >
        <h2 id="delete-address-title">Delete address?</h2>
        <p>Remove {selected?.name} from your saved delivery addresses?</p>
        {failure && (
          <p className="address-error" role="alert">
            {failure}
          </p>
        )}
        <div className="address-dialog-actions">
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => deleteDialog.current?.close()}
          >
            Cancel
          </Button>
          <Button
            className="address-confirm-delete"
            disabled={pending}
            onClick={() => {
              if (selected)
                void mutate(
                  () => deleteAddressAction(selected._id),
                  deleteDialog.current,
                );
            }}
          >
            {pending ? "Deleting…" : "Delete Address"}
          </Button>
        </div>
      </dialog>
    </>
  );
}
