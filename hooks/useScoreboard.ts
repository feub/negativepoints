import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ScoreboardEntry } from '../lib/types';

export function useScoreboard(groupId: string | null) {
  const [scoreboard, setScoreboard] = useState<ScoreboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (groupId) {
      fetchScoreboard();

      // Subscribe to realtime changes on users and point_events
      const subscription = supabase
        .channel('scoreboard_changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'users',
        }, () => {
          fetchScoreboard();
        })
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'point_events',
        }, () => {
          fetchScoreboard();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setScoreboard([]);
      setLoading(false);
    }
  }, [groupId]);

  const fetchScoreboard = useCallback(async () => {
    if (!groupId) {
      setScoreboard([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('id, name, total_points')
        .eq('group_id', groupId)
        .order('total_points', { ascending: true }); // Most negative first

      if (error) throw error;

      // Add rank to entries
      const withRank = (data || []).map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

      setScoreboard(withRank);
      setError(null);
    } catch (err) {
      setError('Failed to fetch scoreboard');
      setScoreboard([]);
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  return {
    scoreboard,
    loading,
    error,
    refresh: fetchScoreboard,
  };
}
