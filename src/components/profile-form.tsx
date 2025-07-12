"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { UserProfile } from "@/types";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  course: z.enum(["B.Tech", "M.Tech", "MCA", "B.Pharma", "MBA"]),
  branch: z.string().min(2, "Branch is required."),
  year: z.coerce.number().min(2010, "Invalid year").max(new Date().getFullYear() + 5, "Invalid year"),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

type ProfileFormProps = {
  userProfile: UserProfile;
};

export function ProfileForm({ userProfile }: ProfileFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userProfile.name || "",
      course: userProfile.course || undefined,
      branch: userProfile.branch || "",
      year: userProfile.year || undefined,
    },
    mode: "onChange",
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true);
    try {
      const userRef = doc(db, 'users', userProfile.id);
      await updateDoc(userRef, {
        ...data,
        isProfileComplete: true,
      });

      toast({
        title: "Profile updated!",
        description: "Your profile information has been saved.",
      });
      router.refresh();
      // If the user was completing their profile for the first time, redirect to home
      if (!userProfile.isProfileComplete) {
        router.push('/');
      }
    } catch (error) {
       toast({
        title: "Error",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your course" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="B.Tech">B.Tech</SelectItem>
                  <SelectItem value="M.Tech">M.Tech</SelectItem>
                  <SelectItem value="MCA">MCA</SelectItem>
                  <SelectItem value="B.Pharma">B.Pharma</SelectItem>
                  <SelectItem value="MBA">MBA</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="branch"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Branch</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Computer Science & Engineering" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year of Study / Passout</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 2025" {...field} />
              </FormControl>
              <FormDescription>If you are a current student, enter your expected passout year.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
           {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Update profile
        </Button>
      </form>
    </Form>
  )
}
