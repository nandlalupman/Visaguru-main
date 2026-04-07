"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

type Tab = "services" | "testimonials" | "videos" | "blog" | "faq" | "pricing" | "stats" | "config";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "services", label: "Services", icon: "🌐" },
  { key: "testimonials", label: "Reviews", icon: "⭐" },
  { key: "videos", label: "Videos", icon: "🎬" },
  { key: "blog", label: "Blog", icon: "📝" },
  { key: "faq", label: "FAQ", icon: "❓" },
  { key: "pricing", label: "Pricing", icon: "💰" },
  { key: "stats", label: "Stats", icon: "📊" },
  { key: "config", label: "Site Config", icon: "⚙️" },
];

const TAB_DESCRIPTIONS: Record<Tab, string> = {
  services: "Country service pages and offerings",
  testimonials: "Client proof and approval feedback",
  videos: "Video testimonials and embeds",
  blog: "SEO authority content",
  faq: "Common questions by service",
  pricing: "Packages and payment amounts",
  stats: "Homepage numbers — edit & show/hide",
  config: "Header, footer, legal, and homepage copy",
};

/* ================================================================
   Shared helpers
   ================================================================ */

function cls(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

async function apiFetch(url: string, opts?: RequestInit) {
  const res = await fetch(url, {
    ...opts,
    headers: { "Content-Type": "application/json", ...opts?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? `Request failed (${res.status})`);
  }
  return res.json();
}

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className={cls(
      "fixed bottom-6 right-6 z-50 rounded-xl px-5 py-3 text-sm font-medium shadow-lg transition-all",
      type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
    )}>
      {message}
    </div>
  );
}

/* The create/edit modal wrapper */
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-[var(--color-navy)]">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">✕</button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function FieldInput({ label, value, onChange, type = "text", textarea = false, rows = 3 }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; textarea?: boolean; rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
      {textarea ? (
        <textarea
          value={value} onChange={(e) => onChange(e.target.value)} rows={rows}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]"
        />
      ) : (
        <input
          type={type} value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none transition focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]"
        />
      )}
    </label>
  );
}

function FieldCheck({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded accent-[var(--color-gold)]" />
      {label}
    </label>
  );
}

function SaveBtn({ loading, label = "Save" }: { loading: boolean; label?: string }) {
  return (
    <button
      type="submit" disabled={loading}
      className={cls(
        "mt-4 rounded-full px-6 py-2.5 text-sm font-semibold text-white transition",
        loading ? "bg-gray-400 cursor-wait" : "bg-[var(--color-navy)] hover:bg-[var(--color-navy-light)]"
      )}
    >
      {loading ? "Saving…" : label}
    </button>
  );
}

function DeleteBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      type="button" onClick={onClick} disabled={loading}
      className="rounded-full border border-red-200 px-4 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
    >
      {loading ? "…" : "Delete"}
    </button>
  );
}

/* ================================================================
   SERVICES PANEL
   ================================================================ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ServicesPanel({ toast }: { toast: (msg: string, type: "success" | "error") => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await apiFetch("/api/admin/services")); } catch { toast("Failed to load services", "error"); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing.id) {
        await apiFetch(`/api/admin/services/${editing.id}`, { method: "PATCH", body: JSON.stringify(editing) });
        toast("Service updated", "success");
      } else {
        await apiFetch("/api/admin/services", { method: "POST", body: JSON.stringify(editing) });
        toast("Service created", "success");
      }
      setEditing(null);
      load();
    } catch { toast("Failed to save service", "error"); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try { await apiFetch(`/api/admin/services/${id}`, { method: "DELETE" }); toast("Deleted", "success"); load(); }
    catch { toast("Delete failed", "error"); }
  };

  const newItem = () => setEditing({ slug: "", flag: "", title: "", subtitle: "", description: "", accent: "accent-uk", price: "", pricingAnalysis: "", pricingFull: "", pricingExpress: "", sortOrder: items.length, published: true });

  if (loading) return <p className="py-8 text-center text-sm text-gray-400">Loading services…</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{items.length} services</p>
        <button onClick={newItem} className="rounded-full bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-navy)] transition hover:brightness-110">+ Add Service</button>
      </div>
      <div className="space-y-2">
        {items.map((s) => (
          <div key={s.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 transition hover:shadow-sm">
            <span className="text-2xl">{s.flag}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--color-navy)] truncate">{s.title}</p>
              <p className="text-xs text-gray-400">/{s.slug} · {s.published ? "Published" : "Draft"}</p>
            </div>
            <button onClick={() => setEditing({ ...s, reasonStats: s.reasonStats, differentiators: s.differentiators, testimonials: s.testimonials })} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-[var(--color-navy)] transition hover:bg-gray-50">Edit</button>
            <DeleteBtn onClick={() => remove(s.id)} loading={false} />
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? "Edit Service" : "New Service"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <FieldInput label="Slug" value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: v })} />
              <FieldInput label="Flag Emoji" value={editing.flag} onChange={(v) => setEditing({ ...editing, flag: v })} />
            </div>
            <FieldInput label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <FieldInput label="Subtitle" value={editing.subtitle} onChange={(v) => setEditing({ ...editing, subtitle: v })} />
            <FieldInput label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} textarea />
            <div className="grid gap-3 md:grid-cols-3">
              <FieldInput label="Price Label" value={editing.price} onChange={(v) => setEditing({ ...editing, price: v })} />
              <FieldInput label="Accent" value={editing.accent} onChange={(v) => setEditing({ ...editing, accent: v })} />
              <FieldInput label="Sort Order" value={String(editing.sortOrder)} onChange={(v) => setEditing({ ...editing, sortOrder: parseInt(v) || 0 })} type="number" />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <FieldInput label="Analysis Price" value={editing.pricingAnalysis} onChange={(v) => setEditing({ ...editing, pricingAnalysis: v })} />
              <FieldInput label="Full Recovery Price" value={editing.pricingFull} onChange={(v) => setEditing({ ...editing, pricingFull: v })} />
              <FieldInput label="Express Price" value={editing.pricingExpress} onChange={(v) => setEditing({ ...editing, pricingExpress: v })} />
            </div>
            <FieldCheck label="Published" checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
            <SaveBtn loading={saving} />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ================================================================
   TESTIMONIALS PANEL
   ================================================================ */

