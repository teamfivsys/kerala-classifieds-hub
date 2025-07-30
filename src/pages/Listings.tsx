import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Search, Filter, Heart, Phone, MessageCircle, MapPin, Calendar } from 'lucide-react'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'

const Listings = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [ads, setAds] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '')
  const [priceRange, setPriceRange] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
    fetchLocations()
    fetchAds()
  }, [searchQuery, selectedCategory, selectedLocation, sortBy])

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    
    if (data) setCategories(data)
  }

  const fetchLocations = async () => {
    const { data } = await supabase
      .from('locations')
      .select('*')
      .order('district')
    
    if (data) setLocations(data)
  }

  const fetchAds = async () => {
    setLoading(true)
    
    let query = supabase
      .from('ads')
      .select(`
        *,
        categories(name, slug),
        locations(city, district),
        profiles(full_name)
      `)
      .eq('status', 'approved')

    // Apply filters
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
    }
    
    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory)
    }
    
    if (selectedLocation) {
      query = query.eq('location_id', selectedLocation)
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'oldest':
        query = query.order('created_at', { ascending: true })
        break
      case 'price_low':
        query = query.order('price', { ascending: true })
        break
      case 'price_high':
        query = query.order('price', { ascending: false })
        break
    }

    const { data, error } = await query

    if (error) {
      toast({
        title: "Error fetching listings",
        description: error.message,
        variant: "destructive"
      })
    } else {
      setAds(data || [])
    }
    
    setLoading(false)
  }

  const toggleFavorite = async (adId: string) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to save favorites",
        variant: "destructive"
      })
      return
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('ad_id', adId)
      .single()

    if (existing) {
      // Remove from favorites
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', existing.id)

      if (!error) {
        toast({ title: "Removed from favorites" })
      }
    } else {
      // Add to favorites
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, ad_id: adId })

      if (!error) {
        toast({ title: "Added to favorites" })
      }
    }
  }

  const updateSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedLocation) params.set('location', selectedLocation)
    setSearchParams(params)
    fetchAds()
  }

  const formatPrice = (price: number | null, priceType: string) => {
    if (!price) return 'Price on request'
    if (priceType === 'negotiable') return `₹${price.toLocaleString()} (Negotiable)`
    return `₹${price.toLocaleString()}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4">
          {/* Search and Filters */}
          <div className="bg-card p-6 rounded-lg shadow-sm mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search ads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.city}, {location.district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={updateSearch} className="w-full md:w-auto">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Results */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {searchQuery ? `Search results for "${searchQuery}"` : 'All Listings'}
            </h1>
            <span className="text-muted-foreground">
              {ads.length} {ads.length === 1 ? 'result' : 'results'} found
            </span>
          </div>

          {/* Listings Grid */}
          {loading ? (
            <div className="text-center py-12">Loading ads...</div>
          ) : ads.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No ads found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <Card key={ad.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {ad.images && ad.images.length > 0 ? (
                      <img
                        src={ad.images[0]}
                        alt={ad.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => toggleFavorite(ad.id)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    
                    {ad.is_featured && (
                      <Badge className="absolute top-2 left-2 bg-yellow-500">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <Badge variant="secondary" className="text-xs">
                        {ad.categories?.name}
                      </Badge>
                      
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {ad.title}
                      </h3>
                      
                      <p className="font-bold text-primary text-xl">
                        {formatPrice(ad.price, ad.price_type)}
                      </p>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {ad.locations?.city}, {ad.locations?.district}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(ad.created_at)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                      <Button variant="default" size="sm" className="flex-1">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Listings