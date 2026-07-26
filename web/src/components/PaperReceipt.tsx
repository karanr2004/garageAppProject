import type { GarageSetting, InvoiceItem } from '../types';

export interface ReceiptData {
  garage: Pick<GarageSetting, 'garageName' | 'location' | 'phone'>;
  invoiceNumber: string;
  invoiceDate: string;
  vehicleNo: string;
  customerName: string;
  items: InvoiceItem[];
  totalAmount: number;
  paymentMethod: string;
  nextServiceKm?: number;
}

function formatDate(value: string): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return value;
  }
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function formatAmount(amount: number): string {
  return Number(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  });
}

export function PaperReceipt({ data }: { data: ReceiptData }) {
  return (
    <div className="mx-auto w-full max-w-[340px] rounded-sm bg-white px-5 py-6 text-stone-900 shadow-[0_12px_40px_rgba(28,25,23,0.12)] ring-1 ring-stone-200">
      <div className="text-center font-['IBM_Plex_Mono',monospace]">
        <h2 className="text-[15px] font-semibold uppercase tracking-wide">{data.garage.garageName}</h2>
        <p className="mt-1 text-[12px] text-stone-600">{data.garage.location}</p>
        <p className="mt-1 flex items-center justify-center gap-1 text-[12px] text-stone-700">
          <span className="text-pink-500" aria-hidden>
            ☎
          </span>
          <span>{data.garage.phone}</span>
        </p>
      </div>

      <div className="my-4 border-t border-dashed border-stone-400" />

      <div className="space-y-1.5 font-['IBM_Plex_Mono',monospace] text-[12px]">
        <Row label="Bill No" value={data.invoiceNumber} />
        <Row label="Date" value={formatDate(data.invoiceDate)} />
        <Row label="Vehicle" value={data.vehicleNo} />
        <Row label="Customer" value={data.customerName} />
      </div>

      <div className="my-4 border-t border-dashed border-stone-400" />

      <div className="space-y-1.5 font-['IBM_Plex_Mono',monospace] text-[12px]">
        {data.items.map((item, index) => (
          <div key={`${item.description}-${index}`} className="flex justify-between gap-3">
            <span>{item.description}</span>
            <span>{formatAmount(item.amount)}</span>
          </div>
        ))}
      </div>

      <div className="my-4 border-t border-dashed border-stone-400" />

      <div className="font-['IBM_Plex_Mono',monospace]">
        <div className="flex items-end justify-between">
          <span className="text-[12px] font-semibold uppercase">Total</span>
          <span className="text-lg font-bold">₹{formatAmount(data.totalAmount)}</span>
        </div>
        <div className="mt-2 flex justify-between text-[12px]">
          <span>Payment</span>
          <span>{data.paymentMethod}</span>
        </div>
      </div>

      <div className="my-4 border-t border-dashed border-stone-400" />

      <div className="text-center font-['IBM_Plex_Mono',monospace] text-[12px]">
        <p>Thank you! Visit again 🙏</p>
        {data.nextServiceKm != null && (
          <p className="mt-2 text-stone-600">Next service after {data.nextServiceKm} km</p>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-stone-600">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
