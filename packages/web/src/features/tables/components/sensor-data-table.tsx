import type {
  ColumnFiltersState,
  ColumnOrderState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type { SensorData } from "../types";

import { getSensorTableColumns } from "./table-columns";
import { useTableDragHandlers } from "./table-drag-handlers";
import { TableHeaderControls } from "./table-header";
import { TablePagination } from "./table-pagination";
import { useTableSelection } from "./table-selection-context";
import { EmptyTableState, LoadingTableState, NoResultsState } from "./table-states";

type SensorDataTableProps = {
  data: SensorData[] | undefined;
  isLoading: boolean;
  title?: string;
  category?: string;
};

export function SensorDataTable({ data, isLoading, title = "Sensor Data", category }: SensorDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [rowSelection, setRowSelection] = useState({});
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const defaultColumnOrder = ["select", "timestamp", "name", "value", "category", "actions"];
  const tableRef = useRef<any>(null);

  // Generate a unique ID for this table instance
  const tableId = useId();

  // Get the selection context
  const { addSelectedRows, clearSelectedRows, clearAllFlag } = useTableSelection();

  // Set initial column order
  useEffect(() => {
    // Set default column order when columns or the table changes
    if (data && data.length > 0) {
      setColumnOrder(defaultColumnOrder);
    }
  }, [data]);

  // Reset column order function
  const resetColumnOrder = () => {
    setColumnOrder(defaultColumnOrder);
    toast.success("Column order reset to default");
  };

  // Update the context whenever selections change
  useEffect(() => {
    if (!data)
      return;

    const selectedIndices = Object.keys(rowSelection);
    if (selectedIndices.length === 0) {
      clearSelectedRows(tableId);
      return;
    }

    const selectedRows = selectedIndices.map(index => data[Number.parseInt(index)]);
    addSelectedRows(tableId, selectedRows);
  }, [rowSelection, data, addSelectedRows, clearSelectedRows, tableId]);

  // Watch for changes to the clearAllFlag and reset selection when it changes
  useEffect(() => {
    // Skip the initial render
    if (clearAllFlag > 0) {
      setRowSelection({});
    }
  }, [clearAllFlag]);

  // Get column definitions
  const columns = getSensorTableColumns();

  // Create the table instance
  const table = useReactTable({
    data: data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
      globalFilter,
      rowSelection,
    },
    enableRowSelection: true,
    enableColumnResizing: false,
    columnResizeMode: "onChange",
  });

  // Store table reference for export function
  tableRef.current = table;

  // Get drag handlers
  const dragHandlers = useTableDragHandlers(columnOrder, setColumnOrder);

  // Render loading state
  if (isLoading) {
    return <LoadingTableState title={title} category={category} />;
  }

  // Render empty state
  if (!data || data.length === 0) {
    return <EmptyTableState title={title} category={category} />;
  }

  return (
    <Card className="shadow-sm border relative">
      <CardHeader>
        <TableHeaderControls
          table={table}
          title={title}
          category={category}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          resetColumnOrder={resetColumnOrder}
        />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden shadow-sm">
          <div className="relative">
            <Table className="table-fixed w-full">
              <TableHeader className="bg-muted">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent border-b">
                    {headerGroup.headers.map(header => (
                      <TableHead
                        key={header.id}
                        className={`font-medium text-muted-foreground relative group
                          ${header.id !== "select" && header.id !== "actions"
                        ? "hover:bg-muted/50 transition-colors duration-150 border-transparent"
                        : ""}
                          ${header.id === "select" ? "text-center" : ""}`}
                        style={{ width: header.id === "select" ? "40px" : header.id === "actions" ? "80px" : "auto" }}
                        draggable={header.id !== "select" && header.id !== "actions"}
                        onDragStart={e => dragHandlers.handleDragStart(e, header.column.id)}
                        onDragOver={dragHandlers.handleDragOver}
                        onDragLeave={dragHandlers.handleDragLeave}
                        onDragEnd={dragHandlers.handleDragEnd}
                        onDrop={e => dragHandlers.handleDrop(e, header.column.id)}
                      >
                        {header.isPlaceholder
                          ? null
                          : (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className={`flex ${header.id !== "select" && header.id !== "actions" ? "cursor-grab active:cursor-grabbing" : ""} transition-all`}>
                                      {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  {header.id !== "select" && header.id !== "actions" && (
                                    <TooltipContent side="top" align="center" className="text-xs">
                                      Drag to reorder column
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TooltipProvider>
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
            </Table>
            <div className="overflow-hidden">
              <ScrollArea className="h-[410px] overflow-auto">
                <Table className="table-fixed w-full">
                  <TableBody>
                    {table.getRowModel().rows?.length
                      ? (
                          table.getRowModel().rows.map(row => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                              className={
                                row.getIsSelected()
                                  ? "bg-primary/5 hover:bg-primary/10"
                                  : "bg-background"
                              }
                            >
                              {row.getVisibleCells().map(cell => (
                                <TableCell
                                  key={cell.id}
                                  style={{ width: cell.column.id === "select" ? "40px" : cell.column.id === "actions" ? "80px" : "auto" }}
                                  className={cell.column.id === "select" ? "text-center" : ""}
                                >
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        )
                      : (
                          <TableRow>
                            <TableCell
                              colSpan={columns.length}
                              className="h-24 text-center"
                            >
                              <NoResultsState />
                            </TableCell>
                          </TableRow>
                        )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          </div>
        </div>

        <TablePagination table={table} />
      </CardContent>
    </Card>
  );
}
