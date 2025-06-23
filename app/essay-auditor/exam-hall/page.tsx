"use client";

import React, { useState, useMemo } from "react";
import TopicCard from "@/components/TopicCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, LayoutGrid, List } from "lucide-react";
import {
  mockTopics,
  examTypes,
  difficulties,
  categories,
} from "@/data/mock-topics";

interface FilterState {
  searchQuery: string;
  selectedExamTypes: string[];
  selectedDifficulty: string[];
  selectedCategories: string[];
}

export default function ExamHall() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    selectedExamTypes: [],
    selectedDifficulty: [],
    selectedCategories: [],
  });

  // Filter logic
  const filteredTopics = useMemo(() => {
    return mockTopics.filter((topic) => {
      const searchLower = filters.searchQuery.toLowerCase();
      const matchesSearch =
        topic.title.toLowerCase().includes(searchLower) ||
        topic.description.toLowerCase().includes(searchLower) ||
        topic.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      const matchesExamType =
        filters.selectedExamTypes.length === 0 ||
        filters.selectedExamTypes.some((type) => topic.examType.includes(type));

      const matchesDifficulty =
        filters.selectedDifficulty.length === 0 ||
        filters.selectedDifficulty.includes(topic.difficulty);

      const matchesCategory =
        filters.selectedCategories.length === 0 ||
        filters.selectedCategories.some((category) =>
          topic.category.includes(category)
        );

      return (
        matchesSearch && matchesExamType && matchesDifficulty && matchesCategory
      );
    });
  }, [filters]);

  const clearAllFilters = () => {
    setFilters({
      searchQuery: "",
      selectedExamTypes: [],
      selectedDifficulty: [],
      selectedCategories: [],
    });
  };

  const removeFilter = (type: string, value: string) => {
    setFilters((prev) => {
      if (type === "selectedExamTypes") {
        return {
          ...prev,
          selectedExamTypes: prev.selectedExamTypes.filter(
            (item) => item !== value
          ),
        };
      } else if (type === "selectedDifficulty") {
        return {
          ...prev,
          selectedDifficulty: prev.selectedDifficulty.filter(
            (item) => item !== value
          ),
        };
      } else if (type === "selectedCategories") {
        return {
          ...prev,
          selectedCategories: prev.selectedCategories.filter(
            (item) => item !== value
          ),
        };
      }
      return prev;
    });
  };

  const toggleFilter = (type: keyof FilterState, value: string) => {
    if (type === "searchQuery") return;

    setFilters((prev) => {
      const currentValues = prev[type] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [type]: newValues,
      };
    });
  };

  const activeFiltersCount =
    filters.selectedExamTypes.length +
    filters.selectedDifficulty.length +
    filters.selectedCategories.length;

  return (
    <div className="h-full bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Essay Topics</h1>
          <p className="text-muted-foreground mb-6">
            Choose from our collection of practice essay topics for TOEFL,
            IELTS, and other standardized tests.
          </p>

          {/* Search and Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search topics, keywords, or exam types..."
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    searchQuery: e.target.value,
                  }))
                }
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              <div className="flex border border-border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-sm font-medium">Active filters:</span>
              {filters.selectedExamTypes.map((type) => (
                <Badge key={type} variant="secondary" className="gap-1">
                  {type}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter("selectedExamTypes", type)}
                  />
                </Badge>
              ))}
              {filters.selectedDifficulty.map((difficulty) => (
                <Badge key={difficulty} variant="secondary" className="gap-1">
                  {difficulty}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() =>
                      removeFilter("selectedDifficulty", difficulty)
                    }
                  />
                </Badge>
              ))}
              {filters.selectedCategories.map((category) => (
                <Badge key={category} variant="secondary" className="gap-1">
                  {category}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilter("selectedCategories", category)}
                  />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            </div>
          )}

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Exam Types */}
                <div>
                  <h4 className="font-semibold mb-3">Exam Types</h4>
                  <div className="space-y-2">
                    {examTypes.map((type) => (
                      <label
                        key={type}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.selectedExamTypes.includes(type)}
                          onChange={() =>
                            toggleFilter("selectedExamTypes", type)
                          }
                          className="rounded"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <h4 className="font-semibold mb-3">Difficulty</h4>
                  <div className="space-y-2">
                    {difficulties.map((difficulty) => (
                      <label
                        key={difficulty}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.selectedDifficulty.includes(
                            difficulty
                          )}
                          onChange={() =>
                            toggleFilter("selectedDifficulty", difficulty)
                          }
                          className="rounded"
                        />
                        <span className="text-sm">{difficulty}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="font-semibold mb-3">Categories</h4>
                  <div className="space-y-2">
                    {categories.slice(0, 6).map((category) => (
                      <label
                        key={category}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.selectedCategories.includes(
                            category
                          )}
                          onChange={() =>
                            toggleFilter("selectedCategories", category)
                          }
                          className="rounded"
                        />
                        <span className="text-sm">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredTopics.length} of {mockTopics.length} topics
            </p>
          </div>
        </div>

        {/* Topics Grid/List */}
        {filteredTopics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No topics found matching your criteria.
            </p>
            <Button onClick={clearAllFilters}>Clear all filters</Button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredTopics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
