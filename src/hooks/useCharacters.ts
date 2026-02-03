import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Character {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  created_at: string;
}

export interface CharacterMedia {
  id: string;
  character_id: string;
  type: 'image' | 'video';
  url: string;
  created_at: string;
}

export interface CharacterWithViews extends Character {
  view_count: number;
}

export function useCharacters() {
  return useQuery({
    queryKey: ['characters'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Character[];
    },
  });
}

export function useCharactersWithViews() {
  return useQuery({
    queryKey: ['characters-with-views'],
    queryFn: async () => {
      const { data: characters, error: charError } = await supabase
        .from('characters')
        .select('*')
        .order('created_at', { ascending: false });

      if (charError) throw charError;

      const { data: views, error: viewError } = await supabase
        .from('character_views')
        .select('character_id');

      if (viewError) throw viewError;

      const viewCounts: Record<string, number> = {};
      views?.forEach((v) => {
        viewCounts[v.character_id] = (viewCounts[v.character_id] || 0) + 1;
      });

      return (characters as Character[]).map((char) => ({
        ...char,
        view_count: viewCounts[char.id] || 0,
      })) as CharacterWithViews[];
    },
  });
}

export function useCharacterBySlug(slug: string) {
  return useQuery({
    queryKey: ['character', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      return data as Character | null;
    },
    enabled: !!slug,
  });
}

export function useCharacterMedia(characterId: string) {
  return useQuery({
    queryKey: ['character-media', characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('character_media')
        .select('*')
        .eq('character_id', characterId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as CharacterMedia[];
    },
    enabled: !!characterId,
  });
}

export function useRecordView() {
  return useMutation({
    mutationFn: async (characterId: string) => {
      const { error } = await supabase
        .from('character_views')
        .insert({ character_id: characterId });

      if (error) throw error;
    },
  });
}

export function useCharacterViewCount(characterId: string) {
  return useQuery({
    queryKey: ['character-views', characterId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('character_views')
        .select('*', { count: 'exact', head: true })
        .eq('character_id', characterId);

      if (error) throw error;
      return count || 0;
    },
    enabled: !!characterId,
  });
}

// Admin mutations
export function useCreateCharacter() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (character: Omit<Character, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('characters')
        .insert(character)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['characters-with-views'] });
    },
  });
}

export function useUpdateCharacter() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Character> & { id: string }) => {
      const { data, error } = await supabase
        .from('characters')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['characters-with-views'] });
    },
  });
}

export function useDeleteCharacter() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['characters-with-views'] });
    },
  });
}

export function useAddCharacterMedia() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (media: Omit<CharacterMedia, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('character_media')
        .insert(media)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['character-media', variables.character_id] });
    },
  });
}

export function useDeleteCharacterMedia() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, characterId }: { id: string; characterId: string }) => {
      const { error } = await supabase
        .from('character_media')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return characterId;
    },
    onSuccess: (characterId) => {
      queryClient.invalidateQueries({ queryKey: ['character-media', characterId] });
    },
  });
}
