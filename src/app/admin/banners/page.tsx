// AdminBannersPage.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { AdminNav } from "@/components/AdminNav";
import Image from "next/image";

const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`bg-white rounded-xl border border-border shadow-sm ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`px-6 py-4 border-b border-border ${className}`}>
      {children}
    </div>
  );
};

const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={`text-lg font-semibold text-foreground ${className}`}>{children}</h3>
  );
};

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`px-6 py-4 ${className}`}>{children}</div>
  );
};

const Button = ({
  children,
  type = "button",
  variant = "default",
  size = "default",
  disabled = false,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "destructive";
  size?: "default" | "icon";
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variantStyles = {
    default: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/40",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/40",
  };
  const sizeStyles = {
    default: "h-10 px-4 py-2 text-sm rounded-lg",
    icon: "h-8 w-8 rounded-xl",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const UploadCloud = ({ className = "", size = 32 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <path d="M16 16l-4-4-4 4"></path>
    <path d="M12 12v9"></path>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
    <polyline points="16 16 12 12 8 16"></polyline>
  </svg>
);

const Trash2 = ({ className = "", size = 16 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const ImageIcon = ({ className = "", size = 48 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const Plus = ({ className = "", size = 16 }) => (
  <svg
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    height={size}
    width={size}
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

type BannerImage = {
  id: string;
  url: string;
  alt: string;
  createdAt: number;
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerImage[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/banners");
      setBanners(res.data.banners ?? []);
    } catch (error) {
      console.error("Failed to load banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", alt || "Hero banner");
      await axios.post("/api/banners", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      setAlt("");
      await load();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      await axios.delete(`/api/banners/${id}`);
      await load();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <AdminNav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <p className="font-utility text-sm font-semibold text-primary">Content Management</p>
          <h1 className="font-display text-3xl font-bold text-foreground">Hero Banner Manager</h1>
          <p className="mt-1 text-muted-foreground">Upload and manage images for the homepage hero banner rotation.</p>
        </div>

        <Card className="mb-8 overflow-hidden border-border shadow-sm">
          <CardHeader className="border-b border-border bg-primary/5">
            <CardTitle>Upload New Banner</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <div
                  className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 transition-all ${
                    file ? "border-primary/60 bg-primary/5" : "border-border hover:border-primary/40 hover:bg-primary/5"
                  }`}
                  onClick={() => document.getElementById("bannerFileInput")?.click()}
                >
                  <UploadCloud className={`h-8 w-8 ${file ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-sm font-medium text-foreground">
                    {file ? file.name : "Click to choose an image"}
                  </span>
                  <span className="text-xs text-muted-foreground">PNG, JPG, WebP up to 5MB</span>
                  <input
                    id="bannerFileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground">Alt Text</label>
                  <input
                    type="text"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                    placeholder="Image description"
                    className="mt-1 w-full rounded-xl border border-border px-4 py-2 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <Button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full gap-2 rounded-xl bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload Banner"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground">Current Banners</h2>
            <span className="text-sm text-muted-foreground">{banners.length} images</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary"></div>
            </div>
          ) : banners.length === 0 ? (
            <Card className="border-dashed border-2 p-12 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-2 text-muted-foreground">No banners uploaded yet.</p>
              <p className="text-sm text-muted-foreground">Upload your first banner above.</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {banners.map((banner, index) => (
                <Card key={banner.id} className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow group">
                  <div className="relative aspect-video bg-primary/5">
                    <Image src={banner.url} alt={banner.alt} fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Button
                      onClick={() => handleDelete(banner.id)}
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-foreground truncate">{banner.alt || `Banner ${index + 1}`}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(banner.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}