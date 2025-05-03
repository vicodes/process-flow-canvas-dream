
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ValidatedSelectItem } from "@/components/ui/select-helper";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Download } from "lucide-react";
import { DateRange } from "react-day-picker";

export type ProcessFiltersProps = {
  onFilterChange: (filters: ProcessFilters) => void;
  onExport: () => void;
};

export type ProcessFilters = {
  search: string;
  status: string;
  dateRange: DateRange | undefined;
};

export const ProcessFilters: React.FC<ProcessFiltersProps> = ({
  onFilterChange,
  onExport,
}) => {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
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
              <ValidatedSelectItem value="all">All</ValidatedSelectItem>
              <ValidatedSelectItem value="active">Active</ValidatedSelectItem>
              <ValidatedSelectItem value="completed">Completed</ValidatedSelectItem>
              <ValidatedSelectItem value="suspended">Suspended</ValidatedSelectItem>
              <ValidatedSelectItem value="failed">Failed</ValidatedSelectItem>
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
