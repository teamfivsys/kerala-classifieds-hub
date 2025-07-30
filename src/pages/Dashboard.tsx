import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Eye, Heart, Edit, Trash2, Plus } from 'lucide-react'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'

const Dashboard = () => {
  const [myAds, setMyAds] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    fetchMyAds()
    fetchFavorites()
  }, [user, navigate])

  const fetchMyAds = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('ads')
      .select(`
        *,
        categories(name),
        locations(city, district)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      toast({
        title: "Error fetching ads",
        description: error.message,
        variant: "destructive"
      })
    } else {
      setMyAds(data || [])
    }
    setLoading(false)
  }

  const fetchFavorites = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        ads(
          *,
          categories(name),
          locations(city, district)
        )
      `)
      .eq('user_id', user.id)

    if (error) {
      toast({
        title: "Error fetching favorites",
        description: error.message,
        variant: "destructive"
      })
    } else {
      setFavorites(data || [])
    }
  }

  const deleteAd = async (adId: string) => {
    const { error } = await supabase
      .from('ads')
      .delete()
      .eq('id', adId)

    if (error) {
      toast({
        title: "Error deleting ad",
        description: error.message,
        variant: "destructive"
      })
    } else {
      toast({
        title: "Ad deleted successfully",
      })
      fetchMyAds()
    }
  }

  const removeFavorite = async (favoriteId: string) => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', favoriteId)

    if (error) {
      toast({
        title: "Error removing favorite",
        description: error.message,
        variant: "destructive"
      })
    } else {
      toast({
        title: "Removed from favorites",
      })
      fetchFavorites()
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', variant: 'secondary' as const },
      approved: { label: 'Active', variant: 'default' as const },
      rejected: { label: 'Rejected', variant: 'destructive' as const },
      expired: { label: 'Expired', variant: 'outline' as const },
    }
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <div className="space-x-4">
              <Button onClick={() => navigate('/post-ad')} className="gap-2">
                <Plus className="h-4 w-4" />
                Post New Ad
              </Button>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>

          <Tabs defaultValue="my-ads" className="space-y-6">
            <TabsList>
              <TabsTrigger value="my-ads">My Ads ({myAds.length})</TabsTrigger>
              <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="my-ads">
              {loading ? (
                <div className="text-center py-8">Loading your ads...</div>
              ) : myAds.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">No ads posted yet</h3>
                    <p className="text-muted-foreground mb-4">Start by posting your first ad</p>
                    <Button onClick={() => navigate('/post-ad')}>
                      Post Your First Ad
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {myAds.map((ad) => (
                    <Card key={ad.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {ad.images && ad.images.length > 0 && (
                            <img
                              src={ad.images[0]}
                              alt={ad.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{ad.title}</h3>
                                <p className="text-muted-foreground">
                                  {ad.categories?.name} • {ad.locations?.city}, {ad.locations?.district}
                                </p>
                                <p className="font-bold text-primary mt-1">
                                  {ad.price ? `₹${ad.price.toLocaleString()}` : 'Price on request'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge {...getStatusBadge(ad.status)}>
                                  {getStatusBadge(ad.status).label}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Eye className="h-4 w-4" />
                                  {ad.view_count || 0}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => deleteAd(ad.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites">
              {favorites.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                    <p className="text-muted-foreground">Save ads you're interested in</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {favorites.map((favorite) => (
                    <Card key={favorite.id}>
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          {favorite.ads?.images && favorite.ads.images.length > 0 && (
                            <img
                              src={favorite.ads.images[0]}
                              alt={favorite.ads.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{favorite.ads?.title}</h3>
                                <p className="text-muted-foreground">
                                  {favorite.ads?.categories?.name} • {favorite.ads?.locations?.city}
                                </p>
                                <p className="font-bold text-primary mt-1">
                                  {favorite.ads?.price ? `₹${favorite.ads.price.toLocaleString()}` : 'Price on request'}
                                </p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => removeFavorite(favorite.id)}
                              >
                                <Heart className="h-4 w-4 mr-1 fill-current" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-lg">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Member Since</label>
                    <p className="text-lg">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard