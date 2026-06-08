import { useState } from "react";
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
import { useServices, useCreateService, useUpdateService, useDeleteService } from "@/hooks/use-services";
import { Service } from "@/types";
import { Plus, Pencil, Trash2, Loader2, X, Layers, Search, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useImageUpload } from "@/features/admin/hooks/use-image-upload";

export default function ServicesManagement() {
  const { data: services, isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const imageUpload   = useImageUpload();
  const { toast }     = useToast();

  const [isDialogOpen, setIsDialogOpen]     = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData]             = useState<Partial<Service>>({
    title: "", description: "", category: "", pricing: "", deliveryTime: "", active: true, features: [], imageUrl: "",
  });
  const [featureInput, setFeatureInput] = useState("");

  const { search, setSearch, filtered } = useAdminSearch(
    services,
    (s, q) =>
      !!s.title?.toLowerCase().includes(q) ||
      !!s.category?.toLowerCase().includes(q) ||
      !!s.description?.toLowerCase().includes(q)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await updateService.mutateAsync({ id: editingService.id, ...formData });
        toast({ title: "Service updated successfully" });
      } else {
        await createService.mutateAsync(formData as Omit<Service, "id">);
        toast({ title: "Service created successfully" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch {
      toast({ title: "Operation failed", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({ title: "", description: "", category: "", pricing: "", deliveryTime: "", active: true, features: [], imageUrl: "" });
    setFeatureInput("");
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData(service);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteService.mutateAsync(id);
      toast({ title: "Service deleted" });
    } catch {
      toast({ title: "Delete failed", variant: "destructive" });
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({ ...formData, features: [...(formData.features || []), featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: (formData.features || []).filter((_, i) => i !== index) });
  };

  const toggleActive = async (service: Service) => {
    try {
      await updateService.mutateAsync({ id: service.id, active: !service.active });
      toast({ title: `Service ${!service.active ? "activated" : "deactivated"}` });
    } catch {
      toast({ title: "Update failed", variant: "destructive" });
    }
  };

  const activeCount   = services?.filter(s => s.active).length ?? 0;
  const inactiveCount = (services?.length || 0) - activeCount;

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

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Services</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage the services displayed on your public site.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700">{activeCount} active</span>
          </div>
          {inactiveCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              <span className="text-xs font-medium text-slate-500">{inactiveCount} inactive</span>
            </div>
          )}

          <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="h-9 rounded-xl shadow-sm" data-testid="button-add-service">
                <Plus className="mr-2 h-4 w-4" /> Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg">{editingService ? "Edit Service" : "New Service"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Title <span className="text-red-500">*</span></Label>
                    <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required className="rounded-xl h-9" data-testid="input-service-title" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Category <span className="text-red-500">*</span></Label>
                    <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Development, Design" required className="rounded-xl h-9" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Description <span className="text-red-500">*</span></Label>
                  <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="What's included in this service" rows={3} required className="rounded-xl resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-slate-400" /> Pricing <span className="text-red-500">*</span>
                    </Label>
                    <Input value={formData.pricing} onChange={e => setFormData({ ...formData, pricing: e.target.value })} placeholder="e.g. $499 or From $999" required className="rounded-xl h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" /> Delivery Time <span className="text-red-500">*</span>
                    </Label>
                    <Input value={formData.deliveryTime} onChange={e => setFormData({ ...formData, deliveryTime: e.target.value })} placeholder="e.g. 5–7 days" required className="rounded-xl h-9" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Features / Deliverables</Label>
                  <div className="flex gap-2">
                    <Input
                      value={featureInput}
                      onChange={e => setFeatureInput(e.target.value)}
                      placeholder="Add a feature…"
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
                      className="rounded-xl h-9"
                    />
                    <Button type="button" variant="outline" onClick={addFeature} className="rounded-xl flex-shrink-0">Add</Button>
                  </div>
                  {(formData.features?.length || 0) > 0 && (
                    <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      {formData.features?.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="flex items-center gap-1 text-xs pr-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          {feature}
                          <button type="button" onClick={() => removeFeature(idx)} className="ml-0.5 hover:text-red-500 transition-colors">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Service Image <span className="text-xs text-slate-400 font-normal">(Optional)</span></Label>
                  <div className="flex items-center gap-4">
                    {formData.imageUrl && (
                      <div className="h-14 w-14 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={formData.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input type="file" onChange={e => imageUpload.handleFileChange(e, url => setFormData(prev => ({ ...prev, imageUrl: url })))} accept="image/*" className="cursor-pointer rounded-xl" />
                      {imageUpload.isPending && (
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" /> Uploading…
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 bg-emerald-50/60">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Active Service</p>
                    <p className="text-xs text-slate-500 mt-0.5">Visible on the public services page</p>
                  </div>
                  <Switch checked={!!formData.active} onCheckedChange={checked => setFormData({ ...formData, active: checked })} data-testid="switch-active" />
                </div>

                <DialogFooter className="pt-2 gap-2">
                  <Button type="button" variant="outline" className="rounded-xl" onClick={() => { setIsDialogOpen(false); resetForm(); }}>Cancel</Button>
                  <Button type="submit" className="rounded-xl" disabled={createService.isPending || updateService.isPending || imageUpload.isPending} data-testid="button-submit-service">
                    {(createService.isPending || updateService.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingService ? "Save Changes" : "Create Service"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <Input
          placeholder="Search services…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 h-9 rounded-xl bg-white border-slate-200"
          data-testid="input-service-search"
        />
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto_auto] gap-4 px-6 py-3.5 border-b border-slate-100 bg-slate-50/70">
          {["Service", "Category", "Price", "Delivery", "Status", ""].map((h, i) => (
            <span key={i} className={`text-[11px] font-semibold text-slate-400 uppercase tracking-widest ${i === 5 ? "text-right" : ""} ${i === 2 ? "hidden sm:block" : ""} ${i === 3 ? "hidden md:block" : ""}`}>{h}</span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
              <Layers className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-600">
              {search ? "No services match your search." : "No services yet."}
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              {search ? "Try adjusting your search." : "Add your first service offering to display it on your site."}
            </p>
            {search ? (
              <Button variant="outline" size="sm" className="mt-4 h-8 text-xs rounded-xl" onClick={() => setSearch("")}>Clear search</Button>
            ) : (
              <Button size="sm" variant="outline" className="mt-4 h-8 text-xs rounded-xl" onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-3 w-3 mr-1" /> Add first service
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filtered.map((service: Service) => (
              <div key={service.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto_auto] gap-4 px-6 py-4 items-center hover:bg-slate-50/60 transition-colors group">
                {/* Service */}
                <div className="flex items-center gap-3 min-w-0">
                  {service.imageUrl ? (
                    <div className="h-10 w-10 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex-shrink-0">
                      <img src={service.imageUrl} alt="" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center flex-shrink-0">
                      <Layers className="h-4 w-4 text-primary/50" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate">{service.title}</p>
                    <p className="text-xs text-slate-400 truncate max-w-[200px]">{service.description}</p>
                  </div>
                </div>

                {/* Category */}
                <Badge variant="outline" className="font-normal text-xs w-fit rounded-lg border-slate-200 text-slate-600">{service.category}</Badge>

                {/* Price */}
                <span className="font-bold text-sm text-slate-800 hidden sm:block">{service.pricing}</span>

                {/* Delivery */}
                <span className="text-xs text-slate-400 flex items-center gap-1 hidden md:flex">
                  <Clock className="h-3 w-3" /> {service.deliveryTime}
                </span>

                {/* Status Toggle */}
                <button
                  onClick={() => toggleActive(service)}
                  data-testid={`toggle-active-${service.id}`}
                  className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
                >
                  <div className={`h-1.5 w-1.5 rounded-full ${service.active ? "bg-emerald-500" : "bg-slate-300"}`} />
                  <span className={`text-xs font-semibold ${service.active ? "text-emerald-600" : "text-slate-400"}`}>
                    {service.active ? "Active" : "Off"}
                  </span>
                </button>

                {/* Actions */}
                <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    onClick={() => handleEdit(service)} data-testid={`button-edit-service-${service.id}`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                        data-testid={`button-delete-service-${service.id}`}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Service</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete <strong>{service.title}</strong>? This will remove it from your public site.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(service.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl">
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
              Showing <span className="font-semibold text-slate-600">{filtered.length}</span> of <span className="font-semibold text-slate-600">{services?.length || 0}</span> services
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
