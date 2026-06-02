'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import AccountsForm from './accounts-form';

interface Account {
  ACC_ID: number;
  ACC_NAME: string;
  ACC_DESC: string;
  ACC_TYPE: string;
  ACC_NUMBER: string;
  ACC_AMOUNT: string;
}

export default function AccountsClient() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  async function fetchAccounts() {
    try {
      const response = await fetch('/api/accounts');
      if (!response.ok) throw new Error('Failed to fetch accounts');
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this account?')) return;

    try {
      const response = await fetch(`/api/accounts?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete account');

      toast.success('Account deleted successfully');
      
      fetchAccounts();
    } catch (error) {
      toast.error((error as Error).message || 'Failed to delete account');
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingAccount(null);
    fetchAccounts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse">Loading accounts...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 border-b border-slate-200 dark:border-slate-700">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Financial Accounts
            </CardTitle>
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-800">
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">ID</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Name</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Type</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Account Number</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Amount</TableHead>
                    <TableHead className="font-semibold text-slate-700 dark:text-slate-300">Description</TableHead>
                    <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account, index) => (
                    <motion.tr
                      key={account.ACC_ID}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-100 dark:border-slate-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-200"
                    >
                      <TableCell className="font-medium text-slate-600 dark:text-slate-400">
                        {account.ACC_ID}
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                        {account.ACC_NAME}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          account.ACC_TYPE === 'Asset Account' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : account.ACC_TYPE === 'Liability Account'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                            : account.ACC_TYPE === 'Receivable Account'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}>
                          {account.ACC_TYPE}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-slate-700 dark:text-slate-300">
                        {account.ACC_NUMBER}
                      </TableCell>
                      <TableCell className="font-semibold text-green-600 dark:text-green-400">
                        ${parseFloat(account.ACC_AMOUNT).toLocaleString()}
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-slate-600 dark:text-slate-400">
                        {account.ACC_DESC}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(account)}
                            className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(account.ACC_ID)}
                            className="h-8 w-8 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AccountsForm
        open={isFormOpen}
        onClose={handleFormClose}
        account={editingAccount}
      />
    </div>
  );
}
