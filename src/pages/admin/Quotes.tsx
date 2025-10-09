import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    const { data, error } = await supabase
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setQuotes(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('quote_requests')
      .update({ status: status as any })
      .eq('id', id);

    if (!error) {
      fetchQuotes();
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === quotes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(quotes.map(q => q.id));
    }
  };

  const batchUpdateStatus = async (status: string) => {
    if (selectedIds.length === 0) {
      toast.error('Please select quotes first');
      return;
    }

    try {
      const { error } = await supabase
        .from('quote_requests')
        .update({ status: status as any })
        .in('id', selectedIds);

      if (error) throw error;

      toast.success(`${selectedIds.length} quotes updated`);
      setSelectedIds([]);
      fetchQuotes();
    } catch (error: any) {
      toast.error('Failed to update: ' + error.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-blue-500';
      case 'quoted': return 'bg-yellow-500';
      case 'converted': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Quote Requests</h1>
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} selected
              </span>
              <Select onValueChange={batchUpdateStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quoted">Mark as Quoted</SelectItem>
                  <SelectItem value="converted">Mark as Converted</SelectItem>
                  <SelectItem value="closed">Mark as Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : quotes.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            No quote requests yet.
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.length === quotes.length}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(quote.id)}
                          onCheckedChange={() => toggleSelection(quote.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{quote.contact_name}</TableCell>
                      <TableCell>{quote.email}</TableCell>
                      <TableCell>{quote.company || 'N/A'}</TableCell>
                      <TableCell>{quote.product_interest || 'General'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(quote.status)}>
                          {quote.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(quote.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <select
                          value={quote.status}
                          onChange={(e) => updateStatus(quote.id, e.target.value)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="quoted">Quoted</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
