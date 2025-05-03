
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Download } from "lucide-react";

export type ProcessFiltersProps = {
  onFilterChange: (filters: ProcessFilters) => void;
  onExport: () => void;
};

export type ProcessFilters = {
  search: string;
  status: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
};

export const ProcessFilters: React.FC<ProcessFiltersProps> = ({
  onFilterChange,
  onExport,
}) => {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [dateRange, setDateRange] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  // Apply filters when any filter value changes
  React.useEffect(() => {
    onFilterChange({ search, status, dateRange });
  }, [search, status, dateRange, onFilterChange]);

  const exportToCSV = () => {
    onExport();
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="flex-1">
        <Input
          placeholder="Search processes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-full md:w-[180px]">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-auto">
        <DatePickerWithRange
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>
      <Button variant="outline" size="icon" onClick={exportToCSV}>
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ProcessFilters;
