// app/admin/banners/page.tsx
"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { UploadCloud, Trash2, Image, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    const res = await fetch("/api/banners", { cache: "no-store" });
    const data = await res.json();
    setBanners(data.banners ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", alt || "Hero banner");
    await fetch("/api/banners", { method: "POST", body: formData });
    setFile(null);
    setAlt("");
    setUploading(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    await fetch(`/api/banners/${id}`, { method: "DELETE" });
    load();
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
              <Image className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-2 text-muted-foreground">No banners uploaded yet.</p>
              <p className="text-sm text-muted-foreground">Upload your first banner above.</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {banners.map((banner, index) => (
                <Card key={banner.id} className="overflow-hidden border-border shadow-sm hover:shadow-md transition-shadow group">
                  <div className="relative aspect-video bg-primary/5">
                    <img src={banner.url} alt={banner.alt} className="h-full w-full object-cover" />
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