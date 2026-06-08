import { useState, useRef } from "react";
import { useAdminSearch } from "@/features/admin/hooks/use-admin-search";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/use-projects";
import { Project } from "@/types";
import { Plus, Pencil, Trash2, ExternalLink, Github, Loader2, Upload, X, Briefcase, Search, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useImageUpload } from "@/features/admin/hooks/use-image-upload";

export default function ProjectsManagement() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const imageUpload   = useImageUpload();
  const { toast }     = useToast();

  const [isDialogOpen, setIsDialogOpen]   = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Project>>({
    title: "", description: "", longDescription: "", category: "",
    imageUrl: "", projectUrl: "", githubUrl: "", technologies: [], featured: false,
  });

  const { search, setSearch, filtered } = useAdminSearch(
    projects,
    (p, q) =>
      !!p.title?.toLowerCase().includes(q) ||
      !!p.category?.toLowerCase().includes(q) ||
      !!p.technologies?.some(t => t.toLowerCase().includes(q))
  );

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        technologies: formData.technologies || [],
        featured: !!formData.featured,
        completedDate: formData.completedDate || new Date().toISOString().split("T")[0],
      };
      if (editingProject) {
        await updateProject.mutateAsync({ id: editingProject.id, ...dataToSubmit });
        toast({ title: "Project updated successfully" });
      } else {
        await createProject.mutateAsync(dataToSubmit as Omit<Project, "id">);
        toast({ title: "Project created successfully" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: "Operation failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({ title: "", description: "", longDescription: "", category: "", imageUrl: "", projectUrl: "", githubUrl: "", technologies: [], featured: false });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject.mutateAsync(id);
      toast({ title: "Project deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const featuredCount = projects?.filter(p => p.featured).length ?? 0;

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
        <Skeleton className="h-10 w-72 rounded-xl" />
        <Skeleton className="h-[420px] w-full rounded-2xl" />
      </div>
    );
  }

  const ProjectDialog = (
    <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
      <DialogTrigger asChild>
        <Button className="h-9 rounded-xl shadow-sm" data-testid="button-add-project">
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg">{editingProject ? "Edit Project" : "New Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-sm font-medium">Title <span className="text-red-500">*</span></Label>
              <Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className="rounded-xl h-9" data-testid="input-project-title" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-sm font-medium">Category <span className="text-red-500">*</span></Label>
              <Input id="category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Web App, Mobile" required className="rounded-xl h-9" data-testid="input-project-category" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Short Description <span className="text-red-500">*</span></Label>
            <Input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="One-line summary shown in the portfolio" required className="rounded-xl h-9" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Full Description</Label>
            <Textarea value={formData.longDescription} onChange={e => setFormData({ ...formData, longDescription: e.target.value })} rows={3} placeholder="Detailed description for the project page" className="rounded-xl resize-none" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Technologies <span className="text-xs text-slate-400 font-normal">(comma-separated)</span></Label>
            <Input
              value={formData.technologies?.join(", ")}
              onChange={e => setFormData({ ...formData, technologies: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
              placeholder="React, TypeScript, Tailwind CSS"
              className="rounded-xl h-9"
            />
          </div>

          {/* Image */}
          <div className="space-y-3 border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Project Image</Label>
              {formData.imageUrl && (
                <Button type="button" variant="ghost" size="sm" onClick={removeImage} className="text-red-500 h-7 px-2 text-xs rounded-lg hover:bg-red-50">
                  <X className="h-3 w-3 mr-1" /> Remove
                </Button>
              )}
            </div>
            {formData.imageUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-white group">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button type="button" variant="secondary" size="sm" className="rounded-xl" onClick={() => fileInputRef.current?.click()}>
                    Change Image
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                  {imageUpload.isPending ? <Loader2 className="h-5 w-5 animate-spin text-slate-400" /> : <Upload className="h-5 w-5 text-slate-400" />}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700">Click to upload</p>
                  <p className="text-xs text-slate-400">PNG, JPG or WEBP (max 5MB)</p>
                </div>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={e => imageUpload.handleFileChange(e, url => setFormData(prev => ({ ...prev, imageUrl: url })))} className="hidden" accept="image/*" />
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">Or paste an image URL</Label>
              <Input value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" className="h-8 text-xs rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Live URL</Label>
              <Input value={formData.projectUrl} onChange={e => setFormData({ ...formData, projectUrl: e.target.value })} placeholder="https://myproject.com" className="rounded-xl h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">GitHub URL</Label>
              <Input value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} placeholder="https://github.com/..." className="rounded-xl h-9" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-amber-100 bg-amber-50/60">
            <div>
              <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-amber-500" /> Featured Project
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Highlighted on the public portfolio page</p>
            </div>
            <Switch checked={!!formData.featured} onCheckedChange={checked => setFormData({ ...formData, featured: checked })} data-testid="switch-featured" />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancel</Button>
            <Button type="submit" className="rounded-xl" disabled={createProject.isPending || updateProject.isPending || imageUpload.isPending} data-testid="button-submit-project">
              {(createProject.isPending || updateProject.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingProject ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Portfolio</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage your portfolio projects and case studies.</p>
        </div>
        <div className="flex items-center gap-2">
          {featuredCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200">
              <Star className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-amber-700">{featuredCount} featured</span>
            </div>
          )}
          {ProjectDialog}
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <Input
          placeholder="Search title, category, tech…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 h-9 rounded-xl bg-white border-slate-200"
          data-testid="input-project-search"
        />
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_auto_auto] gap-4 px-6 py-3.5 border-b border-slate-100 bg-slate-50/70">
          {["Project", "Category", "Technologies", "Status", ""].map((h, i) => (
            <span key={i} className={`text-[11px] font-semibold text-slate-400 uppercase tracking-widest ${i === 4 ? "text-right" : ""} ${i === 2 ? "hidden lg:block" : ""}`}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-600">
              {search ? "No projects match your search." : "No projects yet."}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {search ? "Try adjusting your search." : "Add your first portfolio project to get started."}
            </p>
            {search ? (
              <Button variant="outline" size="sm" className="mt-4 h-8 text-xs rounded-xl" onClick={() => setSearch("")}>Clear search</Button>
            ) : (
              <Button size="sm" variant="outline" className="mt-4 h-8 text-xs rounded-xl" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-3 w-3 mr-1" /> Add first project
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((project: Project) => (
              <div key={project.id} className="grid grid-cols-[2fr_1fr_1fr_auto_auto] gap-4 px-6 py-4 items-center hover:bg-slate-50/60 transition-colors group">
                {/* Project */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex-shrink-0 overflow-hidden">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate flex items-center gap-1.5">
                      {project.title}
                      {project.featured && <Star className="h-3 w-3 text-amber-400 flex-shrink-0" />}
                    </p>
                    <p className="text-xs text-slate-400 truncate max-w-[180px]">{project.description}</p>
                  </div>
                </div>

                {/* Category */}
                <Badge variant="secondary" className="font-normal text-xs w-fit rounded-lg bg-slate-100 text-slate-600 border-0">{project.category}</Badge>

                {/* Technologies */}
                <div className="hidden lg:flex flex-wrap gap-1">
                  {project.technologies?.slice(0, 3).map(tech => (
                    <Badge key={tech} variant="outline" className="text-[10px] px-1.5 py-0 font-normal rounded-md border-slate-200 text-slate-500">{tech}</Badge>
                  ))}
                  {(project.technologies?.length || 0) > 3 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal text-slate-400 rounded-md border-slate-200">
                      +{(project.technologies?.length || 0) - 3}
                    </Badge>
                  )}
                </div>

                {/* Status + Links */}
                <div className="flex items-center gap-2">
                  {project.completedDate ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[11px] text-emerald-600 font-semibold">Done</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[11px] text-blue-600 font-semibold">Active</span>
                    </div>
                  )}
                  {project.projectUrl && (
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-slate-600 transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-slate-600 transition-colors">
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    onClick={() => handleEdit(project)} data-testid={`button-edit-project-${project.id}`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                        data-testid={`button-delete-project-${project.id}`}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete <strong>{project.title}</strong>? This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(project.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-400">
              Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of <span className="font-semibold text-slate-600">{projects?.length || 0}</span> projects
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
