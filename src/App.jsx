import { Toaster } from "@/components/ui/toaster"
// @ts-ignore
import { Toaster as SonnerToaster } from "sonner"
// @ts-ignore
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
// @ts-ignore
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';

// @ts-ignore
import AppLayout from '@/components/layout/applayout';
import PinGate from '@/components/PinGate';
import Home from '@/pages/Home';
import Stats from '@/pages/Stats';
import Motivation from '@/pages/Motivation';
import Settings from '@/pages/Settings';

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <PinGate>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/motivation" element={<Motivation />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </PinGate>
      </Router>
      <Toaster />
      <SonnerToaster position="top-center" theme="dark" />
    </QueryClientProvider>
  )
}

export default App
