import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DeskFader } from "./DeskFader";

export function DeskChannel({ themeKey, name, blurb, color, value, onChange, onRemove }) {
  return (
    <Card className="w-full rounded-2xl shadow-sm border-neutral-200">
      <CardContent className="pt-2">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <DeskFader
              themeKey={themeKey}
              value={value}
              onChange={onChange}
              color={color}
              label={name}
              blurb={blurb}
            />
          </div>
          {onRemove && (
            <Button variant="ghost" size="icon" onClick={onRemove} aria-label={`Remove ${name}`}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

