import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save, Download, Users, Settings as SettingsIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
  });
  const [emailNotifications, setEmailNotifications] = useState({
    inquiry_enabled: true,
    quote_enabled: true,
    recipient_email: '',
  });
  const [adminUsers, setAdminUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchSettings();
    fetchAdminUsers();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const [companyRes, emailRes] = await Promise.all([
      supabase.from('site_settings').select('*').eq('key', 'company_info').single(),
      supabase.from('site_settings').select('*').eq('key', 'email_notifications').single(),
    ]);

    if (companyRes.data) {
      setCompanyInfo(companyRes.data.value as any);
    }

    if (emailRes.data) {
      setEmailNotifications(emailRes.data.value as any);
    }

    setLoading(false);
  };

  const fetchAdminUsers = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('id, user_id, role')
      .eq('role', 'admin');

    if (data) {
      setAdminUsers(data);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const [companyRes, emailRes] = await Promise.all([
        supabase
          .from('site_settings')
          .update({ value: companyInfo })
          .eq('key', 'company_info'),
        supabase
          .from('site_settings')
          .update({ value: emailNotifications })
          .eq('key', 'email_notifications'),
      ]);

      if (companyRes.error) throw companyRes.error;
      if (emailRes.error) throw emailRes.error;

      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const exportData = async (dataType: string) => {
    try {
      let data: any[] = [];
      let filename = '';

      switch (dataType) {
        case 'products':
          const productsRes = await supabase.from('products').select('*');
          data = productsRes.data || [];
          filename = 'products-export.json';
          break;
        case 'projects':
          const projectsRes = await supabase.from('project_images').select('*');
          data = projectsRes.data || [];
          filename = 'project-images-export.json';
          break;
        case 'inquiries':
          const inquiriesRes = await supabase.from('inquiries').select('*');
          data = inquiriesRes.data || [];
          filename = 'inquiries-export.json';
          break;
        case 'quotes':
          const quotesRes = await supabase.from('quote_requests').select('*');
          data = quotesRes.data || [];
          filename = 'quotes-export.json';
          break;
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: `${dataType} exported successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading settings...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Settings</h1>
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Company Information
            </CardTitle>
            <CardDescription>Update your company details displayed on the website</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  value={companyInfo.name}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={companyInfo.email}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={companyInfo.phone}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={companyInfo.whatsapp}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, whatsapp: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={companyInfo.address}
                  onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription>Configure email notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient-email">Recipient Email</Label>
              <Input
                id="recipient-email"
                type="email"
                value={emailNotifications.recipient_email}
                onChange={(e) =>
                  setEmailNotifications({ ...emailNotifications, recipient_email: e.target.value })
                }
                placeholder="admin@example.com"
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Inquiry Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email when someone submits a contact inquiry
                </p>
              </div>
              <Switch
                checked={emailNotifications.inquiry_enabled}
                onCheckedChange={(checked) =>
                  setEmailNotifications({ ...emailNotifications, inquiry_enabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Quote Request Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email when someone requests a quote
                </p>
              </div>
              <Switch
                checked={emailNotifications.quote_enabled}
                onCheckedChange={(checked) =>
                  setEmailNotifications({ ...emailNotifications, quote_enabled: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Admin Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Admin Users
            </CardTitle>
            <CardDescription>Manage administrator access</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {adminUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No admin users found</p>
              ) : (
                adminUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">Admin User</p>
                      <p className="text-sm text-muted-foreground">ID: {user.user_id.slice(0, 8)}...</p>
                    </div>
                    <div className="text-sm text-muted-foreground">Role: {user.role}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Backup & Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Backup & Export
            </CardTitle>
            <CardDescription>Download your data as JSON files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" onClick={() => exportData('products')}>
                <Download className="mr-2 h-4 w-4" />
                Export Products
              </Button>
              <Button variant="outline" onClick={() => exportData('projects')}>
                <Download className="mr-2 h-4 w-4" />
                Export Projects
              </Button>
              <Button variant="outline" onClick={() => exportData('inquiries')}>
                <Download className="mr-2 h-4 w-4" />
                Export Inquiries
              </Button>
              <Button variant="outline" onClick={() => exportData('quotes')}>
                <Download className="mr-2 h-4 w-4" />
                Export Quotes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
