"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { adminApiClient, extractErrorMessage } from "@/lib/adminApiClient";
import { AdminNav } from "@/components/AdminNav";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

/* ---------- UI primitives ---------- */

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-xl border border-border bg-white shadow-sm ${className}`}>{children}</div>
);

const Button = ({
  children,
  type = "button",
  variant = "default",
  size = "default",
  disabled = false,
  className = "",
  onClick,
  label,
}: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "outline" | "destructive";
  size?: "default" | "icon";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  label?: string;
}) => {
  const base =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/40",
    outline: "border border-border bg-white text-foreground hover:bg-primary/5 focus:ring-primary/30",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/40",
  };
  const sizes = { default: "h-10 px-4 py-2 text-sm rounded-lg", icon: "h-8 w-8 rounded-xl" };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const ICONS = {
  upload: (
    <>
      <path d="M12 16V4" />
      <path d="M7 9l5-5 5 5" />
      <path d="M20 16v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
    </>
  ),
  trash: (
    <>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </>
  ),
  plus: (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </>
  ),
  x: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
} as const;

const Icon = ({ name, className = "h-4 w-4" }: { name: keyof typeof ICONS; className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {ICONS[name]}
  </svg>
);

/* ---------- Types & helpers ---------- */

type BannerImage = {
  id: string;
  url: string;
  alt: string;
  description: string;
  createdAt: string;
};

const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPTED = ["image/png", "image/jpeg", "image/webp"];
const TITLE_MAX = 120;
const DESCRIPTION_MAX = 2000;

// Tolerant mapping: if the API shape differs slightly, we still get a URL
// instead of an undefined src that silently renders nothing.
const toBanner = (slide: any): BannerImage => ({
  id: String(slide._id ?? slide.id),
  url: slide.image?.url ?? slide.image?.secure_url ?? slide.imageUrl ?? slide.url ?? "",
  alt: slide.title ?? "",
  description: slide.description ?? "",
  createdAt: slide.createdAt ?? "",
});

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

/* ---------- Banner card ---------- */

function BannerCard({
  banner,
  isNew,
  onDelete,
}: {
  banner: BannerImage;
  isNew: boolean;
  onDelete: () => void;
}) {
  const [failed, setFailed] = useState(!banner.url);

  return (
    <Card className={`group overflow-hidden transition-shadow hover:shadow-md ${isNew ? "ring-2 ring-primary/50" : ""}`}>
      <div className="relative aspect-video bg-primary/5">
        {failed ? (
          <div className="flex h-full flex-col items-center justify-center gap-1 px-4 text-center text-muted-foreground">
            <Icon name="image" className="h-8 w-8 opacity-40" />
            <span className="text-xs">
              {banner.url ? "Image failed to load" : "No image URL returned by the API"}
            </span>
          </div>
        ) : (
          // Plain <img>: no next.config remotePatterns dependency, and no
          // optimizer round-trip. Fine for an admin screen.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={banner.url}
            alt={banner.alt}
            loading="lazy"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {isNew && (
          <span className="absolute left-2 top-2 rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-white">
            Just added
          </span>
        )}
        <Button
          onClick={onDelete}
          variant="destructive"
          size="icon"
          label={`Delete banner ${banner.alt}`}
          className="absolute right-2 top-2 shadow-md"
        >
          <Icon name="trash" />
        </Button>
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-medium text-foreground">{banner.alt || "Untitled banner"}</p>
        {banner.description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{banner.description}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {banner.createdAt ? new Date(banner.createdAt).toLocaleString() : ""}
        </p>
      </div>
    </Card>
  );
}

/* ---------- Page ---------- */

// Backed by the Express API's /carousel routes (Cloudinary + MongoDB), not
// local disk: the Next.js filesystem is read-only on Vercel at runtime.
export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerImage[]>([]);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<BannerImage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async (silent = false): Promise<BannerImage[]> => {
    if (!silent) setLoading(true);
    setLoadError(null);
    try {
      const res = await adminApiClient.get("/carousel/admin/all");
      const slides = res.data?.data?.slides ?? res.data?.slides ?? [];
      const list: BannerImage[] = slides.map(toBanner);
      setBanners(list);
      return list;
    } catch (error) {
      console.error("Failed to load banners:", error);
      const message = extractErrorMessage(error);
      setLoadError(message);
      toast.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Local preview of the file chosen for upload; revoked on change/unmount.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const clearSelection = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = ""; // lets the same file be re-picked
  };

  const selectFile = (picked: File | null | undefined) => {
    if (!picked) return;
    if (!ACCEPTED.includes(picked.type)) {
      toast.error("Use a PNG, JPG or WebP image.");
      return;
    }
    if (picked.size > MAX_SIZE) {
      toast.error(`That file is ${formatSize(picked.size)}. The limit is 5 MB.`);
      return;
    }
    setFile(picked);
    setTitle((current) =>
      (current || picked.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ")).slice(0, TITLE_MAX)
    );
  };

  const handleUpload = async () => {
    if (!file || uploading) return;
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (cleanTitle.length < 2) {
      toast.error("Enter a title of at least 2 characters.");
      return;
    }
    if (cleanTitle.length > TITLE_MAX) {
      toast.error(`Title can be at most ${TITLE_MAX} characters.`);
      return;
    }
    if (cleanDescription.length > DESCRIPTION_MAX) {
      toast.error(`Description can be at most ${DESCRIPTION_MAX} characters.`);
      return;
    }

    setUploading(true);
    setProgress(0);
    const previousIds = new Set(banners.map((b) => b.id));

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("title", cleanTitle);
      formData.append("description", cleanDescription);
      await adminApiClient.post("/carousel", formData, {
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        },
      });
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(`Upload failed: ${extractErrorMessage(error)}`);
      setUploading(false);
      return;
    }

    // The upload succeeded. A failed refresh must not be reported as a failed upload.
    clearSelection();
    setTitle("");
    setDescription("");
    setUploading(false);
    const fresh = await load(true);
    const added = fresh.filter((b) => !previousIds.has(b.id)).map((b) => b.id);
    setNewIds(new Set(added));
    toast.success(
      added.length
        ? "Banner uploaded. It's now in the list below."
        : "Banner uploaded, but the list didn't show it. Refresh the page to check."
    );
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await adminApiClient.delete(`/carousel/${pendingDelete.id}`);
      setBanners((prev) => prev.filter((b) => b.id !== pendingDelete.id));
      toast.success("Banner deleted.");
      setPendingDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(`Delete failed: ${extractErrorMessage(error)}`);
    } finally {
      setDeleting(false);
    }
  };

  const descriptionLeft = DESCRIPTION_MAX - description.length;

  return (
    <div className="min-h-screen bg-surface">
      <AdminNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <p className="font-utility text-sm font-semibold text-primary">Content Management</p>
          <h1 className="font-display text-3xl font-bold text-foreground">Hero Banner Manager</h1>
          <p className="mt-1 text-muted-foreground">
            Upload and manage images for the homepage hero banner rotation.
          </p>
        </div>

        <Card className="mb-8 overflow-hidden">
          <div className="border-b border-border bg-primary/5 px-6 py-4">
            <h2 className="text-lg font-semibold text-foreground">Upload new banner</h2>
          </div>
          <div className="grid gap-6 px-6 py-6 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <input
                ref={inputRef}
                id="bannerFileInput"
                type="file"
                accept={ACCEPTED.join(",")}
                className="sr-only"
                onChange={(e) => selectFile(e.target.files?.[0])}
              />
              {previewUrl && file ? (
                <div className="overflow-hidden rounded-xl border border-border">
                  <div className="relative aspect-video bg-primary/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Selected banner preview"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 px-4 py-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatSize(file.size)} · Not uploaded yet
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      label="Remove selected image"
                      onClick={clearSelection}
                      disabled={uploading}
                    >
                      <Icon name="x" />
                    </Button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="bannerFileInput"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    selectFile(e.dataTransfer.files?.[0]);
                  }}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-10 transition-all ${
                    dragOver ? "border-primary bg-primary/10" : "border-border hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  <Icon name="upload" className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Choose an image or drop it here</span>
                  <span className="text-xs text-muted-foreground">PNG, JPG or WebP, up to 5 MB</span>
                </label>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="bannerTitle" className="text-sm font-medium text-foreground">
                  Title (also used as alt text)
                </label>
                <input
                  id="bannerTitle"
                  type="text"
                  value={title}
                  maxLength={TITLE_MAX}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Short title for the image"
                  disabled={uploading}
                  className="mt-1 w-full rounded-xl border border-border px-4 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                />
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <label htmlFor="bannerDescription" className="text-sm font-medium text-foreground">
                    Description (optional)
                  </label>
                  <span
                    className={`text-xs ${descriptionLeft < 100 ? "text-red-600" : "text-muted-foreground"}`}
                    aria-live="polite"
                  >
                    {description.length}/{DESCRIPTION_MAX}
                  </span>
                </div>
                <textarea
                  id="bannerDescription"
                  value={description}
                  maxLength={DESCRIPTION_MAX}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Shown in full when visitors click the banner text"
                  rows={6}
                  disabled={uploading}
                  className="mt-1 w-full resize-y rounded-xl border border-border px-4 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                />
              </div>

              <Button onClick={handleUpload} disabled={!file || uploading} className="w-full gap-2 rounded-xl">
                <Icon name="plus" />
                {uploading ? (progress < 100 ? `Uploading ${progress}%` : "Processing...") : "Upload banner"}
              </Button>

              {uploading && (
                <div
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10"
                >
                  <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>
          </div>
        </Card>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground">Current banners</h2>
            <span className="text-sm text-muted-foreground">
              {banners.length} {banners.length === 1 ? "image" : "images"}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
            </div>
          ) : loadError ? (
            <Card className="border-2 border-dashed p-12 text-center">
              <p className="font-medium text-foreground">Could not load banners</p>
              <p className="mt-1 text-sm text-muted-foreground">{loadError}</p>
              <Button variant="outline" className="mt-4" onClick={() => load()}>
                Try again
              </Button>
            </Card>
          ) : banners.length === 0 ? (
            <Card className="border-2 border-dashed p-12 text-center">
              <Icon name="image" className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-2 text-muted-foreground">No banners yet.</p>
              <p className="text-sm text-muted-foreground">Upload your first banner above.</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {banners.map((banner) => (
                <BannerCard
                  key={banner.id}
                  banner={banner}
                  isNew={newIds.has(banner.id)}
                  onDelete={() => setPendingDelete(banner)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this banner?"
        description={`"${pendingDelete?.alt || "This banner"}" will be permanently removed from the homepage rotation. This can't be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}