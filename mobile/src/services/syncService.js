// src/services/syncService.js
import { supabase } from '../config/supabase';
import {
  insertOrUpdateHymn,
  insertOrUpdateCategory,
  getSyncMeta,
  setSyncMeta,
} from '../database/localDb';
import NetInfo from '@react-native-community/netinfo';

export const syncHymns = async () => {
  try {
    // Check network
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      console.log('No network, skipping sync');
      return { synced: false, reason: 'offline' };
    }

    // Get last sync time
    const lastSynced = await getSyncMeta('last_synced_at');
    console.log('Last synced at:', lastSynced);

    // Fetch updated categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .gte('updated_at', lastSynced)
      .order('sort_order', { ascending: true });

    if (catError) throw catError;

    // Save categories locally
    if (categories && categories.length > 0) {
      for (const cat of categories) {
        await insertOrUpdateCategory(cat);
      }
      console.log(`Synced ${categories.length} categories`);
    }

    // Fetch updated hymns
    const { data: hymns, error: hymnError } = await supabase
      .from('hymns')
      .select('*')
      .gte('updated_at', lastSynced)
      .eq('is_published', true)
      .order('hymn_number', { ascending: true });

    if (hymnError) throw hymnError;

    // Save hymns locally
    if (hymns && hymns.length > 0) {
      for (const hymn of hymns) {
        await insertOrUpdateHymn(hymn);
      }
      console.log(`Synced ${hymns.length} hymns`);
    }

    // Update sync timestamp
    await setSyncMeta('last_synced_at', new Date().toISOString());

    return {
      synced: true,
      categoriesCount: categories?.length || 0,
      hymnsCount: hymns?.length || 0,
    };
  } catch (error) {
    console.error('Sync error:', error);
    return { synced: false, reason: error.message };
  }
};

export const forceFullSync = async () => {
  try {
    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      return { synced: false, reason: 'offline' };
    }

    // Reset sync time to get everything
    await setSyncMeta('last_synced_at', '2000-01-01T00:00:00Z');
    return await syncHymns();
  } catch (error) {
    console.error('Force sync error:', error);
    return { synced: false, reason: error.message };
  }
};