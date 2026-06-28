import PageTransition from '@/components/shared/PageTransition'

export default function ProtectedTemplate({ children }: { children: React.ReactNode }) {
  // We don't use PageTransition here directly if we want layout persistence, 
  // but the prompt says 'Apply to every protected page'.
  // Using a client component in a server template might cause hydration mismatches,
  // but PageTransition is already a client component wrapping children.
  return <PageTransition>{children}</PageTransition>
}
