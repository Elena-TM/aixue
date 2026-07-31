"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Artwork = {
  id: number;
  artwork_code: string;
  title: string;
  subject: string;
  year: number;
  medium: string;
  width_cm: number;
  height_cm: number;
  price: number;
  archived: boolean;
  destination: string | null;
  image: string;
  print_available: boolean;
};

type ArtworkForm = {
  artwork_code: string;
  title: string;
  subject: string;
  year: string;
  medium: string;
  width_cm: string;
  height_cm: string;
  price: string;
  archived: boolean;
  destination: string;
  print_available: boolean;
};

const emptyForm: ArtworkForm = {
  artwork_code: "",
  title: "",
  subject: "",
  year: "",
  medium: "Ink on paper",
  width_cm: "",
  height_cm: "",
  price: "",
  archived: false,
  destination: "",
  print_available: false,
};

const subjects = [
  "Landscape",
  "Orchid",
  "Bamboo",
  "Plum",
  "Chrysanthemum",
  "Lotus",
  "Pine",
  "Peony",
  "Wisteria",
  "Kumquat",
  "Pomegranate",
  "Crane",
  "Calligraphy",
  "Series",
];

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [collectionLoading, setCollectionLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);

  const [form, setForm] = useState<ArtworkForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [formMessage, setFormMessage] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setLoading(false);
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      loadArtworks();
    } else {
      setArtworks([]);
    }
  }, [user]);

  async function loadArtworks() {
    setCollectionLoading(true);

    const { data, error } = await supabase
      .from("artworks")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error loading artworks:", error);
      setActionMessage(error.message);
      setCollectionLoading(false);
      return;
    }

    setArtworks(data ?? []);
    setCollectionLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setUser(data.user);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  function updateField<K extends keyof ArtworkForm>(
    field: K,
    value: ArtworkForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openAddForm() {
    setEditingArtwork(null);
    setForm(emptyForm);
    setImageFile(null);
    setFormMessage("");
    setActionMessage("");
    setShowForm(true);
  }

  function openEditForm(artwork: Artwork) {
    setEditingArtwork(artwork);

    setForm({
      artwork_code: artwork.artwork_code,
      title: artwork.title,
      subject: artwork.subject,
      year: String(artwork.year),
      medium: artwork.medium,
      width_cm: String(artwork.width_cm),
      height_cm: String(artwork.height_cm),
      price: String(artwork.price),
      archived: artwork.archived,
      destination: artwork.destination ?? "",
      print_available: artwork.print_available,
    });

    setImageFile(null);
    setFormMessage("");
    setActionMessage("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function closeForm() {
    setShowForm(false);
    setEditingArtwork(null);
    setForm(emptyForm);
    setImageFile(null);
    setFormMessage("");
  }

  async function handleSaveArtwork(e: React.FormEvent) {
    e.preventDefault();

    if (!editingArtwork && !imageFile) {
      setFormMessage("Please select an artwork image.");
      return;
    }

    setSaving(true);
    setFormMessage("");

    try {
      if (editingArtwork) {
        let imageName = editingArtwork.image;

        // If a replacement image was selected
        if (imageFile) {
          const extension = imageFile.name.split(".").pop()?.toLowerCase();

          if (!extension) {
            throw new Error("The selected image has no file extension.");
          }

          const newImageName = `${form.artwork_code}.${extension}`;

          const { error: uploadError } = await supabase.storage
            .from("artworks")
            .upload(newImageName, imageFile, {
              cacheControl: "3600",
              upsert: true,
            });

          if (uploadError) {
            throw uploadError;
          }

          imageName = newImageName;
        }

        const { error: updateError } = await supabase
          .from("artworks")
          .update({
            artwork_code: form.artwork_code,
            title: form.title,
            subject: form.subject,
            year: Number(form.year),
            medium: form.medium,
            width_cm: Number(form.width_cm),
            height_cm: Number(form.height_cm),
            price: Number(form.price),
            archived: form.archived,
            destination: form.destination.trim() || null,
            image: imageName,
            print_available: form.print_available,
          })
          .eq("id", editingArtwork.id);

        if (updateError) {
          throw updateError;
        }

        // If filename changed, remove the old Storage file
        if (
          imageFile &&
          imageName !== editingArtwork.image
        ) {
          await supabase.storage
            .from("artworks")
            .remove([editingArtwork.image]);
        }

        await loadArtworks();

        setFormMessage("Artwork updated successfully.");

        setTimeout(() => {
          closeForm();
        }, 700);
      } else {
        if (!imageFile) {
          throw new Error("Please select an artwork image.");
        }

        const extension = imageFile.name.split(".").pop()?.toLowerCase();

        if (!extension) {
          throw new Error("The selected image has no file extension.");
        }

        const imageName = `${form.artwork_code}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from("artworks")
          .upload(imageName, imageFile, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { error: insertError } = await supabase
          .from("artworks")
          .insert({
            artwork_code: form.artwork_code,
            title: form.title,
            subject: form.subject,
            year: Number(form.year),
            medium: form.medium,
            width_cm: Number(form.width_cm),
            height_cm: Number(form.height_cm),
            price: Number(form.price),
            archived: form.archived,
            destination: form.destination.trim() || null,
            image: imageName,
            print_available: form.print_available,
          });

        if (insertError) {
          await supabase.storage.from("artworks").remove([imageName]);
          throw insertError;
        }

        await loadArtworks();

        setFormMessage("Artwork added successfully.");

        setTimeout(() => {
          closeForm();
        }, 700);
      }
    } catch (error) {
      if (error instanceof Error) {
        setFormMessage(error.message);
      } else {
        setFormMessage("Something went wrong.");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleArchiveToggle(artwork: Artwork) {
    setActionMessage("");

    const newArchivedState = !artwork.archived;

    const { error } = await supabase
      .from("artworks")
      .update({
        archived: newArchivedState,
      })
      .eq("id", artwork.id);

    if (error) {
      setActionMessage(error.message);
      return;
    }

    setArtworks((current) =>
      current.map((item) =>
        item.id === artwork.id
          ? { ...item, archived: newArchivedState }
          : item
      )
    );
  }

  async function handleDeleteArtwork(artwork: Artwork) {
    const confirmed = window.confirm(
      `Permanently delete "${artwork.title}"?\n\nThis will delete the artwork record and its image.`
    );

    if (!confirmed) {
      return;
    }

    setActionMessage("");

    const { error: deleteError } = await supabase
      .from("artworks")
      .delete()
      .eq("id", artwork.id);

    if (deleteError) {
      setActionMessage(deleteError.message);
      return;
    }

    const { error: storageError } = await supabase.storage
      .from("artworks")
      .remove([artwork.image]);

    if (storageError) {
      console.error("Image deletion error:", storageError);
    }

    setArtworks((current) =>
      current.filter((item) => item.id !== artwork.id)
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-32">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-6 pb-16 pt-60">
        <h1 className="mb-2 text-3xl">Admin</h1>

        <p className="mb-8 text-gray-500">
          Sign in to manage the Ai Xue collection.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 px-4 py-3"
            />
          </div>

          {message && (
            <p className="text-sm text-red-600">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-black px-4 py-3 text-white"
          >
            Sign in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 pb-16 pt-60">
      <div className="mb-10 flex items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl">
            Collection Management
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Add and manage artworks in the Ai Xue collection.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="border border-gray-300 px-4 py-2 text-sm"
        >
          Sign out
        </button>
      </div>

      {!showForm && (
        <div className="border-t border-gray-200 pt-8">
          <button
            onClick={openAddForm}
            className="bg-black px-5 py-3 text-white"
          >
            + Add artwork
          </button>
        </div>
      )}

      {showForm && (
        <section className="border-t border-gray-200 pt-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl">
              {editingArtwork ? "Edit artwork" : "Add artwork"}
            </h2>

            <button
              type="button"
              onClick={closeForm}
              className="text-sm text-gray-500 hover:text-black"
            >
              Cancel
            </button>
          </div>

          <form
            onSubmit={handleSaveArtwork}
            className="grid max-w-4xl grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm">
                Artwork code
              </label>

              <input
                type="text"
                value={form.artwork_code}
                onChange={(e) =>
                  updateField("artwork_code", e.target.value)
                }
                placeholder="Landscape002"
                required
                className="w-full border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Title
              </label>

              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  updateField("title", e.target.value)
                }
                placeholder="Landscape No. 2"
                required
                className="w-full border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Subject
              </label>

              <select
                value={form.subject}
                onChange={(e) =>
                  updateField("subject", e.target.value)
                }
                required
                className="w-full border border-gray-300 bg-white px-4 py-3"
              >
                <option value="">Select subject</option>

                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Year
              </label>

              <input
                type="number"
                value={form.year}
                onChange={(e) =>
                  updateField("year", e.target.value)
                }
                placeholder="2026"
                required
                className="w-full border border-gray-300 px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm">
                Medium
              </label>

              <input
                type="text"
                value={form.medium}
                onChange={(e) =>
                  updateField("medium", e.target.value)
                }
                required
                className="w-full border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Width (cm)
              </label>

              <input
                type="number"
                step="0.1"
                value={form.width_cm}
                onChange={(e) =>
                  updateField("width_cm", e.target.value)
                }
                placeholder="26.5"
                required
                className="w-full border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Height (cm)
              </label>

              <input
                type="number"
                step="0.1"
                value={form.height_cm}
                onChange={(e) =>
                  updateField("height_cm", e.target.value)
                }
                placeholder="37.5"
                required
                className="w-full border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Price (CHF)
              </label>

              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  updateField("price", e.target.value)
                }
                placeholder="350"
                required
                className="w-full border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm">
                Destination
              </label>

              <input
                type="text"
                value={form.destination}
                onChange={(e) =>
                  updateField("destination", e.target.value)
                }
                placeholder="Leave empty if available"
                className="w-full border border-gray-300 px-4 py-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm">
                Artwork image
              </label>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] ?? null)
                }
                required={!editingArtwork}
                className="block w-full border border-gray-300 px-4 py-3"
              />

              {editingArtwork && !imageFile && (
                <p className="mt-2 text-xs text-gray-500">
                  Leave empty to keep the current image.
                </p>
              )}

              {imageFile && (
                <p className="mt-2 text-xs text-gray-500">
                  New image:{" "}
                  <strong>{imageFile.name}</strong>
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                id="archived"
                type="checkbox"
                checked={form.archived}
                onChange={(e) =>
                  updateField("archived", e.target.checked)
                }
                className="h-4 w-4"
              />

              <label
                htmlFor="archived"
                className="text-sm"
              >
                Archived / sold
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="print_available"
                type="checkbox"
                checked={form.print_available}
                onChange={(e) =>
                  updateField(
                    "print_available",
                    e.target.checked
                  )
                }
                className="h-4 w-4"
              />

              <label
                htmlFor="print_available"
                className="text-sm"
              >
                Print available
              </label>
            </div>

            {formMessage && (
              <div className="md:col-span-2">
                <p
                  className={
                    formMessage.includes("successfully")
                      ? "text-sm text-green-700"
                      : "text-sm text-red-600"
                  }
                >
                  {formMessage}
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-4 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="bg-black px-6 py-3 text-white disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingArtwork
                  ? "Save changes"
                  : "Save artwork"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="border border-gray-300 px-6 py-3"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {!showForm && (
        <section className="mt-14 border-t border-gray-200 pt-8">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <h2 className="text-2xl">
                Your collection
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {artworks.length}{" "}
                {artworks.length === 1
                  ? "artwork"
                  : "artworks"}
              </p>
            </div>
          </div>

          {actionMessage && (
            <p className="mb-6 text-sm text-red-600">
              {actionMessage}
            </p>
          )}

          {collectionLoading ? (
            <p className="text-sm text-gray-500">
              Loading collection...
            </p>
          ) : artworks.length === 0 ? (
            <p className="text-sm text-gray-500">
              No artworks yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {artworks.map((artwork) => {
                const imageUrl = supabase.storage
                  .from("artworks")
                  .getPublicUrl(artwork.image).data.publicUrl;

                return (
                  <article
                    key={artwork.id}
                    className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center"
                  >
                    <div className="h-32 w-24 shrink-0 overflow-hidden bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={artwork.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg">
                        {artwork.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {artwork.subject} · {artwork.year}
                      </p>

                      <p className="mt-2 text-sm">
                        CHF {artwork.price}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs">
                        <span
                          className={
                            artwork.archived
                              ? "text-red-700"
                              : "text-green-700"
                          }
                        >
                          {artwork.archived
                            ? "Archived"
                            : "Available"}
                        </span>

                        <span className="text-gray-500">
                          Print:{" "}
                          {artwork.print_available
                            ? "Yes"
                            : "No"}
                        </span>

                        {artwork.destination && (
                          <span className="text-gray-500">
                            {artwork.destination}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-4 text-sm">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(artwork)
                        }
                        className="hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleArchiveToggle(artwork)
                        }
                        className="hover:underline"
                      >
                        {artwork.archived
                          ? "Unarchive"
                          : "Archive"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteArtwork(artwork)
                        }
                        className="text-red-700 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </main>
  );
}