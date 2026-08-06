import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, CreditCard, Zap } from "lucide-react";

/**
 * صفحة اختبار الدفع باستخدام بطاقات Stripe التجريبية
 */

interface TestCard {
  name: string;
  number: string;
  expiry: string;
  cvc: string;
  status: "success" | "failure";
  description: string;
}

const TEST_CARDS: TestCard[] = [
  {
    name: "Visa (ناجح)",
    number: "4242 4242 4242 4242",
    expiry: "12/25",
    cvc: "123",
    status: "success",
    description: "بطاقة Visa تجريبية - سيتم قبول الدفع",
  },
  {
    name: "Mastercard (ناجح)",
    number: "5555 5555 5555 4444",
    expiry: "12/25",
    cvc: "123",
    status: "success",
    description: "بطاقة Mastercard تجريبية - سيتم قبول الدفع",
  },
  {
    name: "American Express (ناجح)",
    number: "3782 822463 10005",
    expiry: "12/25",
    cvc: "1234",
    status: "success",
    description: "بطاقة Amex تجريبية - سيتم قبول الدفع",
  },
  {
    name: "البطاقة المرفوضة",
    number: "4000 0000 0000 0002",
    expiry: "12/25",
    cvc: "123",
    status: "failure",
    description: "بطاقة تجريبية - سيتم رفض الدفع",
  },
  {
    name: "رصيد غير كافي",
    number: "4000 0000 0000 9995",
    expiry: "12/25",
    cvc: "123",
    status: "failure",
    description: "بطاقة تجريبية - محاكاة رصيد غير كافي",
  },
  {
    name: "البطاقة المنتهية",
    number: "4000 0000 0000 0069",
    expiry: "12/25",
    cvc: "123",
    status: "failure",
    description: "بطاقة تجريبية - محاكاة انتهاء الصلاحية",
  },
];

const SUBSCRIPTION_PLANS = [
  {
    name: "الخطة الأساسية",
    price: 99,
    features: ["الوصول الأساسي", "دعم البريد الإلكتروني"],
  },
  {
    name: "الخطة الاحترافية",
    price: 299,
    features: ["جميع الميزات الأساسية", "دعم الأولوية", "تحليلات متقدمة"],
  },
  {
    name: "الخطة المؤسسية",
    price: 999,
    features: ["جميع الميزات", "دعم مخصص", "API متقدم"],
  },
];

