import { Card, CardContent } from "@/components/ui/card";

import { useSelectDiagnostics } from "../hooks/use-select-diagnostics";
import { DiagnosticsError } from "./select/diagnostics-error";
import { DiagnosticsFooter } from "./select/diagnostics-footer";
import { DiagnosticsHeader } from "./select/diagnostics-header";
import { DiagnosticsList } from "./select/diagnostics-list";
import { DiagnosticsSkeleton } from "./select/diagnostics-skeleton";
import { SearchInput } from "./select/search-input";

export function SelectDiagnosticsStep() {
  const {
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedItems,
    filteredDiagnostics,
    diagnosticsByCategory,
    handleSelectAll,
    handleClearAll,
    handleItemToggle,
    isItemSelected,
    handleNext,
  } = useSelectDiagnostics();

  if (isLoading) {
    return <DiagnosticsSkeleton />;
  }

  if (error) {
    return <DiagnosticsError />;
  }

  return (
    <div className="space-y-4 animate-transition">
      <div className="animate-transition">
        <SearchInput value={searchTerm} onChange={setSearchTerm} />

        <div className="animate-transition">
          <Card className="mt-6">
            <DiagnosticsHeader
              selectedCount={selectedItems.length}
              onClearAll={handleClearAll}
              onSelectAll={handleSelectAll}
              isSelectAllDisabled={filteredDiagnostics.length === 0 || selectedItems.length === filteredDiagnostics.length}
              isClearAllDisabled={selectedItems.length === 0}
            />

            <CardContent>
              <DiagnosticsList
                diagnosticsByCategory={diagnosticsByCategory}
                isItemSelected={isItemSelected}
                onItemToggle={handleItemToggle}
              />
            </CardContent>

            <DiagnosticsFooter
              selectedCount={selectedItems.length}
              onNext={handleNext}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
