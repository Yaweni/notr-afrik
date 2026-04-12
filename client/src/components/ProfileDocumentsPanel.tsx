import { useState } from "react";
import { ExternalLink, FileBadge2, FilePlus2, Link2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useI18n } from "@/context/LanguageContext";
import { useCreateProfileDocument, useDeleteProfileDocument, useProfileDocuments } from "@/hooks/useApi";
import type { ProfileDocumentCategory } from "@/types";

const fieldClassName = "flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export default function ProfileDocumentsPanel() {
  const { isFrench, formatDate } = useI18n();
  const { data: documents, isLoading } = useProfileDocuments();
  const createDocument = useCreateProfileDocument();
  const deleteDocument = useDeleteProfileDocument();
  const [form, setForm] = useState<{ name: string; category: ProfileDocumentCategory; fileUrl: string; notes: string }>({
    name: "",
    category: "general",
    fileUrl: "",
    notes: "",
  });

  const copy = isFrench
    ? {
        title: "Documents reutilisables",
        subtitle: "Conservez ici les liens de CV, pieces d'identite, justificatifs financiers ou autres fichiers recurrents pour vos futurs dossiers.",
        addTitle: "Ajouter un document",
        addSubtitle: "Enregistrez un lien deja disponible en ligne pour le retrouver rapidement lors d'une nouvelle demande.",
        name: "Nom du document",
        category: "Categorie",
        url: "Lien du document",
        notes: "Notes",
        optional: "optionnel",
        namePlaceholder: "CV principal, passeport, releve bancaire...",
        urlPlaceholder: "https://...",
        notesPlaceholder: "Reference utile pour le bureau ou pour vous meme...",
        add: "Ajouter",
        adding: "Ajout...",
        open: "Ouvrir",
        remove: "Supprimer",
        removing: "Suppression...",
        empty: "Aucun document reutilisable enregistre pour le moment.",
        saved: "Document ajoute",
        deleted: "Document supprime",
        saveFailed: "Impossible d'ajouter le document",
        deleteFailed: "Impossible de supprimer le document",
        required: "Le nom et un lien valide sont requis",
        cv: "CV",
        identity: "Identite",
        education: "Etudes",
        finance: "Finance",
        travel: "Voyage",
        general: "General",
        addedOn: "Ajoute le",
      }
    : {
        title: "Reusable documents",
        subtitle: "Keep links to CVs, identity records, financial proofs, or other recurring files here for future applications.",
        addTitle: "Add document",
        addSubtitle: "Save a link that already exists online so you can reuse it quickly when a new case starts.",
        name: "Document name",
        category: "Category",
        url: "Document link",
        notes: "Notes",
        optional: "optional",
        namePlaceholder: "Main CV, passport, bank statement...",
        urlPlaceholder: "https://...",
        notesPlaceholder: "Useful reference for the office or for yourself...",
        add: "Add document",
        adding: "Adding...",
        open: "Open",
        remove: "Remove",
        removing: "Removing...",
        empty: "No reusable documents saved yet.",
        saved: "Document added",
        deleted: "Document removed",
        saveFailed: "Unable to add document",
        deleteFailed: "Unable to remove document",
        required: "A name and valid link are required",
        cv: "CV",
        identity: "Identity",
        education: "Education",
        finance: "Finance",
        travel: "Travel",
        general: "General",
        addedOn: "Added on",
      };

  const categoryLabels: Record<ProfileDocumentCategory, string> = {
    cv: copy.cv,
    identity: copy.identity,
    education: copy.education,
    finance: copy.finance,
    travel: copy.travel,
    general: copy.general,
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name.trim() || !form.fileUrl.trim()) {
      toast.error(copy.required);
      return;
    }

    try {
      await createDocument.mutateAsync({
        name: form.name.trim(),
        category: form.category,
        fileUrl: form.fileUrl.trim(),
        notes: form.notes.trim() || undefined,
      });
      toast.success(copy.saved);
      setForm({ name: "", category: "general", fileUrl: "", notes: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || copy.saveFailed);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument.mutateAsync(id);
      toast.success(copy.deleted);
    } catch (error: any) {
      toast.error(error.response?.data?.error || copy.deleteFailed);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/20">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
              <FileBadge2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{copy.title}</CardTitle>
              <CardDescription className="mt-1">{copy.subtitle}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading...</div>
          ) : documents && documents.length > 0 ? (
            documents.map((document) => (
              <div key={document.id} className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-semibold text-foreground">{document.name}</div>
                      <Badge variant="outline">{categoryLabels[document.category]}</Badge>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <Link2 className="h-4 w-4" />
                      <a href={document.fileUrl} target="_blank" rel="noreferrer" className="truncate hover:text-primary hover:underline">
                        {document.fileUrl}
                      </a>
                    </div>
                    {document.notes && <p className="mt-3 text-sm leading-6 text-muted-foreground">{document.notes}</p>}
                    <div className="mt-3 text-xs text-muted-foreground">{copy.addedOn} {formatDate(document.uploadedAt)}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                      <a href={document.fileUrl} target="_blank" rel="noreferrer">
                        {copy.open}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => handleDelete(document.id)} disabled={deleteDocument.isPending}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 px-5 py-10 text-sm text-muted-foreground">
              {copy.empty}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/20">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
              <FilePlus2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{copy.addTitle}</CardTitle>
              <CardDescription className="mt-1">{copy.addSubtitle}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleCreate} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="profile-document-name">{copy.name}</Label>
              <Input
                id="profile-document-name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder={copy.namePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-document-category">{copy.category}</Label>
              <select
                id="profile-document-category"
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as ProfileDocumentCategory }))}
                className={fieldClassName}
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-document-url">{copy.url}</Label>
              <Input
                id="profile-document-url"
                value={form.fileUrl}
                onChange={(event) => setForm((current) => ({ ...current, fileUrl: event.target.value }))}
                placeholder={copy.urlPlaceholder}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-document-notes">{copy.notes} <span className="text-muted-foreground">({copy.optional})</span></Label>
              <Textarea
                id="profile-document-notes"
                value={form.notes}
                onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
                rows={4}
                placeholder={copy.notesPlaceholder}
              />
            </div>

            <Button type="submit" disabled={createDocument.isPending} className="w-full">
              {createDocument.isPending ? copy.adding : copy.add}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}