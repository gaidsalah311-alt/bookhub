import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToastNotification } from "@/hooks/useToastNotification";

export default function ReportsManagement() {
  const [notes, setNotes] = useState<Record<number, string>>({});
  const { showSuccess, showError } = useToastNotification();
  const reports = trpc.reports.list.useQuery({ limit: 100, offset: 0 });
  const resolve = trpc.reports.resolve.useMutation({
    onSuccess: () => {
      showSuccess("تم تحديث البلاغ");
      reports.refetch();
    },
    onError: (error) => showError("تعذر تحديث البلاغ", { description: error.message }),
  });

  return (
    <main className="container mx-auto max-w-6xl py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">إدارة البلاغات</h1>
        <p className="text-muted-foreground mt-2">مراجعة بلاغات المستخدمين والإعلانات واتخاذ إجراء إداري.</p>
      </div>

      {reports.isLoading && <p className="text-muted-foreground">جاري تحميل البلاغات...</p>}
      {reports.isError && <p className="text-destructive">تعذر تحميل البلاغات. تأكد من صلاحيات المدير.</p>}

      {!reports.isLoading && !reports.isError && reports.data?.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">لا توجد بلاغات حاليًا.</Card>
      )}

      <div className="space-y-4">
        {reports.data?.map((report: any) => (
          <Card key={report.id} className="p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-semibold">بلاغ #{report.id}</div>
                <div className="text-sm text-muted-foreground">السبب: {report.reason}</div>
              </div>
              <span className="rounded-full border px-3 py-1 text-sm">{report.status}</span>
            </div>
            {report.description && <p className="text-sm whitespace-pre-wrap">{report.description}</p>}
            <div className="text-sm text-muted-foreground space-y-1">
              {report.reportedUserId && <div>المستخدم المبلغ عنه: #{report.reportedUserId}</div>}
              {report.listingId && <div>الإعلان: #{report.listingId}</div>}
            </div>
            <Textarea
              value={notes[report.id] ?? report.adminNotes ?? ""}
              onChange={(event) => setNotes((current) => ({ ...current, [report.id]: event.target.value }))}
              placeholder="ملاحظات المدير"
              maxLength={5000}
            />
            <div className="flex flex-wrap gap-2">
              <Button disabled={resolve.isPending} onClick={() => resolve.mutate({ reportId: report.id, status: "reviewed", adminNotes: notes[report.id] })}>مراجعة</Button>
              <Button disabled={resolve.isPending} onClick={() => resolve.mutate({ reportId: report.id, status: "resolved", adminNotes: notes[report.id] })}>حل البلاغ</Button>
              <Button variant="outline" disabled={resolve.isPending} onClick={() => resolve.mutate({ reportId: report.id, status: "dismissed", adminNotes: notes[report.id] })}>رفض البلاغ</Button>
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
