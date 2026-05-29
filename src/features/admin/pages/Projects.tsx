import { useState, useRef, useMemo } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
import { useImageUpload } from "@/hooks/use-image-upload";

export default function ProjectsManagement() {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const imageUpload = useImageUpload();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    description: "",
    longDescription: "",
    category: "",
    imageUrl: "",
    projectUrl: "",
    githubUrl: "",
    technologies: [],
    featured: false,
  });

  const filtered = useMemo(() => {
    if (!projects) return [];
    const q = search.trim().toLowerCase();
    if (!q) return projects as Project[];
    return (projects as Project[]).filter(
      p =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.technologies?.some(t => t.toLowerCase().includes(q))
    );
  }, [projects, search]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file type", description: "Please upload an image", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum size is 5MB", variant: "destructive" });
      return;
    }
    try {
      const imageUrl = await imageUpload.mutateAsync(file);
      setFormData(prev => ({ ...prev, imageUrl }));
      toast({ title: "Image uploaded" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    }
  };

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
        toast({ title: "Project updated" });
      } else {
        await createProject.mutateAsync(dataToSubmit as Omit<Project, "id">);
        toast({ title: "Project created" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Operation failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setFormData({
      title: "", description: "", longDescription: "", category: "",
      imageUrl: "", projectUrl: "", githubUrl: "", technologies: [], featured: false,
    });
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

  const featuredCount = (projects as Project[] | undefined)?.filter(p => p.featured).length || 0;

  if (isLoading) {
    return (
      <div className="p-6 space-y-5 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-52" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  const projectDialog = (
    <Dialog open={isDialogOpen} onOpenChange={(open) => {
      setIsDialogOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-project">
          <Plus className="mr-2 h-4 w-4" /> Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{editingProject ? "Edit Project" : "New Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
              <Input id="title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required data-testid="input-project-title" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
              <Input id="category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Web App, Mobile" required data-testid="input-project-category" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Short Description <span className="text-destructive">*</span></Label>
            <Input id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="One-line summary shown in the portfolio" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="longDescription">Full Description</Label>
            <Textarea id="longDescription" value={formData.longDescription} onChange={e => setFormData({ ...formData, longDescription: e.target.value })} rows={3} placeholder="Detailed description for the project page" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="technologies">Technologies <span className="text-xs text-muted-foreground">(comma-separated)</span></Label>
            <Input
              id="technologies"
              value={formData.technologies?.join(", ")}
              onChange={e => setFormData({ ...formData, technologies: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
              placeholder="React, TypeScript, Tailwind CSS"
            />
          </div>

          {/* Image */}
          <div className="space-y-3 border rounded-xl p-4 bg-muted/20">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Project Image</Label>
              {formData.imageUrl && (
                <Button type="button" variant="ghost" size="sm" onClick={removeImage} className="text-destructive h-7 px-2 text-xs">
                  <X className="h-3 w-3 mr-1" /> Remove
                </Button>
              )}
            </div>
            {formData.imageUrl ? (
              <div className="relative aspect-video rounded-lg overflow-hidden border bg-background group">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                    Change Image
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-xl aspect-video flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/20"
              >
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {imageUpload.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Click to upload</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (max 5MB)</p>
                </div>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
            <div className="space-y-1">
              <Label htmlFor="imageUrl" className="text-xs text-muted-foreground">Or paste an image URL</Label>
              <Input id="imageUrl" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" className="h-8 text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="projectUrl">Live URL</Label>
              <Input id="projectUrl" value={formData.projectUrl} onChange={e => setFormData({ ...formData, projectUrl: e.target.value })} placeholder="https://myproject.com" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input id="githubUrl" value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} placeholder="https://github.com/..." />
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border bg-amber-50/50 border-amber-100">
            <div>
              <p className="text-sm font-semibold flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-amber-500" /> Featured Project
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Highlighted on the public portfolio page</p>
            </div>
            <Switch checked={!!formData.featured} onCheckedChange={checked => setFormData({ ...formData, featured: checked })} data-testid="switch-featured" />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProject.isPending || updateProject.isPending || imageUpload.isPending} data-testid="button-submit-project">
              {(createProject.isPending || updateProject.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingProject ? "Save Changes" : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Portfolio</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your portfolio projects and case studies.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {featuredCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
              <Star className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-xs font-semibold text-amber-700">{featuredCount} featured</span>
            </div>
          )}
          {projectDialog}
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search by title, category, tech…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 h-9 bg-white"
          data-testid="input-project-search"
        />
      </div>

      {/* Projects Grid / Table */}
      <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_auto_auto] gap-4 px-5 py-3 border-b border-border/60 bg-muted/20">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Project</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Category</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:block">Technologies</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">Actions</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6 text-muted-foreground/30" />
            </div>
            <p className="text-sm font-semibold text-muted-foreground">
              {search ? "No projects match your search." : "No projects yet."}
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1 max-w-xs">
              {search ? "Try adjusting your search." : "Add your first portfolio project to get started."}
            </p>
            {search ? (
              <Button variant="outline" size="sm" className="mt-4 h-8 text-xs" onClick={() => setSearch("")}>Clear search</Button>
            ) : (
              <Button size="sm" variant="outline" className="mt-4 h-8 text-xs" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-3 w-3 mr-1" /> Add first project
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filtered.map((project: Project) => (
              <div key={project.id} className="grid grid-cols-[2fr_1fr_1fr_auto_auto] gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors group">
                {/* Project */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-muted flex-shrink-0 overflow-hidden border border-border/60">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate flex items-center gap-1.5">
                      {project.title}
                      {project.featured && <Star className="h-3 w-3 text-amber-500 flex-shrink-0" />}
                    </div>
                    <div className="text-xs text-muted-foreground truncate max-w-[180px]">{project.description}</div>
                  </div>
                </div>

                {/* Category */}
                <Badge variant="secondary" className="font-normal text-xs w-fit">{project.category}</Badge>

                {/* Technologies */}
                <div className="hidden lg:flex flex-wrap gap-1">
                  {project.technologies?.slice(0, 3).map(tech => (
                    <Badge key={tech} variant="outline" className="text-[10px] px-1.5 py-0 font-normal">{tech}</Badge>
                  ))}
                  {(project.technologies?.length || 0) > 3 && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal text-muted-foreground">
                      +{(project.technologies?.length || 0) - 3}
                    </Badge>
                  )}
                </div>

                {/* Status + Links */}
                <div className="flex items-center gap-2">
                  {project.completedDate ? (
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-xs text-emerald-600 font-medium">Done</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-xs text-blue-600 font-medium">Active</span>
                    </div>
                  )}
                  {project.projectUrl && (
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                      <Github className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(project)} data-testid={`button-edit-project-${project.id}`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" data-testid={`button-delete-project-${project.id}`}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete <strong>{project.title}</strong>? This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(project.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-border/60 bg-muted/10">
            <p className="text-xs text-muted-foreground">
              Showing <strong>{filtered.length}</strong> of <strong>{projects?.length || 0}</strong> projects
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