function TestimonialsPanel({ toast }: { toast: (msg: string, type: "success" | "error") => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await apiFetch("/api/admin/testimonials")); } catch { toast("Failed to load", "error"); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing.id) {
        await apiFetch(`/api/admin/testimonials/${editing.id}`, { method: "PATCH", body: JSON.stringify(editing) });
        toast("Updated", "success");
      } else {
        await apiFetch("/api/admin/testimonials", { method: "POST", body: JSON.stringify(editing) });
        toast("Created", "success");
      }
      setEditing(null); load();
    } catch { toast("Save failed", "error"); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await apiFetch(`/api/admin/testimonials/${id}`, { method: "DELETE" }); toast("Deleted", "success"); load(); }
    catch { toast("Delete failed", "error"); }
  };

  const newItem = () => setEditing({ name: "", country: "", role: "", date: "", feedback: "", rating: 5, featured: false, sortOrder: items.length, published: true });

  if (loading) return <p className="py-8 text-center text-sm text-gray-400">Loading…</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{items.length} testimonials</p>
        <button onClick={newItem} className="rounded-full bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-navy)] transition hover:brightness-110">+ Add Testimonial</button>
      </div>
      <div className="space-y-2">
        {items.map((t) => (
          <div key={t.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-gold)] to-[var(--color-navy)] text-sm font-bold text-white">{t.name[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--color-navy)] truncate">{t.name} <span className="text-xs font-normal text-gray-400">· {t.country}</span></p>
              <p className="text-xs text-gray-400 truncate">{t.feedback.slice(0, 80)}…</p>
            </div>
            <span className="text-xs text-amber-500">{"★".repeat(t.rating)}</span>
            <button onClick={() => setEditing({ ...t })} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-[var(--color-navy)] hover:bg-gray-50">Edit</button>
            <DeleteBtn onClick={() => remove(t.id)} loading={false} />
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? "Edit Testimonial" : "New Testimonial"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <FieldInput label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <FieldInput label="Country Label" value={editing.country} onChange={(v) => setEditing({ ...editing, country: v })} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <FieldInput label="Role" value={editing.role} onChange={(v) => setEditing({ ...editing, role: v })} />
              <FieldInput label="Date" value={editing.date} onChange={(v) => setEditing({ ...editing, date: v })} />
            </div>
            <FieldInput label="Feedback" value={editing.feedback} onChange={(v) => setEditing({ ...editing, feedback: v })} textarea rows={4} />
            <div className="grid gap-3 md:grid-cols-2">
              <FieldInput label="Rating (1-5)" value={String(editing.rating)} onChange={(v) => setEditing({ ...editing, rating: Math.min(5, Math.max(1, parseInt(v) || 5)) })} type="number" />
              <FieldInput label="Sort Order" value={String(editing.sortOrder)} onChange={(v) => setEditing({ ...editing, sortOrder: parseInt(v) || 0 })} type="number" />
            </div>
            <div className="flex gap-4">
              <FieldCheck label="Featured" checked={editing.featured} onChange={(v) => setEditing({ ...editing, featured: v })} />
              <FieldCheck label="Published" checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
            </div>
            <SaveBtn loading={saving} />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ================================================================
   VIDEOS PANEL
   ================================================================ */

function VideosPanel({ toast }: { toast: (msg: string, type: "success" | "error") => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await apiFetch("/api/admin/videos")); } catch { toast("Failed to load", "error"); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing.id) {
        await apiFetch(`/api/admin/videos/${editing.id}`, { method: "PATCH", body: JSON.stringify(editing) });
        toast("Updated", "success");
      } else {
        await apiFetch("/api/admin/videos", { method: "POST", body: JSON.stringify(editing) });
        toast("Created", "success");
      }
      setEditing(null); load();
    } catch { toast("Save failed", "error"); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await apiFetch(`/api/admin/videos/${id}`, { method: "DELETE" }); toast("Deleted", "success"); load(); }
    catch { toast("Delete failed", "error"); }
  };

  const newItem = () => setEditing({ title: "", videoUrl: "", thumbnailUrl: "", country: "", featured: false, sortOrder: items.length, published: true });

  if (loading) return <p className="py-8 text-center text-sm text-gray-400">Loading…</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{items.length} videos</p>
        <button onClick={newItem} className="rounded-full bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-navy)] transition hover:brightness-110">+ Add Video</button>
      </div>
      <div className="space-y-2">
        {items.map((v) => (
          <div key={v.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
            <span className="text-2xl">🎬</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--color-navy)] truncate">{v.title}</p>
              <p className="text-xs text-gray-400 truncate">{v.videoUrl}</p>
            </div>
            <button onClick={() => setEditing({ ...v })} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-[var(--color-navy)] hover:bg-gray-50">Edit</button>
            <DeleteBtn onClick={() => remove(v.id)} loading={false} />
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? "Edit Video" : "New Video"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <FieldInput label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <FieldInput label="Video URL" value={editing.videoUrl} onChange={(v) => setEditing({ ...editing, videoUrl: v })} />
            <FieldInput label="Thumbnail URL" value={editing.thumbnailUrl} onChange={(v) => setEditing({ ...editing, thumbnailUrl: v })} />
            <div className="grid gap-3 md:grid-cols-2">
              <FieldInput label="Country" value={editing.country} onChange={(v) => setEditing({ ...editing, country: v })} />
              <FieldInput label="Sort Order" value={String(editing.sortOrder)} onChange={(v) => setEditing({ ...editing, sortOrder: parseInt(v) || 0 })} type="number" />
            </div>
            <div className="flex gap-4">
              <FieldCheck label="Featured" checked={editing.featured} onChange={(v) => setEditing({ ...editing, featured: v })} />
              <FieldCheck label="Published" checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
            </div>
            <SaveBtn loading={saving} />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ================================================================
   BLOG PANEL
   ================================================================ */

function BlogPanel({ toast }: { toast: (msg: string, type: "success" | "error") => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await apiFetch("/api/admin/blog")); } catch { toast("Failed to load", "error"); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...editing };
      // Parse content from text if it's a string
      if (typeof payload.content === "string") {
        try { payload.content = JSON.parse(payload.content); } catch { /* keep as is */ }
      }
      if (editing.id) {
        await apiFetch(`/api/admin/blog/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) });
        toast("Updated", "success");
      } else {
        await apiFetch("/api/admin/blog", { method: "POST", body: JSON.stringify(payload) });
        toast("Created", "success");
      }
      setEditing(null); load();
    } catch { toast("Save failed", "error"); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await apiFetch(`/api/admin/blog/${id}`, { method: "DELETE" }); toast("Deleted", "success"); load(); }
    catch { toast("Delete failed", "error"); }
  };

  const newItem = () => setEditing({ slug: "", title: "", description: "", content: "[]", publishedAt: new Date().toISOString().slice(0, 10), readTime: "", cta: "", status: "draft" });

  if (loading) return <p className="py-8 text-center text-sm text-gray-400">Loading…</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{items.length} posts</p>
        <button onClick={newItem} className="rounded-full bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-navy)] transition hover:brightness-110">+ New Post</button>
      </div>
      <div className="space-y-2">
        {items.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
            <span className="text-2xl">📝</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--color-navy)] truncate">{p.title}</p>
              <p className="text-xs text-gray-400">/{p.slug} · {p.status} · {p.publishedAt}</p>
            </div>
            <button onClick={() => setEditing({ ...p, content: typeof p.content === "string" ? p.content : JSON.stringify(p.content, null, 2) })} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-[var(--color-navy)] hover:bg-gray-50">Edit</button>
            <DeleteBtn onClick={() => remove(p.id)} loading={false} />
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? "Edit Post" : "New Blog Post"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <FieldInput label="Slug" value={editing.slug} onChange={(v) => setEditing({ ...editing, slug: v })} />
              <FieldInput label="Published Date" value={editing.publishedAt} onChange={(v) => setEditing({ ...editing, publishedAt: v })} type="date" />
            </div>
            <FieldInput label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <FieldInput label="Description" value={editing.description} onChange={(v) => setEditing({ ...editing, description: v })} textarea />
            <FieldInput label="Read Time" value={editing.readTime} onChange={(v) => setEditing({ ...editing, readTime: v })} />
            <FieldInput label="CTA Text" value={editing.cta} onChange={(v) => setEditing({ ...editing, cta: v })} />
            <FieldInput label="Content (JSON)" value={typeof editing.content === "string" ? editing.content : JSON.stringify(editing.content, null, 2)} onChange={(v) => setEditing({ ...editing, content: v })} textarea rows={8} />
            <label className="block">
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Status</span>
              <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <SaveBtn loading={saving} />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ================================================================
   FAQ PANEL
   ================================================================ */

function FaqPanel({ toast }: { toast: (msg: string, type: "success" | "error") => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await apiFetch("/api/admin/faq")); } catch { toast("Failed to load", "error"); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing.id) {
        await apiFetch(`/api/admin/faq/${editing.id}`, { method: "PATCH", body: JSON.stringify(editing) });
        toast("Updated", "success");
      } else {
        await apiFetch("/api/admin/faq", { method: "POST", body: JSON.stringify(editing) });
        toast("Created", "success");
      }
      setEditing(null); load();
    } catch { toast("Save failed", "error"); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await apiFetch(`/api/admin/faq/${id}`, { method: "DELETE" }); toast("Deleted", "success"); load(); }
    catch { toast("Delete failed", "error"); }
  };

  const newItem = () => setEditing({ question: "", answer: "", serviceId: null, sortOrder: items.length, published: true });

  if (loading) return <p className="py-8 text-center text-sm text-gray-400">Loading…</p>;

  const globalFaqs = items.filter((f) => !f.serviceId);
  const serviceFaqs = items.filter((f) => f.serviceId);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{items.length} FAQs ({globalFaqs.length} global, {serviceFaqs.length} service-specific)</p>
        <button onClick={newItem} className="rounded-full bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-navy)] transition hover:brightness-110">+ Add FAQ</button>
      </div>
      {globalFaqs.length > 0 && <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Global FAQs</p>}
      <div className="space-y-2">
        {items.map((f) => (
          <div key={f.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
            <span className="text-lg">❓</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--color-navy)] text-sm truncate">{f.question}</p>
              <p className="text-xs text-gray-400">{f.service ? `Service: ${f.service.title}` : "Global"}</p>
            </div>
            <button onClick={() => setEditing({ ...f })} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-[var(--color-navy)] hover:bg-gray-50">Edit</button>
            <DeleteBtn onClick={() => remove(f.id)} loading={false} />
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? "Edit FAQ" : "New FAQ"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <FieldInput label="Question" value={editing.question} onChange={(v) => setEditing({ ...editing, question: v })} />
            <FieldInput label="Answer" value={editing.answer} onChange={(v) => setEditing({ ...editing, answer: v })} textarea rows={4} />
            <div className="grid gap-3 md:grid-cols-2">
              <FieldInput label="Service ID (blank = global)" value={editing.serviceId ?? ""} onChange={(v) => setEditing({ ...editing, serviceId: v || null })} />
              <FieldInput label="Sort Order" value={String(editing.sortOrder)} onChange={(v) => setEditing({ ...editing, sortOrder: parseInt(v) || 0 })} type="number" />
            </div>
            <FieldCheck label="Published" checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
            <SaveBtn loading={saving} />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ================================================================
   PRICING PANEL
   ================================================================ */

function PricingPanel({ toast }: { toast: (msg: string, type: "success" | "error") => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await apiFetch("/api/admin/pricing")); } catch { toast("Failed to load", "error"); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...editing };
      if (typeof payload.features === "string") {
        try { payload.features = JSON.parse(payload.features); } catch { /* keep as is */ }
      }
      if (editing.id) {
        await apiFetch(`/api/admin/pricing/${editing.id}`, { method: "PATCH", body: JSON.stringify(payload) });
        toast("Updated", "success");
      } else {
        await apiFetch("/api/admin/pricing", { method: "POST", body: JSON.stringify(payload) });
        toast("Created", "success");
      }
      setEditing(null); load();
    } catch { toast("Save failed", "error"); }
    setSaving(false);
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    try { await apiFetch(`/api/admin/pricing/${id}`, { method: "DELETE" }); toast("Deleted", "success"); load(); }
    catch { toast("Delete failed", "error"); }
  };

  const newItem = () => setEditing({ name: "", price: "", note: "", features: "[]", popular: false, amountInr: 0, sortOrder: items.length, published: true });

  if (loading) return <p className="py-8 text-center text-sm text-gray-400">Loading…</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">{items.length} pricing tiers</p>
        <button onClick={newItem} className="rounded-full bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-navy)] transition hover:brightness-110">+ Add Tier</button>
      </div>
      <div className="space-y-2">
        {items.map((t) => (
          <div key={t.id} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
            <span className="text-2xl">💰</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--color-navy)]">{t.name} <span className="text-sm font-normal text-gray-400">· {t.price}</span></p>
              <p className="text-xs text-gray-400">{t.popular ? "⭐ Popular" : ""} {t.note}</p>
            </div>
            <button onClick={() => setEditing({ ...t, features: typeof t.features === "string" ? t.features : JSON.stringify(t.features, null, 2) })} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-[var(--color-navy)] hover:bg-gray-50">Edit</button>
            <DeleteBtn onClick={() => remove(t.id)} loading={false} />
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={editing.id ? "Edit Pricing Tier" : "New Pricing Tier"} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <FieldInput label="Name" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
              <FieldInput label="Price Label" value={editing.price} onChange={(v) => setEditing({ ...editing, price: v })} />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <FieldInput label="Note" value={editing.note} onChange={(v) => setEditing({ ...editing, note: v })} />
              <FieldInput label="Amount in INR (paise)" value={String(editing.amountInr)} onChange={(v) => setEditing({ ...editing, amountInr: parseInt(v) || 0 })} type="number" />
            </div>
            <FieldInput label="Features (JSON array)" value={typeof editing.features === "string" ? editing.features : JSON.stringify(editing.features, null, 2)} onChange={(v) => setEditing({ ...editing, features: v })} textarea rows={5} />
            <div className="grid gap-3 md:grid-cols-2">
              <FieldInput label="Sort Order" value={String(editing.sortOrder)} onChange={(v) => setEditing({ ...editing, sortOrder: parseInt(v) || 0 })} type="number" />
              <div className="flex flex-col gap-2 pt-5">
                <FieldCheck label="Popular (highlighted)" checked={editing.popular} onChange={(v) => setEditing({ ...editing, popular: v })} />
                <FieldCheck label="Published" checked={editing.published} onChange={(v) => setEditing({ ...editing, published: v })} />
              </div>
            </div>
            <SaveBtn loading={saving} />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ================================================================
   STATS PANEL — Edit & toggle homepage trust stats
   ================================================================ */

type StatItem = { value: string; label: string; visible: boolean };

function StatsPanel({ toast }: { toast: (msg: string, type: "success" | "error") => void }) {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<{ index: number; stat: StatItem } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const configs = await apiFetch("/api/admin/site-config");
      const trustConfig = configs.find((c: { key: string; value: unknown }) => c.key === "trust_stats");
      if (trustConfig) {
        let parsed: unknown;
        try { parsed = typeof trustConfig.value === "string" ? JSON.parse(trustConfig.value) : trustConfig.value; } catch { parsed = []; }
        if (Array.isArray(parsed)) {
          setStats(parsed.map((s: { value?: string; label?: string; visible?: boolean }) => ({
            value: s.value ?? "",
            label: s.label ?? "",
            visible: s.visible !== false,
          })));
        }
      } else {
        // Default trust stats
        setStats([
          { value: "500+", label: "Cases Handled", visible: true },
          { value: "94%", label: "Approval Rate", visible: true },
          { value: "48hr", label: "Average Delivery", visible: true },
          { value: "5★", label: "Average Rating", visible: true },
        ]);
      }
    } catch { toast("Failed to load stats", "error"); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const saveAll = async () => {
    setSaving(true);
    try {
      await apiFetch("/api/admin/site-config", {
        method: "PATCH",
        body: JSON.stringify({ trust_stats: stats }),
      });
      toast("Stats saved successfully", "success");
    } catch { toast("Failed to save stats", "error"); }
    setSaving(false);
  };

  const toggleVisibility = (index: number) => {
    setStats((prev) => prev.map((s, i) => i === index ? { ...s, visible: !s.visible } : s));
  };

  const removeItem = (index: number) => {
    if (!confirm("Remove this stat?")) return;
    setStats((prev) => prev.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setStats((prev) => [...prev, { value: "0", label: "New Stat", visible: true }]);
  };

  const moveItem = (from: number, direction: "up" | "down") => {
    const to = direction === "up" ? from - 1 : from + 1;
    if (to < 0 || to >= stats.length) return;
    setStats((prev) => {
      const arr = [...prev];
      [arr[from], arr[to]] = [arr[to], arr[from]];
      return arr;
    });
  };

  if (loading) return <p className="py-8 text-center text-sm text-gray-400">Loading stats…</p>;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--color-navy)]">Homepage Trust Stats</p>
          <p className="text-xs text-gray-500">Edit numbers shown on homepage and service pages. Toggle visibility to hide/show.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={addItem} className="rounded-full bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-navy)] transition hover:brightness-110">+ Add Stat</button>
          <button type="button" onClick={saveAll} disabled={saving} className={cls(
            "rounded-full px-6 py-2 text-sm font-semibold text-white transition",
            saving ? "bg-gray-400 cursor-wait" : "bg-[var(--color-navy)] hover:bg-[var(--color-navy-light)]"
          )}>{saving ? "Saving…" : "💾 Save All"}</button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="mb-5 rounded-2xl border border-dashed border-[var(--color-gold)] bg-[#fffdf5] p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-gold)]">Live Preview</p>
        <div className="grid gap-3 md:grid-cols-4">
          {stats.filter(s => s.visible).map((s, i) => (
            <div key={i} className="rounded-xl bg-white p-4 text-center shadow-sm border border-gray-100">
              <p className="font-mono text-2xl font-semibold text-[var(--color-navy)]">{s.value}</p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">{s.label}</p>
            </div>
          ))}
          {stats.filter(s => s.visible).length === 0 && (
            <p className="col-span-4 text-center text-sm text-gray-400">All stats are hidden. Toggle them visible below.</p>
          )}
        </div>
      </div>

      {/* Stats List */}
      <div className="space-y-2">
        {stats.map((stat, index) => (
          <div key={index} className={cls(
            "flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition",
            stat.visible ? "border-gray-100" : "border-red-100 bg-red-50/30 opacity-60"
          )}>
            <div className="flex flex-col gap-0.5">
              <button type="button" onClick={() => moveItem(index, "up")} disabled={index === 0} className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30">▲</button>
              <button type="button" onClick={() => moveItem(index, "down")} disabled={index === stats.length - 1} className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30">▼</button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--color-navy)]">
                <span className="font-mono text-lg">{stat.value}</span>
                <span className="ml-2 text-sm font-normal text-gray-500">— {stat.label}</span>
              </p>
              <p className="text-xs text-gray-400">{stat.visible ? "✅ Visible on site" : "🚫 Hidden from visitors"}</p>
            </div>
            <button type="button" onClick={() => toggleVisibility(index)} className={cls(
              "rounded-full px-3 py-1 text-xs font-semibold transition",
              stat.visible ? "border border-green-200 text-green-700 hover:bg-green-50" : "border border-red-200 text-red-600 hover:bg-red-50"
            )}>{stat.visible ? "Hide" : "Show"}</button>
            <button type="button" onClick={() => setEditing({ index, stat: { ...stat } })} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-[var(--color-navy)] hover:bg-gray-50">Edit</button>
            <button type="button" onClick={() => removeItem(index)} className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50">✕</button>
          </div>
        ))}
      </div>

      {editing && (
        <Modal title="Edit Stat" onClose={() => setEditing(null)}>
          <form onSubmit={(e) => {
            e.preventDefault();
            setStats((prev) => prev.map((s, i) => i === editing.index ? editing.stat : s));
            setEditing(null);
            toast("Stat updated — click 'Save All' to publish", "success");
          }} className="space-y-3">
            <FieldInput label="Value (e.g. 500+, 94%, 48hr)" value={editing.stat.value} onChange={(v) => setEditing({ ...editing, stat: { ...editing.stat, value: v } })} />
            <FieldInput label="Label (e.g. Cases Handled)" value={editing.stat.label} onChange={(v) => setEditing({ ...editing, stat: { ...editing.stat, label: v } })} />
            <FieldCheck label="Visible on site" checked={editing.stat.visible} onChange={(v) => setEditing({ ...editing, stat: { ...editing.stat, visible: v } })} />
            <SaveBtn loading={false} label="Apply" />
          </form>
        </Modal>
      )}

      <p className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500">
        💡 <strong>Tip:</strong> Changes are applied to the live site only after clicking &quot;Save All&quot;. Hidden stats are not shown to visitors but remain saved.
      </p>
    </div>
  );
}

/* ================================================================
   SITE CONFIG PANEL
   ================================================================ */

function SiteConfigPanel({ toast }: { toast: (msg: string, type: "success" | "error") => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setConfigs(await apiFetch("/api/admin/site-config")); } catch { toast("Failed to load", "error"); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let parsedValue;
      try { parsedValue = JSON.parse(editing.value); } catch { parsedValue = editing.value; }
      await apiFetch("/api/admin/site-config", { method: "PATCH", body: JSON.stringify({ [editing.key]: parsedValue }) });
      toast("Config saved", "success");
      setEditing(null); load();
    } catch { toast("Save failed", "error"); }
    setSaving(false);
  };

  if (loading) return <p className="py-8 text-center text-sm text-gray-400">Loading…</p>;

  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">{configs.length} configuration entries</p>
      <div className="space-y-2">
        {configs.map((c) => (
          <div key={c.key} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
            <span className="text-lg">⚙️</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--color-navy)] text-sm">{c.label || c.key}</p>
              <p className="text-xs text-gray-400 font-mono">{c.key}</p>
            </div>
            <button onClick={() => setEditing({ key: c.key, label: c.label, value: typeof c.value === "string" ? c.value : JSON.stringify(JSON.parse(c.value), null, 2) })} className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-[var(--color-navy)] hover:bg-gray-50">Edit</button>
          </div>
        ))}
      </div>
      {editing && (
        <Modal title={`Edit: ${editing.label || editing.key}`} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <FieldInput label="Key" value={editing.key} onChange={() => {}} />
            <FieldInput label="Value (JSON)" value={editing.value} onChange={(v) => setEditing({ ...editing, value: v })} textarea rows={10} />
            <SaveBtn loading={saving} />
          </form>
        </Modal>
      )}
    </div>
  );
}

void SiteConfigPanel;

type SiteConfigTemplate = {
  key: string;
  label: string;
  description: string;
  group: "Brand & Header" | "Footer & Legal" | "Homepage";
  type: "text" | "json";
  aliases?: string[];
  fallbackValue: unknown;
};

const SITE_CONFIG_TEMPLATES: SiteConfigTemplate[] = [
  {
    key: "brand_name",
    label: "Brand Name",
    description: "Main brand shown across header and footer.",
    group: "Brand & Header",
    type: "text",
    fallbackValue: "VisaGuru",
    aliases: ["brandName"],
  },
  {
    key: "brand_since",
    label: "Brand Since Tag",
    description: "Small trust tag shown beside the logo in header.",
    group: "Brand & Header",
    type: "text",
    fallbackValue: "Since 2020",
    aliases: ["brandSince"],
  },
  {
    key: "nav_links",
    label: "Header Nav Links",
    description: "Array of link objects. Example: [{\"href\":\"/services\",\"label\":\"Services\"}]",
    group: "Brand & Header",
    type: "json",
    fallbackValue: [
      { href: "/", label: "Home" },
      { href: "/services", label: "Services" },
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/reviews", label: "Reviews" },
    ],
    aliases: ["header_nav_links", "navLinks"],
  },
  {
    key: "header_login",
    label: "Header Login Link",
    description: "Single login entry for users and admins.",
    group: "Brand & Header",
    type: "json",
    fallbackValue: { href: "/login", label: "Login" },
    aliases: ["headerLogin"],
  },
  {
    key: "header_cta",
    label: "Header CTA Button",
    description: "Primary top CTA button label and destination.",
    group: "Brand & Header",
    type: "json",
    fallbackValue: { href: "/#free-analysis", label: "Free Refusal Analysis" },
    aliases: ["headerCta"],
  },
  {
    key: "footer_link_groups",
    label: "Footer Link Groups",
    description: "Footer columns. Each item requires title and links[] values.",
    group: "Footer & Legal",
    type: "json",
    fallbackValue: [
      { title: "Services", links: [{ href: "/uk-visa", label: "UK Visa" }] },
      { title: "Company", links: [{ href: "/about", label: "About Us" }] },
      { title: "Legal", links: [{ href: "/privacy-policy", label: "Privacy Policy" }] },
    ],
    aliases: ["footerLinkGroups"],
  },
  {
    key: "footer_contact_links",
    label: "Footer Contact Links",
    description: "Contact details as link array: label + href.",
    group: "Footer & Legal",
    type: "json",
    fallbackValue: [
      { label: "Email", href: "mailto:hello@visaguru.live" },
      { label: "WhatsApp", href: "https://wa.me/917737099474" },
      { label: "Phone", href: "tel:+917737099474" },
    ],
    aliases: ["footerContactLinks"],
  },
  {
    key: "footer_social_links",
    label: "Footer Social Links",
    description: "Social icons list with platform and href.",
    group: "Footer & Legal",
    type: "json",
    fallbackValue: [
      { platform: "LinkedIn", href: "https://www.linkedin.com/company/visaguru" },
      { platform: "Instagram", href: "https://www.instagram.com/visaguru" },
      { platform: "YouTube", href: "https://www.youtube.com/@visaguru" },
    ],
    aliases: ["footerSocialLinks"],
  },
  {
    key: "footer_bottom_text",
    label: "Footer Bottom Legal Text",
    description: "Registration and non-affiliation notice.",
    group: "Footer & Legal",
    type: "text",
    fallbackValue:
      "© 2026 VisaGuru | Registered in India (CIN: U12345MH2020PTC123456) | Not affiliated with any government embassy or immigration authority.",
    aliases: ["footerBottomText"],
  },
  {
    key: "hero_title",
    label: "Homepage Hero Title",
    description: "Primary headline above the fold.",
    group: "Homepage",
    type: "text",
    fallbackValue: "Your Visa Was Rejected. Here's How We Fix It.",
    aliases: ["heroTitle"],
  },
  {
    key: "hero_subtitle",
    label: "Homepage Hero Subtitle",
    description: "Supporting copy under the hero heading.",
    group: "Homepage",
    type: "text",
    fallbackValue:
      "We analyze your refusal letter, rebuild your SOP, and give visa officers exactly what they need to say yes.",
    aliases: ["heroSubtitle"],
  },
  {
    key: "trust_stats",
    label: "Trust Stats",
    description: "Metric cards displayed on homepage and service pages.",
    group: "Homepage",
    type: "json",
    fallbackValue: [
      { label: "Cases Handled", value: "500+" },
      { label: "Approval Rate", value: "94%" },
      { label: "Average Delivery", value: "48hr" },
      { label: "Average Rating", value: "5★" },
    ],
    aliases: ["trustStats"],
  },
  {
    key: "process_steps",
    label: "Process Steps",
    description: "Timeline shown on homepage and country pages.",
    group: "Homepage",
    type: "json",
    fallbackValue: [
      { title: "Share Your Refusal Letter", day: "Day 0", description: "Upload your refusal letter securely." },
      { title: "Expert Refusal Analysis", day: "Day 1", description: "We identify officer concerns and build strategy." },
      { title: "SOP + Document Rebuild", day: "Day 1-2", description: "We rewrite your SOP and supporting docs." },
      { title: "Reapply With Confidence", day: "Day 3+", description: "Receive final files and checklist." },
    ],
    aliases: ["processSteps"],
  },
  {
    key: "social_proof_ticker",
    label: "Social Proof Ticker",
    description: "Scrolling approval updates under hero section.",
    group: "Homepage",
    type: "json",
    fallbackValue: [
      "Priya from Mumbai got her Canada visa approved this week",
      "Arjun from Pune received UK student visa approval",
      "Nidhi from Delhi cleared Schengen reapplication",
    ],
    aliases: ["socialProofTicker"],
  },
];

function formatConfigValueForEditor(value: unknown): string {
  if (typeof value !== "string") return JSON.stringify(value, null, 2);
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

function previewConfigValue(value: unknown): string {
  let parsed: unknown = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      parsed = value;
    }
  }
  if (typeof parsed === "string") return parsed.length > 90 ? `${parsed.slice(0, 90)}...` : parsed;
  if (Array.isArray(parsed)) return `${parsed.length} item(s)`;
  if (parsed && typeof parsed === "object") return `${Object.keys(parsed).length} field(s)`;
  return String(parsed ?? "");
}

function SiteConfigPanelV2({ toast }: { toast: (msg: string, type: "success" | "error") => void }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editing, setEditing] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setConfigs(await apiFetch("/api/admin/site-config")); } catch { toast("Failed to load", "error"); }
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const configMap = useMemo(() => {
    const map = new Map<string, { key: string; value: unknown; label?: string }>();
    for (const cfg of configs) map.set(cfg.key, cfg);
    return map;
  }, [configs]);

  const resolveTemplate = useCallback((template: SiteConfigTemplate) => {
    const keys = [template.key, ...(template.aliases ?? [])];
    for (const key of keys) {
      const matched = configMap.get(key);
      if (matched) return matched;
    }
    return null;
  }, [configMap]);

  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SITE_CONFIG_TEMPLATES;
    return SITE_CONFIG_TEMPLATES.filter((template) =>
      [template.label, template.key, template.description, template.group]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  const filteredConfigs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return configs;
    return configs.filter((c) =>
      [c.key, c.label ?? "", String(c.value ?? "")]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [configs, query]);

  const openTemplateEditor = useCallback((template: SiteConfigTemplate) => {
    const existing = resolveTemplate(template);
    setEditing({
      key: existing?.key ?? template.key,
      targetKey: template.key,
      label: template.label,
      value: formatConfigValueForEditor(existing?.value ?? template.fallbackValue),
      isText: template.type === "text",
    });
  }, [resolveTemplate]);

  const addCustomKey = () => {
    setEditing({
      key: "",
      targetKey: "",
      label: "Custom Config",
      value: "",
      isText: false,
    });
  };

  const addMissingDefaults = async () => {
    const payload: Record<string, unknown> = {};
    for (const template of SITE_CONFIG_TEMPLATES) {
      if (!resolveTemplate(template)) payload[template.key] = template.fallbackValue;
    }
    const keys = Object.keys(payload);
    if (keys.length === 0) {
      toast("All recommended settings already exist", "success");
      return;
    }
    try {
      await apiFetch("/api/admin/site-config", { method: "PATCH", body: JSON.stringify(payload) });
      toast(`Added ${keys.length} missing settings`, "success");
      load();
    } catch {
      toast("Failed to add defaults", "error");
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetKey = (editing.targetKey || editing.key || "").trim();
    if (!targetKey) {
      toast("Key is required", "error");
      return;
    }
    setSaving(true);
    try {
      let parsedValue: unknown;
      if (editing.isText) {
        parsedValue = editing.value;
      } else {
        try { parsedValue = JSON.parse(editing.value); } catch { parsedValue = editing.value; }
      }
      await apiFetch("/api/admin/site-config", {
        method: "PATCH",
        body: JSON.stringify({ [targetKey]: parsedValue }),
      });
      toast("Config saved", "success");
      setEditing(null);
      load();
    } catch {
      toast("Save failed", "error");
    }
    setSaving(false);
  };

  if (loading) return <p className="py-8 text-center text-sm text-gray-400">Loading...</p>;

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--color-navy)]">Global Site Settings</p>
          <p className="text-xs text-gray-500">Editable header, footer, legal, and homepage blocks.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search key or label"
            className="min-w-[220px] rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
          />
          <button
            type="button"
            onClick={addMissingDefaults}
            className="rounded-full border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-bg)]"
          >
            Add Missing Defaults
          </button>
          <button
            type="button"
            onClick={addCustomKey}
            className="rounded-full bg-[var(--color-gold)] px-4 py-2 text-xs font-semibold text-[var(--color-navy)] transition hover:brightness-110"
          >
            + Custom Key
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {(["Brand & Header", "Footer & Legal", "Homepage"] as const).map((group) => {
          const cards = filteredTemplates.filter((template) => template.group === group);
          if (cards.length === 0) return null;
          return (
            <section key={group}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-gray-400">{group}</h4>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((template) => {
                  const current = resolveTemplate(template);
                  return (
                    <article key={template.key} className="rounded-xl border border-[var(--color-border)] bg-white p-4">
                      <p className="text-sm font-semibold text-[var(--color-navy)]">{template.label}</p>
                      <p className="mt-1 text-xs text-gray-500">{template.description}</p>
                      <p className="mt-2 font-mono text-[11px] text-gray-400">{current?.key ?? template.key}</p>
                      <p className="mt-2 text-xs text-[var(--color-muted)]">
                        {current ? previewConfigValue(current.value) : "Not configured"}
                      </p>
                      <button
                        type="button"
                        onClick={() => openTemplateEditor(template)}
                        className="mt-3 rounded-full border border-[var(--color-border)] px-3 py-1 text-xs font-semibold text-[var(--color-navy)] transition hover:bg-[var(--color-bg)]"
                      >
                        Edit
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-8">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.1em] text-gray-400">All Keys ({filteredConfigs.length})</h4>
        <div className="space-y-2">
          {filteredConfigs.map((c) => (
            <div key={c.key} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3">
              <span className="text-lg">⚙</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--color-navy)]">{c.label || c.key}</p>
                <p className="font-mono text-xs text-gray-400">{c.key}</p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditing({
                    key: c.key,
                    targetKey: c.key,
                    label: c.label,
                    value: formatConfigValueForEditor(c.value),
                    isText: false,
                  })
                }
                className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-[var(--color-navy)] hover:bg-gray-50"
              >
                Edit
              </button>
            </div>
          ))}
          {filteredConfigs.length === 0 ? (
            <p className="rounded-xl border border-dashed border-[var(--color-border)] bg-white px-4 py-6 text-center text-sm text-gray-400">
              No matching settings found.
            </p>
          ) : null}
        </div>
      </section>

      {editing ? (
        <Modal title={`Edit: ${editing.label || editing.targetKey || editing.key}`} onClose={() => setEditing(null)}>
          <form onSubmit={save} className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <FieldInput
                label="Key"
                value={editing.targetKey ?? editing.key}
                onChange={(v) => setEditing({ ...editing, targetKey: v })}
              />
              <FieldCheck
                label="Treat value as plain text"
                checked={Boolean(editing.isText)}
                onChange={(v) => setEditing({ ...editing, isText: v })}
              />
            </div>
            <FieldInput
              label={editing.isText ? "Value (Text)" : "Value (JSON or Text)"}
              value={editing.value}
              onChange={(v) => setEditing({ ...editing, value: v })}
              textarea
              rows={editing.isText ? 5 : 12}
            />
            <SaveBtn loading={saving} />
          </form>
        </Modal>
      ) : null}
    </div>
  );
}

/* ================================================================
   MAIN CMS MANAGER COMPONENT
   ================================================================ */

export default function AdminCmsManager() {
  const [activeTab, setActiveTab] = useState<Tab>("services");
  const [toastState, setToastState] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToastState({ message, type });
  }, []);

  return (
    <div className="mt-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--color-navy)]">Content Management</h2>
          <p className="mt-1 text-sm text-gray-500">Edit all site content — services, reviews, pricing, blog posts, FAQ, and more.</p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="mb-6 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cls(
              "rounded-2xl border px-4 py-3 text-left transition",
              activeTab === tab.key
                ? "border-[var(--color-gold)] bg-white text-[var(--color-navy)] shadow-sm"
                : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200 hover:bg-white hover:text-[var(--color-navy)]"
            )}
          >
            <p className="text-sm font-semibold">{tab.label}</p>
            <p className="mt-1 text-xs text-gray-400">{TAB_DESCRIPTIONS[tab.key]}</p>
          </button>
        ))}
      </div>

      {/* Panel content */}
      <div className="rounded-2xl border border-gray-100 bg-[var(--color-bg)] p-5">
        {activeTab === "services" && <ServicesPanel toast={showToast} />}
        {activeTab === "testimonials" && <TestimonialsPanel toast={showToast} />}
        {activeTab === "videos" && <VideosPanel toast={showToast} />}
        {activeTab === "blog" && <BlogPanel toast={showToast} />}
        {activeTab === "faq" && <FaqPanel toast={showToast} />}
        {activeTab === "pricing" && <PricingPanel toast={showToast} />}
        {activeTab === "stats" && <StatsPanel toast={showToast} />}
        {activeTab === "config" && <SiteConfigPanelV2 toast={showToast} />}
      </div>

      {toastState && <Toast message={toastState.message} type={toastState.type} onClose={() => setToastState(null)} />}
    </div>
  );
}
