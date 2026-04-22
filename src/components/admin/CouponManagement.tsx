import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Copy, Trash2, Tag, Percent, DollarSign, Calendar, Users, RefreshCw, Pencil } from "lucide-react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CouponFormData {
  code: string;
  description: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses: number | null;
  applicable_plans: string[];
  is_active: boolean;
  starts_at: string;
  expires_at: string;
}

const generateCode = (length = 8): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const defaultForm: CouponFormData = {
  code: "",
  description: "",
  discount_type: "percentage",
  discount_value: 10,
  max_uses: null,
  applicable_plans: ["monthly", "annual"],
  is_active: true,
  starts_at: new Date().toISOString().slice(0, 16),
  expires_at: "",
};

const CouponManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CouponFormData>({ ...defaultForm, code: generateCode() });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: coupons, isLoading } = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: redemptions } = useQuery({
    queryKey: ["admin-coupon-redemptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coupon_redemptions")
        .select("*")
        .order("redeemed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CouponFormData) => {
      const { error } = await supabase.from("coupons").insert({
        code: data.code.toUpperCase().trim(),
        description: data.description || null,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        max_uses: data.max_uses,
        applicable_plans: data.applicable_plans,
        is_active: data.is_active,
        starts_at: data.starts_at || new Date().toISOString(),
        expires_at: data.expires_at || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setIsDialogOpen(false);
      setEditingId(null);
      setForm({ ...defaultForm, code: generateCode() });
      toast({ title: "Coupon created successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Error creating coupon", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CouponFormData }) => {
      const { error } = await supabase.from("coupons").update({
        code: data.code.toUpperCase().trim(),
        description: data.description || null,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        max_uses: data.max_uses,
        applicable_plans: data.applicable_plans,
        is_active: data.is_active,
        starts_at: data.starts_at || new Date().toISOString(),
        expires_at: data.expires_at || null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      setIsDialogOpen(false);
      setEditingId(null);
      setForm({ ...defaultForm, code: generateCode() });
      toast({ title: "Coupon updated successfully" });
    },
    onError: (err: any) => {
      toast({ title: "Error updating coupon", description: err.message, variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("coupons").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("coupons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coupons"] });
      toast({ title: "Coupon deleted" });
    },
  });

  const getRedemptionCount = (couponId: string) =>
    redemptions?.filter((r) => r.coupon_id === couponId).length ?? 0;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Copied to clipboard" });
  };

  const openEdit = (coupon: any) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      description: coupon.description || "",
      discount_type: coupon.discount_type as "percentage" | "fixed",
      discount_value: coupon.discount_value,
      max_uses: coupon.max_uses,
      applicable_plans: coupon.applicable_plans || ["monthly", "annual"],
      is_active: coupon.is_active,
      starts_at: coupon.starts_at ? new Date(coupon.starts_at).toISOString().slice(0, 16) : "",
      expires_at: coupon.expires_at ? new Date(coupon.expires_at).toISOString().slice(0, 16) : "",
    });
    setIsDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingId(null);
      setForm({ ...defaultForm, code: generateCode() });
    }
  };

  const handleSubmit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[15px] text-[#86868b]">
            Create and manage discount coupon codes for membership signups.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl">
              <Plus className="w-4 h-4" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base">{editingId ? "Edit Coupon" : "Create New Coupon"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 pt-1">
              {/* Code + Description */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Coupon Code</Label>
                  <div className="flex gap-1">
                    <Input
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. SAVE20"
                      maxLength={20}
                      className="font-mono uppercase h-8 text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => setForm({ ...form, code: generateCode() })}
                      title="Generate random code"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Internal note"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              {/* Discount type, value, max uses */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Type</Label>
                  <Select
                    value={form.discount_type}
                    onValueChange={(v) => setForm({ ...form, discount_type: v as "percentage" | "fixed" })}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">% Off</SelectItem>
                      <SelectItem value="fixed">$ Off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Value</Label>
                  <Input
                    type="number"
                    min={0}
                    max={form.discount_type === "percentage" ? 100 : 9999}
                    value={form.discount_value}
                    onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Max Uses</Label>
                  <Input
                    type="number"
                    min={1}
                    value={form.max_uses ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, max_uses: e.target.value ? Number(e.target.value) : null })
                    }
                    placeholder="∞"
                    className="h-8 text-sm"
                  />
                </div>
              </div>

              {/* Plans + Dates */}
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs">Plans</Label>
                  <Select
                    value={form.applicable_plans.join(",")}
                    onValueChange={(v) => setForm({ ...form, applicable_plans: v.split(",") })}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly,annual">Both</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Starts</Label>
                  <Input
                    type="datetime-local"
                    value={form.starts_at}
                    onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Expires</Label>
                  <Input
                    type="datetime-local"
                    value={form.expires_at}
                    onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              {/* Active + Submit */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={form.is_active}
                    onCheckedChange={(v) => setForm({ ...form, is_active: v })}
                  />
                  <Label className="text-xs">Active</Label>
                </div>
                <Button
                  className="rounded-xl h-8 px-4 text-sm"
                  onClick={handleSubmit}
                  disabled={!form.code.trim() || form.discount_value <= 0 || isSubmitting}
                >
                  {isSubmitting ? (editingId ? "Saving..." : "Creating...") : (editingId ? "Save Changes" : "Create Coupon")}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#fafafa] rounded-2xl border border-[#f0f0f0] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Tag className="w-4 h-4 text-[#007aff]" />
            </div>
            <span className="text-[13px] text-[#86868b]">Total Coupons</span>
          </div>
          <p className="text-2xl font-semibold text-[#1d1d1f]">{coupons?.length ?? 0}</p>
        </div>
        <div className="bg-[#fafafa] rounded-2xl border border-[#f0f0f0] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Users className="w-4 h-4 text-[#30d158]" />
            </div>
            <span className="text-[13px] text-[#86868b]">Total Redemptions</span>
          </div>
          <p className="text-2xl font-semibold text-[#1d1d1f]">{redemptions?.length ?? 0}</p>
        </div>
        <div className="bg-[#fafafa] rounded-2xl border border-[#f0f0f0] p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center shadow-sm">
              <Percent className="w-4 h-4 text-[#ff9f0a]" />
            </div>
            <span className="text-[13px] text-[#86868b]">Active Coupons</span>
          </div>
          <p className="text-2xl font-semibold text-[#1d1d1f]">
            {coupons?.filter((c) => c.is_active).length ?? 0}
          </p>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-12 text-[#86868b]">Loading coupons...</div>
      ) : !coupons?.length ? (
        <div className="text-center py-16 bg-[#fafafa] rounded-2xl border border-[#f0f0f0]">
          <Tag className="w-8 h-8 text-[#86868b] mx-auto mb-3" />
          <p className="text-[#86868b] text-[15px]">No coupons created yet.</p>
          <p className="text-[#86868b] text-[13px] mt-1">Click "Create Coupon" to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#f0f0f0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#f0f0f0] bg-[#fafafa]">
                  <th className="text-left px-4 py-3 font-medium text-[#86868b] text-[13px]">Code</th>
                  <th className="text-left px-4 py-3 font-medium text-[#86868b] text-[13px]">Discount</th>
                  <th className="text-left px-4 py-3 font-medium text-[#86868b] text-[13px]">Plans</th>
                  <th className="text-left px-4 py-3 font-medium text-[#86868b] text-[13px]">Uses</th>
                  <th className="text-left px-4 py-3 font-medium text-[#86868b] text-[13px]">Expires</th>
                  <th className="text-left px-4 py-3 font-medium text-[#86868b] text-[13px]">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-[#86868b] text-[13px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => {
                  const used = getRedemptionCount(coupon.id);
                  const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
                  const isMaxed = coupon.max_uses !== null && used >= coupon.max_uses;

                  return (
                    <tr key={coupon.id} className="border-b border-[#f5f5f5] last:border-0 hover:bg-[#fafafa]">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-[#1d1d1f]">{coupon.code}</span>
                          <button
                            onClick={() => copyCode(coupon.code)}
                            className="text-[#86868b] hover:text-[#1d1d1f] transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {coupon.description && (
                          <p className="text-[11px] text-[#86868b] mt-0.5">{coupon.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1 font-medium text-[#1d1d1f]">
                          {coupon.discount_type === "percentage" ? (
                            <>
                              {coupon.discount_value}%
                              <Percent className="w-3 h-3 text-[#86868b]" />
                            </>
                          ) : (
                            <>
                              ${coupon.discount_value}
                              <DollarSign className="w-3 h-3 text-[#86868b]" />
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#6e6e73]">
                        {(coupon.applicable_plans as string[])?.join(", ") ?? "All"}
                      </td>
                      <td className="px-4 py-3 text-[#6e6e73]">
                        {used}
                        {coupon.max_uses !== null && ` / ${coupon.max_uses}`}
                      </td>
                      <td className="px-4 py-3 text-[#6e6e73]">
                        {coupon.expires_at ? (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(coupon.expires_at), "MMM d, yyyy")}
                          </span>
                        ) : (
                          "Never"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isExpired ? (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                            Expired
                          </span>
                        ) : isMaxed ? (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#ff9f0a]/10 text-[#ff9f0a]">
                            Maxed
                          </span>
                        ) : (
                          <Switch
                            checked={coupon.is_active}
                            onCheckedChange={(v) =>
                              toggleMutation.mutate({ id: coupon.id, is_active: v })
                            }
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#86868b] hover:text-[#1d1d1f]"
                            onClick={() => openEdit(coupon)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => deleteMutation.mutate(coupon.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
