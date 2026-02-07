import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PointEvent, User, VALIDATION, CreatePointEventInput } from '../lib/types';

interface PointEventWithUser extends PointEvent {
  user: Pick<User, 'name'> | null;
}

export function usePointHistory(groupId: string | null) {
  const [history, setHistory] = useState<PointEventWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (groupId) {
      fetchHistory();

      // Subscribe to realtime changes
      const subscription = supabase
        .channel('point_events_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'point_events',
        }, () => {
          fetchHistory();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setHistory([]);
      setLoading(false);
    }
  }, [groupId]);

  const fetchHistory = async () => {
    if (!groupId) {
      setHistory([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('point_events')
        .select(`
          *,
          user:users!inner (name, group_id)
        `)
        .eq('user.group_id', groupId)
        .order('created_at', { ascending: false })
        .limit(100); // Limit to most recent 100 events

      if (error) throw error;
      setHistory(data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch history');
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const createPointEvent = async (input: CreatePointEventInput): Promise<{ success: boolean; error?: string }> => {
    // Validate input
    if (!input.user_id) {
      return { success: false, error: 'User is required' };
    }

    if (!input.reason || input.reason.trim().length < VALIDATION.MIN_REASON_LENGTH) {
      return { success: false, error: 'Reason is required' };
    }

    if (input.reason.length > VALIDATION.MAX_REASON_LENGTH) {
      return { success: false, error: `Reason must be ${VALIDATION.MAX_REASON_LENGTH} characters or less` };
    }

    if (typeof input.points !== 'number') {
      return { success: false, error: 'Points must be a number' };
    }

    if (input.points > 0) {
      return { success: false, error: 'Points must be negative or zero' };
    }

    if (!input.created_by) {
      return { success: false, error: 'Authentication required' };
    }

    try {
      const { error } = await supabase
        .from('point_events')
        .insert([{
          user_id: input.user_id,
          points: input.points,
          reason: input.reason.trim(),
          created_by: input.created_by,
        }]);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to create point event' };
    }
  };

  const deletePointEvent = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('point_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Failed to delete point event' };
    }
  };

  return {
    history,
    loading,
    error,
    createPointEvent,
    deletePointEvent,
    refresh: fetchHistory,
  };
}
