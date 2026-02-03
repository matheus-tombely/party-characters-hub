import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { 
  useCharactersWithViews, 
  useCreateCharacter, 
  useUpdateCharacter, 
  useDeleteCharacter,
  useCharacterMedia,
  useAddCharacterMedia,
  useDeleteCharacterMedia,
  CharacterWithViews
} from '@/hooks/useCharacters';
import { 
  useTestimonials, 
  useCreateTestimonial, 
  useUpdateTestimonial, 
  useDeleteTestimonial,
  Testimonial
} from '@/hooks/useTestimonials';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  LogOut, 
  Users, 
  MessageSquare, 
  BarChart3,
  Upload,
  Eye,
  Star,
  Sparkles,
  Image as ImageIcon,
  Video,
  X
} from 'lucide-react';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function Admin() {
  const { isAuthenticated, loading, signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState('personagens');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso');
  };

  return (
    <>
      <SEO title="Painel Admin" />
      
      <div className="min-h-screen bg-gradient-soft">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="container py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <div>
                <h1 className="font-serif font-bold text-foreground">Painel Admin</h1>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">Ver Site</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="container py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
              <TabsTrigger value="personagens" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Personagens</span>
              </TabsTrigger>
              <TabsTrigger value="depoimentos" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Depoimentos</span>
              </TabsTrigger>
              <TabsTrigger value="ranking" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Ranking</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personagens">
              <CharactersManager />
            </TabsContent>

            <TabsContent value="depoimentos">
              <TestimonialsManager />
            </TabsContent>

            <TabsContent value="ranking">
              <RankingView />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
}

function CharactersManager() {
  const { data: characters, isLoading } = useCharactersWithViews();
  const createCharacter = useCreateCharacter();
  const updateCharacter = useUpdateCharacter();
  const deleteCharacter = useDeleteCharacter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<CharacterWithViews | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setCoverFile(null);
    setEditingCharacter(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleOpenEdit = (character: CharacterWithViews) => {
    setEditingCharacter(character);
    setFormData({
      name: character.name,
      description: character.description || '',
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    setIsSubmitting(true);

    try {
      let coverUrl = editingCharacter?.cover_image || null;

      // Upload cover if provided
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('characters')
          .upload(`covers/${fileName}`, coverFile);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from('characters')
          .getPublicUrl(`covers/${fileName}`);

        coverUrl = publicUrl.publicUrl;
      }

      const slug = slugify(formData.name);

      if (editingCharacter) {
        await updateCharacter.mutateAsync({
          id: editingCharacter.id,
          name: formData.name,
          slug,
          description: formData.description || null,
          cover_image: coverUrl,
        });
        toast.success('Personagem atualizado!');
      } else {
        await createCharacter.mutateAsync({
          name: formData.name,
          slug,
          description: formData.description || null,
          cover_image: coverUrl,
        });
        toast.success('Personagem criado!');
      }

      setIsOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar personagem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este personagem?')) return;
    
    try {
      await deleteCharacter.mutateAsync(id);
      toast.success('Personagem excluído!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold text-foreground">Personagens</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate} className="bg-gradient-magic shadow-magic">
              <Plus className="h-4 w-4 mr-2" />
              Novo Personagem
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCharacter ? 'Editar Personagem' : 'Novo Personagem'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Elsa"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do personagem..."
                  className="mt-1.5"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="cover">Imagem de Capa</Label>
                <Input
                  id="cover"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  className="mt-1.5"
                />
                {editingCharacter?.cover_image && !coverFile && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Já possui imagem. Envie nova para substituir.
                  </p>
                )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting} className="bg-gradient-magic">
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : characters && characters.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {characters.map((char) => (
            <CharacterAdminCard
              key={char.id}
              character={char}
              onEdit={() => handleOpenEdit(char)}
              onDelete={() => handleDelete(char.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Nenhum personagem cadastrado ainda.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CharacterAdminCard({ 
  character, 
  onEdit, 
  onDelete 
}: { 
  character: CharacterWithViews;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [showMedia, setShowMedia] = useState(false);

  return (
    <>
      <Card className="overflow-hidden">
        <div className="flex">
          {character.cover_image ? (
            <img
              src={character.cover_image}
              alt={character.name}
              className="w-24 h-24 object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-magic flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          )}
          <CardContent className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">{character.name}</h3>
                <p className="text-xs text-muted-foreground">/{character.slug}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  {character.view_count} views
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => setShowMedia(true)}>
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={onEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      <Dialog open={showMedia} onOpenChange={setShowMedia}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mídia de {character.name}</DialogTitle>
          </DialogHeader>
          <CharacterMediaManager characterId={character.id} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function CharacterMediaManager({ characterId }: { characterId: string }) {
  const { data: media, isLoading } = useCharacterMedia(characterId);
  const addMedia = useAddCharacterMedia();
  const deleteMedia = useDeleteCharacterMedia();
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddMedia = async () => {
    setIsUploading(true);
    try {
      let url = mediaUrl;

      if (mediaType === 'image' && file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${characterId}/${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage
          .from('characters')
          .upload(`gallery/${fileName}`, file);

        if (error) throw error;

        const { data: publicUrl } = supabase.storage
          .from('characters')
          .getPublicUrl(`gallery/${fileName}`);

        url = publicUrl.publicUrl;
      }

      if (!url) {
        toast.error('Forneça uma URL ou arquivo');
        return;
      }

      await addMedia.mutateAsync({
        character_id: characterId,
        type: mediaType,
        url,
      });

      toast.success('Mídia adicionada!');
      setMediaUrl('');
      setFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao adicionar mídia');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta mídia?')) return;
    try {
      await deleteMedia.mutateAsync({ id, characterId });
      toast.success('Mídia excluída!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir');
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Media Form */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value as 'image' | 'video')}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="image">Imagem</option>
          <option value="video">Vídeo</option>
        </select>

        {mediaType === 'image' ? (
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="flex-1 min-w-[200px]"
          />
        ) : (
          <Input
            placeholder="URL do vídeo (YouTube ou direto)"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            className="flex-1 min-w-[200px]"
          />
        )}

        <Button onClick={handleAddMedia} disabled={isUploading}>
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Enviando...' : 'Adicionar'}
        </Button>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="grid grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded" />
          ))}
        </div>
      ) : media && media.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {media.map((m) => (
            <div key={m.id} className="relative aspect-square group">
              {m.type === 'image' ? (
                <img src={m.url} alt="" className="w-full h-full object-cover rounded" />
              ) : (
                <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                  <Video className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <button
                onClick={() => handleDelete(m.id)}
                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-8">Nenhuma mídia adicional.</p>
      )}
    </div>
  );
}

function TestimonialsManager() {
  const { data: testimonials, isLoading } = useTestimonials();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    message: '',
    rating: 5,
    photo_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({ client_name: '', message: '', rating: 5, photo_url: '' });
    setEditing(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleOpenEdit = (testimonial: Testimonial) => {
    setEditing(testimonial);
    setFormData({
      client_name: testimonial.client_name,
      message: testimonial.message,
      rating: testimonial.rating,
      photo_url: testimonial.photo_url || '',
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name.trim() || !formData.message.trim()) {
      toast.error('Nome e mensagem são obrigatórios');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editing) {
        await updateTestimonial.mutateAsync({
          id: editing.id,
          client_name: formData.client_name,
          message: formData.message,
          rating: formData.rating,
          photo_url: formData.photo_url || null,
        });
        toast.success('Depoimento atualizado!');
      } else {
        await createTestimonial.mutateAsync({
          client_name: formData.client_name,
          message: formData.message,
          rating: formData.rating,
          photo_url: formData.photo_url || null,
        });
        toast.success('Depoimento criado!');
      }
      setIsOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este depoimento?')) return;
    try {
      await deleteTestimonial.mutateAsync(id);
      toast.success('Depoimento excluído!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao excluir');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl font-bold text-foreground">Depoimentos</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenCreate} className="bg-gradient-magic shadow-magic">
              <Plus className="h-4 w-4 mr-2" />
              Novo Depoimento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editing ? 'Editar Depoimento' : 'Novo Depoimento'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="client_name">Nome do Cliente *</Label>
                <Input
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="Ex: Maria Silva"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="message">Mensagem *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="O que o cliente disse sobre a festa..."
                  className="mt-1.5"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="rating">Avaliação (1-5)</Label>
                <div className="flex gap-2 mt-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: n })}
                      className="p-1"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          n <= formData.rating
                            ? 'text-accent fill-accent'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="photo_url">URL da Foto (opcional)</Label>
                <Input
                  id="photo_url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  placeholder="https://..."
                  className="mt-1.5"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting} className="bg-gradient-magic">
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : testimonials && testimonials.length > 0 ? (
        <div className="space-y-3">
          {testimonials.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{t.client_name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < t.rating ? 'text-accent fill-accent' : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{t.message}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleOpenEdit(t)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(t.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Nenhum depoimento cadastrado ainda.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function RankingView() {
  const { data: characters, isLoading } = useCharactersWithViews();

  const sorted = characters?.sort((a, b) => b.view_count - a.view_count) || [];

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
        Ranking de Visualizações
      </h2>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : sorted.length > 0 ? (
        <div className="space-y-3">
          {sorted.map((char, index) => (
            <Card key={char.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  index === 0 ? 'bg-[#FFD700] text-black' :
                  index === 1 ? 'bg-[#C0C0C0] text-black' :
                  index === 2 ? 'bg-[#CD7F32] text-white' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {index + 1}
                </div>
                {char.cover_image ? (
                  <img src={char.cover_image} alt={char.name} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-magic flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{char.name}</p>
                  <p className="text-xs text-muted-foreground">/{char.slug}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{char.view_count}</p>
                  <p className="text-xs text-muted-foreground">visualizações</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              Nenhum personagem cadastrado ainda.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
