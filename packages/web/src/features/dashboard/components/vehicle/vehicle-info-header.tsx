type VehicleInfoHeaderProps = {
  make: string;
  model: string;
  year: number;
  vin: string | null;
};

export function VehicleInfoHeader({ make, model, year, vin }: VehicleInfoHeaderProps) {
  return (
    <div className="relative p-4 rounded-xl bg-gradient-to-br from-slate-50/80 via-slate-50/40 to-background dark:from-slate-900/40 dark:via-slate-900/20 dark:to-background border border-border/60 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">
            {make}
            {" "}
            {model}
          </h3>
          <p className="text-sm text-muted-foreground font-medium">
            {year}
            {" "}
            Model Year
          </p>
        </div>
        {vin && (
          <div className="text-center">
            <div className="text-sm font-mono font-medium text-foreground bg-muted/50 py-1 rounded border">
              {vin}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Vehicle Identification Number
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
