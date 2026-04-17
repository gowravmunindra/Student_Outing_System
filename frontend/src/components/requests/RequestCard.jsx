import Card from "../ui/Card";
import StatusBadge from "./StatusBadge";

function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return "";
  }
}

export default function RequestCard({ request, rightSlot }) {
  const outTime = request.outTime || request.returnTime || "-";
  const returnDate = request.returnDate ? formatDate(request.returnDate) : request.returnTime || "-";

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-bold tracking-tight text-gray-900 mb-1">
            {request.name} <span className="text-gray-500 font-normal">({request.rollNo})</span>
          </div>
          <div className="text-xs text-gray-600 flex flex-wrap gap-2 items-center">
            <span className="bg-black/5 px-2 py-1 rounded border border-black/5">{request.branch}</span>
            <span>Outing: {formatDate(request.outingDate)}</span>
            <span>Out Time: {outTime}</span>
            <span>Return: {returnDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={request.status} />
          {rightSlot}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-800 leading-relaxed bg-black/5 p-3 rounded-lg border border-black/5">{request.reason}</div>

      {request.status === "rejected" && request.rejectionReason ? (
        <div className="mt-3 rounded-lg border border-gray-300 bg-white/80 p-3 text-sm text-gray-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gray-400"></div>
          <div className="font-bold text-gray-900 mb-1">Rejection reason</div>
          <div className="leading-relaxed">{request.rejectionReason}</div>
        </div>
      ) : null}
    </Card>
  );
}

