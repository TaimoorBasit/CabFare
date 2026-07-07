import CaroleanCoaches from '../components/CaroleanCoaches';

export default function HomePage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const view = searchParams?.view;
  const initialMode = view === 'customer' ? 'customer' : 'admin';
  return <CaroleanCoaches initialMode={initialMode} />;
}
