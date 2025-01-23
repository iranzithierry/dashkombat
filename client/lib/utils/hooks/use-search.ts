import { debounce } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";

export function useSearch<T>({ queryFn, debounceDelay = 500, enabled = true }: {
    queryFn: (query: string) => Promise<T>;
    debounceDelay?: number;
    enabled?: boolean,
}) {
    const [data, setData] = useState<T>();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    const { isLoading, refetch } = useQuery({
        queryKey: ["search", debouncedSearchQuery],
        queryFn: async () => {
            const res = await queryFn(debouncedSearchQuery)
            setData(res)
            return res || []
        },
        enabled,
    });

    const debouncedSetSearchValue = useMemo(
        () => debounce(setDebouncedSearchQuery, debounceDelay),
        [debounceDelay]
    );

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        debouncedSetSearchValue(value);
    };

    useEffect(() => {
        if (debouncedSearchQuery.length) {
            refetch();
        }
    }, [debouncedSearchQuery, refetch]);

    return {
        searchQuery,
        handleSearchChange,
        data,
        isLoading,
        refetch
    };
}
