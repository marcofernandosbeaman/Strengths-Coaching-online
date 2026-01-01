import { Card, CardContent } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="rounded-2xl border-dashed border-2">
      <CardContent className="py-16 text-center">
        <p className="text-lg font-medium">No strengths selected yet</p>
        <p className="text-neutral-600 mt-2">Use the picker to choose up to five. Your choices and levels save automatically.</p>
      </CardContent>
    </Card>
  );
}

