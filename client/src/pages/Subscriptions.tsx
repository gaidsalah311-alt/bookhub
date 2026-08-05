import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { useState } from "react";

export default function Subscriptions() {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Fetch subscription plans
  const { data: plans } = trpc.subscriptions.plans.useQuery();

  // Fetch user subscription
  const { data: userSubscription } = trpc.subscriptions.getUserSubscription.useQuery(
    undefined,
    { enabled: !!user }
  );

  // Fetch subscription plan details
  const getPlanName = (planId: number) => {
    const planMap: Record<number, string> = {
      1: "أساسي",
      2: "احترافي",
      3: "مؤسسي",
    };
    return planMap[planId] || "غير معروف";
  };

  const subscriptionPlans = [
    {
      id: "basic",
      name: "أساسي",
      price: "99",
      currency: "ريال",
      duration: "شهر واحد",
      features: [
        { name: "نشر الكتب", included: true },
        { name: "إحصائيات أساسية", included: true },
        { name: "دعم البريد الإلكتروني", included: true },
        { name: "إعلانات مميزة", included: false },
        { name: "تحليلات متقدمة", included: false },
        { name: "دعم الأولوية", included: false },
      ],
    },
    {
      id: "pro",
      name: "احترافي",
      price: "299",
      currency: "ريال",
      duration: "شهر واحد",
      popular: true,
      features: [
        { name: "نشر الكتب", included: true },
        { name: "إحصائيات أساسية", included: true },
        { name: "دعم البريد الإلكتروني", included: true },
        { name: "إعلانات مميزة", included: true },
        { name: "تحليلات متقدمة", included: true },
        { name: "دعم الأولوية", included: false },
      ],
    },
    {
      id: "enterprise",
      name: "مؤسسي",
      price: "999",
      currency: "ريال",
      duration: "شهر واحد",
      features: [
        { name: "نشر الكتب", included: true },
        { name: "إحصائيات أساسية", included: true },
        { name: "دعم البريد الإلكتروني", included: true },
        { name: "إعلانات مميزة", included: true },
        { name: "تحليلات متقدمة", included: true },
        { name: "دعم الأولوية", included: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pattern-deco">
      {/* Header */}
      <header className="border-b-2 border-primary bg-background shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-6">
          <a href="/" className="text-2xl font-bold text-primary">
            BookHub
          </a>
          <Button variant="outline" className="border-primary text-primary">
            العودة
          </Button>
        </div>
      </header>

      {/* Subscriptions Section */}
      <section className="container mx-auto py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">خطط الاشتراك</h1>
            <p className="text-muted-foreground text-lg">
              اختر الخطة المناسبة لك وابدأ النمو اليوم
            </p>
          </div>

          {/* Current Subscription */}
          {userSubscription && (
            <div className="frame-gold mb-12">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-primary mb-2">اشتراكك الحالي</h2>
                  <p className="text-muted-foreground">
                    أنت مشترك حالياً في خطة {getPlanName(userSubscription.planId)}
                  </p>
                </div>
                <Badge className={`text-white text-lg px-4 py-2 ${
                  userSubscription.status === "active" ? "bg-green-600" : "bg-gray-600"
                }`}>
                  {userSubscription.status === "active" ? "نشط" : "غير نشط"}
                </Badge>
              </div>
              <div className="mt-6 pt-6 border-t-2 border-primary">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">تاريخ البدء</p>
                    <p className="font-semibold">
                      {new Date(userSubscription.startDate).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">تاريخ الانتهاء</p>
                    <p className="font-semibold">
                      {new Date(userSubscription.endDate).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`frame-gold relative transition-all duration-300 ${
                  plan.popular ? "md:scale-105 ring-2 ring-primary" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">الأكثر شهرة</Badge>
                  </div>
                )}

                <h3 className="text-2xl font-bold text-primary mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground"> {plan.currency}</span>
                  <p className="text-sm text-muted-foreground mt-2">{plan.duration}</p>
                </div>

                <Button
                  className={`w-full mb-8 ${
                    selectedPlan === plan.id ? "btn-luxury" : "btn-luxury"
                  }`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  اختر هذه الخطة
                </Button>

                <div className="border-t-2 border-primary pt-6">
                  <p className="font-semibold text-primary mb-4">المميزات المتضمنة:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature.name} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span
                          className={
                            feature.included ? "text-foreground" : "text-muted-foreground"
                          }
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="frame-gold mt-12">
            <h2 className="text-3xl font-bold text-primary mb-8">الأسئلة الشائعة</h2>
            <div className="space-y-6">
              {[
                {
                  q: "هل يمكنني تغيير الخطة في أي وقت؟",
                  a: "نعم، يمكنك تغيير الخطة في أي وقت. سيتم حساب الفرق بناءً على الأيام المتبقية.",
                },
                {
                  q: "هل هناك فترة تجريبية مجانية؟",
                  a: "نعم، نقدم فترة تجريبية مجانية لمدة 7 أيام لجميع الخطط.",
                },
                {
                  q: "هل يمكنني إلغاء الاشتراك؟",
                  a: "نعم، يمكنك إلغاء الاشتراك في أي وقت. لن يتم فرض أي رسوم إضافية.",
                },
                {
                  q: "ماذا يحدث بعد انتهاء الاشتراك؟",
                  a: "سيتم تحويلك إلى خطة مجانية محدودة. يمكنك تجديد الاشتراك في أي وقت.",
                },
              ].map((faq, index) => (
                <div key={index} className="border-b-2 border-primary pb-4 last:border-b-0">
                  <h3 className="font-bold text-primary mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-primary bg-secondary py-12 mt-12">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2026 BookHub. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}
