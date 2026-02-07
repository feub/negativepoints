import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, CreateUserInput, VALIDATION } from '../lib/types';

export function useUsers(groupId: string | null) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (groupId) {
      fetchUsers();

      // Subscribe to realtime changes
      const subscription = supabase
        .channel('users_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'users',
        }, () => {
          fetchUsers();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setUsers([]);
      setLoading(false);
    }
  }, [groupId]);

  const fetchUsers = async () => {
    if (!groupId) {
      setUsers([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('group_id', groupId)
        .order('name', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (input: CreateUserInput): Promise<{ success: boolean; error?: string }> => {
    // Validate input
    if (!input.name || input.name.trim().length < VALIDATION.MIN_NAME_LENGTH) {
      return { success: false, error: 'User name is required' };
    }

    if (input.name.length > VALIDATION.MAX_NAME_LENGTH) {
      return { success: false, error: `User name must be ${VALIDATION.MAX_NAME_LENGTH} characters or less` };
    }

    if (!input.group_id) {
      return { success: false, error: 'Group is required' };
    }

    try {
      const { error } = await supabase
        .from('users')
        .insert([{
          name: input.name.trim(),
          group_id: input.group_id,
        }]);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to create user' };
    }
  };

  const updateUser = async (id: string, name: string): Promise<{ success: boolean; error?: string }> => {
    // Validate input
    if (!name || name.trim().length < VALIDATION.MIN_NAME_LENGTH) {
      return { success: false, error: 'User name is required' };
    }

    if (name.length > VALIDATION.MAX_NAME_LENGTH) {
      return { success: false, error: `User name must be ${VALIDATION.MAX_NAME_LENGTH} characters or less` };
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ name: name.trim() })
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to update user' };
    }
  };

  const deleteUser = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to delete user' };
    }
  };

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refresh: fetchUsers,
  };
}
