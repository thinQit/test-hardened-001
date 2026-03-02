'use client';

import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/providers/ToastProvider';
import { ContactMessage } from '@/types';

interface ContactListResponse {
  items: ContactMessage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminMessagesPage() {
  const { toast } = useToast();
  const [token, setToken] = useState('');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ContactMessage | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('admin_token');
    if (stored) setToken(stored);
  }, []);

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/contact?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal
          }
        );
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Failed to load' }));
          throw new Error(err.error || 'Failed to load');
        }
        const data: ContactListResponse = await res.json();
        setMessages(data?.items ?? []);
        setTotalPages(data?.totalPages ?? 1);
      } catch (e) {
        if (e instanceof Error && e.name !== 'AbortError') {
          setError(e.message);
          toast(e.message, 'error');
        }
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [token, page, limit, search, toast]);

  const saveToken = () => {
    localStorage.setItem('admin_token', token);
    toast('Admin token saved', 'success');
  };

  const openDetail = async (id: string) => {
    setSelectedId(id);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to load details' }));
        throw new Error(err.error || 'Failed to load details');
      }
      const data: ContactMessage = await res.json();
      setDetail(data ?? null);
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Failed to load details', 'error');
    } finally {
      setDetailLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed to delete' }));
        throw new Error(err.error || 'Failed to delete');
      }
      setMessages(prev => prev.filter(m => m.id !== id));
      toast('Message deleted', 'success');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Delete failed', 'error');
    }
  };

  const tableContent = useMemo(() => {
    if (!token) {
      return <div className="px-4 py-6 text-secondary">Enter an admin token to view messages.</div>;
    }
    if (loading) {
      return (
        <div className="flex items-center gap-2 px-4 py-6 text-secondary">
          <Spinner className="h-4 w-4" />
          Loading messages...
        </div>
      );
    }
    if (error) {
      return <div className="px-4 py-6 text-error">{error}</div>;
    }
    if (messages.length === 0) {
      return <div className="px-4 py-6 text-secondary">No messages found.</div>;
    }
    return messages.map(message => (
      <div key={message.id} className="grid grid-cols-12 gap-2 border-t border-border px-4 py-3 text-sm">
        <div className="col-span-3 font-medium">{message.name}</div>
        <div className="col-span-3 text-secondary">{message.email}</div>
        <div className="col-span-3 truncate" title={message.message}>{message.message}</div>
        <div className="col-span-2 text-secondary">
          {message.createdAt ? new Date(message.createdAt).toLocaleDateString() : 'N/A'}
        </div>
        <div className="col-span-1">
          <Badge variant={message.status === 'spam' ? 'error' : 'default'}>{message.status}</Badge>
        </div>
        <div className="col-span-12 mt-2 flex justify-end gap-3 sm:col-span-12 sm:mt-0">
          <button
            className="text-primary hover:underline"
            onClick={() => openDetail(message.id)}
            aria-label={`View details for message from ${message.name}`}
          >
            View
          </button>
          <button
            className="text-error hover:underline"
            onClick={() => deleteMessage(message.id)}
            aria-label={`Delete message from ${message.name}`}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  }, [token, loading, error, messages]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Messages</h1>
        <p className="text-secondary">View and manage contact submissions.</p>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Input
          label="Admin Token"
          value={token}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setToken(e.target.value)}
          placeholder="Paste admin token"
        />
        <Input
          label="Search"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search messages"
        />
        <div className="flex items-end">
          <Button onClick={saveToken} fullWidth>
            Save Token
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <div className="grid grid-cols-12 gap-2 bg-muted px-4 py-3 text-sm font-medium">
          <div className="col-span-3">Name</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-3">Message</div>
          <div className="col-span-2">Received</div>
          <div className="col-span-1">Status</div>
        </div>
        {tableContent}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-secondary">Page {page} of {totalPages}</span>
        <Button
          variant="outline"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>

      <Modal
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
        title="Message details"
      >
        {detailLoading && (
          <div className="flex items-center gap-2 text-secondary">
            <Spinner className="h-4 w-4" />
            Loading details...
          </div>
        )}
        {!detailLoading && detail && (
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold">Name</p>
              <p className="text-secondary">{detail.name}</p>
            </div>
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-secondary">{detail.email}</p>
            </div>
            <div>
              <p className="font-semibold">Message</p>
              <p className="text-secondary whitespace-pre-wrap">{detail.message}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="font-semibold">Received</p>
                <p className="text-secondary">
                  {detail.createdAt ? new Date(detail.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="font-semibold">IP Address</p>
                <p className="text-secondary">{detail.ipAddress ?? 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
        {!detailLoading && !detail && (
          <p className="text-secondary">No details available.</p>
        )}
      </Modal>
    </section>
  );
}