export default function PaymentTest() {
  const [selectedCard, setSelectedCard] = useState<TestCard | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number>(0);
  const [amount, setAmount] = useState<string>("299");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<
    Array<{
      id: string;
      card: string;
      amount: number;
      status: "success" | "failure";
      timestamp: string;
    }>
  >([]);

  const handlePayment = async () => {
    if (!selectedCard) {
      toast.error("يرجى اختيار بطاقة اختبار");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("يرجى إدخال مبلغ صحيح");
      return;
    }

    setLoading(true);

    // محاكاة معالجة الدفع
    setTimeout(() => {
      const isSuccess = selectedCard.status === "success";
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const newTransaction = {
        id: transactionId,
        card: selectedCard.number,
        amount: parseFloat(amount),
        status: isSuccess ? ("success" as const) : ("failure" as const),
        timestamp: new Date().toLocaleString("ar-SA"),
      };

      setTransactions([newTransaction, ...transactions]);

      if (isSuccess) {
        toast.success(
          `✅ تم الدفع بنجاح! المبلغ: ${amount} USD\nمعرف المعاملة: ${transactionId}`
        );
      } else {
        toast.error(
          `❌ تم رفض الدفع\nالسبب: ${selectedCard.description}\nمعرف المعاملة: ${transactionId}`
        );
      }

      setLoading(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("تم النسخ إلى الحافظة");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* العنوان */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold">اختبار نظام الدفع</h1>
          </div>
          <p className="text-slate-400 text-lg">
            اختبر نظام الدفع باستخدام بطاقات Stripe التجريبية الرسمية
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* العمود الأيسر - نموذج الدفع */}
          <div className="lg:col-span-2 space-y-8">
            {/* بطاقات الاختبار */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-orange-500" />
                بطاقات الاختبار
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {TEST_CARDS.map((card, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCard(card)}
                    className={`p-4 rounded-lg border-2 transition-all text-right ${
                      selectedCard?.number === card.number
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-slate-600 bg-slate-700/50 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold">{card.name}</span>
                      {card.status === "success" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-2">
                      {card.description}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      {card.number}
                    </p>
                  </button>
                ))}
              </div>

              {/* تفاصيل البطاقة المختارة */}
              {selectedCard && (
                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                  <h3 className="font-semibold mb-4">تفاصيل البطاقة:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400 mb-1">رقم البطاقة</p>
                      <div className="flex items-center gap-2">
                        <code className="font-mono bg-slate-800 px-3 py-1 rounded">
                          {selectedCard.number}
                        </code>
                        <button
                          onClick={() => copyToClipboard(selectedCard.number)}
                          className="text-orange-500 hover:text-orange-400"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">الصلاحية</p>
                      <code className="font-mono bg-slate-800 px-3 py-1 rounded">
                        {selectedCard.expiry}
                      </code>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">CVC</p>
                      <code className="font-mono bg-slate-800 px-3 py-1 rounded">
                        {selectedCard.cvc}
                      </code>
                    </div>
                    <div>
                      <p className="text-slate-400 mb-1">الحالة</p>
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          selectedCard.status === "success"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {selectedCard.status === "success"
                          ? "✅ ناجح"
                          : "❌ فاشل"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* خطط الاشتراك */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h2 className="text-2xl font-bold mb-6">خطط الاشتراك</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {SUBSCRIPTION_PLANS.map((plan, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedPlan(idx);
                      setAmount(plan.price.toString());
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-right ${
                      selectedPlan === idx
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-slate-600 bg-slate-700/50 hover:border-slate-500"
                    }`}
                  >
                    <h3 className="font-semibold mb-2">{plan.name}</h3>
                    <p className="text-2xl font-bold text-orange-500 mb-3">
                      ${plan.price}
                    </p>
                    <ul className="text-xs text-slate-400 space-y-1">
                      {plan.features.map((feature, i) => (
                        <li key={i}>✓ {feature}</li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              {/* إدخال المبلغ المخصص */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  أو أدخل مبلغاً مخصصاً (USD)
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="أدخل المبلغ"
                  className="bg-slate-700 border-slate-600 text-white"
                  min="0"
                  step="0.01"
                />
              </div>

              {/* زر الدفع */}
              <Button
                onClick={handlePayment}
                disabled={loading || !selectedCard}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-all"
              >
                {loading ? "جاري معالجة الدفع..." : `الدفع الآن - ${amount} USD`}
              </Button>
            </Card>
          </div>

          {/* العمود الأيمن - سجل المعاملات */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6">سجل المعاملات</h2>

              {transactions.length === 0 ? (
                <p className="text-slate-400 text-center py-8">
                  لا توجد معاملات حتى الآن
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className={`p-3 rounded-lg border ${
                        tx.status === "success"
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-red-500/10 border-red-500/30"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-mono text-slate-400">
                          {tx.id.slice(0, 12)}...
                        </span>
                        {tx.status === "success" ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm font-semibold mb-1">
                        ${tx.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-400 mb-1">
                        {tx.card.slice(-4)}
                      </p>
                      <p className="text-xs text-slate-500">{tx.timestamp}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* إحصائيات */}
              {transactions.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-700 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">إجمالي المعاملات:</span>
                    <span className="font-semibold">{transactions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">الناجحة:</span>
                    <span className="text-green-400 font-semibold">
                      {transactions.filter((t) => t.status === "success").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">الفاشلة:</span>
                    <span className="text-red-400 font-semibold">
                      {transactions.filter((t) => t.status === "failure").length}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-700">
                    <span className="text-slate-400">إجمالي الإيرادات:</span>
                    <span className="text-orange-400 font-bold">
                      $
                      {transactions
                        .filter((t) => t.status === "success")
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* معلومات مهمة */}
        <Card className="bg-blue-500/10 border-blue-500/30 p-6 mt-8">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-400" />
            معلومات مهمة
          </h3>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>
              • هذه بطاقات اختبار رسمية من Stripe - لن يتم خصم أي أموال حقيقية
            </li>
            <li>• استخدم أي تاريخ انتهاء صلاحية مستقبلي (مثل 12/25)</li>
            <li>• استخدم أي 3 أرقام للـ CVC (أو 4 أرقام لـ Amex)</li>
            <li>
              • هذه الصفحة للاختبار فقط - في الإنتاج ستحتاج لمفاتيح Stripe الحقيقية
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
