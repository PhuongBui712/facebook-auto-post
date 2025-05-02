import StoryForm from "@/components/forms/story-form"

export default function StoryPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">Story Post</h1>
      <StoryForm />
    </div>
  )
}
