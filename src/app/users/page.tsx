"use client";

import { NextPage } from 'next';
import { useUsers, useCreateUser } from '@/hooks/useUsers';
import { useState } from 'react';

const UsersPage: NextPage = () => {
    const { data: users, isLoading, error } = useUsers();
    const createUserM = useCreateUser();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createUserM.mutate({ name, email });
        setName('');
        setEmail('');
    };

    if (isLoading) return <p>로딩 중…</p>;
    if (error) return <p>에러: {error.message}</p>;

    return (
        <div className="max-w-xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">사용자 목록</h1>
            <ul className="space-y-2 mb-6">
                {users?.map(u => (
                    <li key={u.id} className="p-2 bg-black-100 rounded">
                        {u.name} ({u.email})
                    </li>
                ))}
            </ul>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="이름"
                    className="w-full p-2 border rounded"
                    required
                />
                <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="이메일"
                    className="w-full p-2 border rounded"
                    required
                />
                <button
                    type="submit"
                    disabled={createUserM.isPending}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                >
                    추가하기
                </button>
            </form>
        </div>
    );
};

export default UsersPage;
