import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, X } from "lucide-react";

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterByStatus: (status: string | null) => void;
  onFilterByAuthor: (author: string) => void;
}

export default function SearchAndFilter({
  onSearch,
  onFilterByStatus,
  onFilterByAuthor,
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const handleStatusChange = (value: string) => {
    if (value === "all") {
      setSelectedStatus(null);
      onFilterByStatus(null);
    } else {
      setSelectedStatus(value);
      onFilterByStatus(value);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setSelectedStatus(null);
    onSearch("");
    onFilterByStatus(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="ابحث عن كتاب أو مؤلف..."
            value={searchQuery}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              حالة القراءة
            </label>
            <Select value={selectedStatus || "all"} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="لم يُقرأ">لم يُقرأ</SelectItem>
                <SelectItem value="قيد القراءة">قيد القراءة</SelectItem>
                <SelectItem value="مقروء">مقروء</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          {(searchQuery || selectedStatus) && (
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleClear}
                className="w-full gap-2"
              >
                <X size={16} />
                مسح الفلاتر
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
