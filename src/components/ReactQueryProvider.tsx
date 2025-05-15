// src/components/ReactQueryProvider.tsx
"use client";

import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Props = { children: ReactNode };

export default function ReactQueryProvider({ children }: Props) {
    // 클라이언트 렌더링 시 한 번만 생성
    const [client] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    );
}
