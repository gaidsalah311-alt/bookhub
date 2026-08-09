import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToastNotification } from "@/hooks/useToastNotification";

export default function Subscriptions() {
  const { user } = useAuth();
  const { showSuccess, showError } = useToastNotification();
  const plans = trpc.subscriptions.plans.useQuery();
  const active = trpc.subscriptions.active.useQuery(undefined, { enabled: !!user });
  const subscribe = trpc.subscriptions.subscribe.useMutation({
    onSuccess: async () => { showSuccess("تم تفعيل الخطة"); await active.refetch(); },
    onError: (e) => showError("تعذر تفعيل الخطة", { description: e.message }),
  });
  const cancel = trpc.subscriptions.cancel.useMutation({
    onSuccess: async () => { showSuccess("تم إلغاء الاشتراك"); await active.refetch(); },
    onError: (e) => showError("تعذر إلغاء الاشتراك", { description: e.message }),
  });

  const currentSubscription = active.data?.subscriptions;
  const currentPlan = active.data?.subscription_plans;

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto max-w-6xl py-12 space-y-8">
        <div className="text-center"><h1 className="text-4xl font-bold text-primary">خطط الاشتراك</h1><p className="text-muted-foreground mt-3">الخطط المعروضة مصدرها قاعدة البيانات الفعلية.</p></div>

        {currentSubscription && <Card className="p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-bold">اشتراكك الحالي</h2><p className="text-muted-foreground mt-1">{currentPlan?.name || `الخطة #${currentSubscription.planId}`} — ينتهي في {new Date(currentSubscription.endDate).toLocaleDateString("ar-DZ")}</p></div><div className="flex items-center gap-3"><Badge>{currentSubscription.status}</Badge><Button variant="outline" disabled={cancel.isPending} onClick={() => cancel.mutate({ subscriptionId: currentSubscription.id })}>إلغاء الاشتراك</Button></div></div></Card>}

        {plans.isLoading && <p>جاري تحميل الخطط...</p>}
        {plans.isError && <p className="text-destructive">تعذر تحميل خطط الاشتراك.</p>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.data?.map((plan) => <Card key={plan.id} className="p-6 flex flex-col"><h2 className="text-2xl font-bold">{plan.name}</h2><div className="text-3xl font-bold text-primary mt-4">{plan.price} {plan.currency}</div><p className="text-muted-foreground mt-2">{plan.duration} يوم</p><p className="text-sm mt-4 flex-1">{plan.description || "خطة اشتراك BookHub"}</p><Button className="mt-6" disabled={!user || subscribe.isPending || Number(plan.price) > 0} onClick={() => subscribe.mutate({ planId: plan.id })}>{Number(plan.price) > 0 ? "بانتظار ربط الدفع" : "تفعيل الخطة المجانية"}</Button></Card>)}
        </div>
      </section>
    </main>
  );
}
