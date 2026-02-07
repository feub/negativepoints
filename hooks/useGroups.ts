import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Group, CreateGroupInput, VALIDATION } from '../lib/types';

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('groups_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'groups',
      }, () => {
        fetchGroups();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch groups');
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (input: CreateGroupInput): Promise<{ success: boolean; error?: string }> => {
    // Validate input
    if (!input.name || input.name.trim().length < VALIDATION.MIN_NAME_LENGTH) {
      return { success: false, error: 'Group name is required' };
    }

    if (input.name.length > VALIDATION.MAX_NAME_LENGTH) {
      return { success: false, error: `Group name must be ${VALIDATION.MAX_NAME_LENGTH} characters or less` };
    }

    try {
      const { error } = await supabase
        .from('groups')
        .insert([{ name: input.name.trim() }]);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to create group' };
    }
  };

  const deleteGroup = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to delete group' };
    }
  };

  return {
    groups,
    loading,
    error,
    createGroup,
    deleteGroup,
    refresh: fetchGroups,
  };
}
