import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChallengeFiltersProps {
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  entryFilter: string;
  setEntryFilter: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const ChallengeFilters = ({
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  entryFilter,
  setEntryFilter,
  searchQuery,
  setSearchQuery,
}: ChallengeFiltersProps) => {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <div className="flex items-center space-x-2">
        <Label htmlFor="categoryFilter" className="text-sm font-medium text-gray-700">
          Category:
        </Label>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger id="categoryFilter" className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="fitness">Fitness</SelectItem>
            <SelectItem value="food">Food & Eating</SelectItem>
            <SelectItem value="learning">Learning</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
            <SelectItem value="social">Social</SelectItem>
            <SelectItem value="health">Health</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Label htmlFor="statusFilter" className="text-sm font-medium text-gray-700">
          Status:
        </Label>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger id="statusFilter" className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Label htmlFor="entryFilter" className="text-sm font-medium text-gray-700">
          Entry Fee:
        </Label>
        <Select value={entryFilter} onValueChange={setEntryFilter}>
          <SelectTrigger id="entryFilter" className="w-[180px]">
            <SelectValue placeholder="All Amounts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Amounts</SelectItem>
            <SelectItem value="low">0.01 - 0.1</SelectItem>
            <SelectItem value="medium">0.1 - 1.0</SelectItem>
            <SelectItem value="high">1.0+</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2 ml-auto">
        <Input
          type="text"
          placeholder="Search challenges..."
          className="w-48 lg:w-64 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ChallengeFilters;
