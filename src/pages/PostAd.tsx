import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Upload, X } from 'lucide-react'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'

const adSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  price: z.string().optional(),
  priceType: z.enum(['fixed', 'negotiable', 'on_request']),
  categoryId: z.string().min(1, 'Please select a category'),
  locationId: z.string().min(1, 'Please select a location'),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
})

const PostAd = () => {
  const [images, setImages] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof adSchema>>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
      priceType: 'fixed',
      categoryId: '',
      locationId: '',
      contactPhone: '',
      contactEmail: '',
    },
  })

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    fetchCategories()
    fetchLocations()
  }, [user, navigate])

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (images.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload maximum 5 images",
        variant: "destructive"
      })
      return
    }
    setImages(prev => [...prev, ...files])
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const uploadImages = async () => {
    const uploadedUrls: string[] = []
    
    for (const image of images) {
      const fileExt = image.name.split('.').pop()
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('ad-images')
        .upload(fileName, image)
      
      if (error) throw error
      
      const { data: { publicUrl } } = supabase.storage
        .from('ad-images')
        .getPublicUrl(fileName)
      
      uploadedUrls.push(publicUrl)
    }
    
    return uploadedUrls
  }

  const onSubmit = async (values: z.infer<typeof adSchema>) => {
    if (!user) return

    try {
      setUploading(true)
      
      // Upload images
      const imageUrls = images.length > 0 ? await uploadImages() : []
      
      // Create ad
      const { error } = await supabase
        .from('ads')
        .insert({
          title: values.title,
          description: values.description,
          price: values.price ? parseFloat(values.price) : null,
          price_type: values.priceType,
          category_id: values.categoryId,
          location_id: values.locationId,
          user_id: user.id,
          images: imageUrls,
          contact_phone: values.contactPhone,
          contact_email: values.contactEmail || user.email,
          status: 'pending',
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        })

      if (error) throw error

      toast({
        title: "Ad posted successfully!",
        description: "Your ad is now pending approval and will be live soon.",
      })

      navigate('/dashboard')
    } catch (error: any) {
      toast({
        title: "Failed to post ad",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Post Your Ad</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Ad Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter a descriptive title for your ad" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="locationId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>
                                  {location.city}, {location.district}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (₹)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Enter price" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fixed">Fixed Price</SelectItem>
                              <SelectItem value="negotiable">Negotiable</SelectItem>
                              <SelectItem value="on_request">On Request</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide detailed description of your item/service"
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <Label>Images (Max 5)</Label>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      
                      {images.length < 5 && (
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                          <Upload className="h-6 w-6 text-gray-400" />
                          <span className="text-sm text-gray-500">Add Image</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter email address" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={uploading}>
                    {uploading ? 'Posting Ad...' : 'Post Ad'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default PostAd