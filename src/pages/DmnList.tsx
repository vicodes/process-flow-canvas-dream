
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";

// Mock DMN data
const mockDmnData = [
  { ID: "dmn-001", DmnName: "Credit Score Decision", Version: "1.0", Status: "Active", StartDate: "2025-04-20", EndDate: "2025-05-01" },
  { ID: "dmn-002", DmnName: "Loan Approval Matrix", Version: "2.1", Status: "Active", StartDate: "2025-04-15", EndDate: "2025-04-30" },
  { ID: "dmn-003", DmnName: "Discount Calculator", Version: "1.2", Status: "Completed", StartDate: "2025-03-10", EndDate: "2025-04-15" },
  { ID: "dmn-004", DmnName: "Risk Assessment", Version: "3.0", Status: "Failed", StartDate: "2025-04-05", EndDate: "2025-04-10" },
  { ID: "dmn-005", DmnName: "Customer Segmentation", Version: "1.5", Status: "Active", StartDate: "2025-04-18", EndDate: "2025-05-18" },
];

const DmnList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dmns, setDmns] = useState(mockDmnData);

  // Filter DMNs based on search term and status
  const filteredDmns = dmns.filter(dmn => {
    const matchesSearch = dmn.DmnName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dmn.ID.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || dmn.Status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>DMN Decisions</CardTitle>
          <CardDescription>View and manage your DMN decision tables and instances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search DMNs..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="default">New DMN</Button>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>DMN Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDmns.length > 0 ? (
                  filteredDmns.map((dmn) => (
                    <TableRow 
                      key={dmn.ID}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => window.location.href = `/dmns/${dmn.ID}`}
                    >
                      <TableCell>{dmn.ID}</TableCell>
                      <TableCell>{dmn.DmnName}</TableCell>
                      <TableCell>{dmn.Version}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          dmn.Status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" :
                          dmn.Status === "Failed" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" :
                          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        }`}>
                          {dmn.Status}
                        </span>
                      </TableCell>
                      <TableCell>{dmn.StartDate}</TableCell>
                      <TableCell>{dmn.EndDate}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      No DMNs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DmnList;
