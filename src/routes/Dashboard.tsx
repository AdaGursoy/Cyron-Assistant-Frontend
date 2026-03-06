import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface Guild {
  id: string;
  name: string;
  plan?: 'free' | 'pro' | 'business' | string;
  embed_color?: string | null;
}

async function fetchGuilds(): Promise<Guild[]> {
  const res = await api.get<Guild[]>('/guilds');
  return res.data;
}

export const Dashboard = () => {
  const params = useParams<{ guildId?: string }>();
  const { data: guilds, isLoading, isError } = useQuery({
    queryKey: ['guilds'],
    queryFn: fetchGuilds,
  });

  const selectedGuild =
    guilds?.find((g) => String(g.id) === params.guildId) ?? null;

  const showEmptyState = !params.guildId || !selectedGuild;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-4"
    >
      {isLoading && (
        <p className="text-sm text-text-muted">Loading your servers...</p>
      )}

      {isError && !isLoading && (
        <p className="text-sm text-red-500">
          Failed to load servers. Please refresh the page.
        </p>
      )}

      {!isLoading && !isError && showEmptyState && (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary/5 via-white to-purple-50 px-6 py-12 text-center shadow-soft">
          <div className="mb-6 h-20 w-20 rounded-full bg-primary/10">
            <div className="h-full w-full rounded-full bg-[radial-gradient(circle_at_30%_20%,#1ab7ef,transparent_60%),radial-gradient(circle_at_70%_80%,#6366f1,transparent_55%)] opacity-80" />
          </div>
          <h2 className="text-lg font-semibold tracking-tight">
            Select a server to manage
          </h2>
          <p className="mt-2 max-w-md text-sm text-text-muted">
            Choose one of your Discord servers from the left to configure
            knowledge, usage limits, and Cyron Assistant ticket behavior.
          </p>
          <p className="mt-4 text-xs text-text-muted">
            Tip: Make sure the Cyron Assistant bot is invited to the server you
            want to manage.
          </p>
        </div>
      )}

      {!isLoading && !isError && !showEmptyState && selectedGuild && (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                {selectedGuild.name}
              </h2>
              <p className="text-sm text-text-muted">
                High-level overview of usage and limits for this server.
              </p>
            </div>
            {selectedGuild.plan && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                {selectedGuild.plan} plan
              </span>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-white p-4 shadow-soft">
              <p className="text-xs font-medium text-text-muted">Today</p>
              <p className="mt-2 text-2xl font-semibold text-primary">—</p>
              <p className="text-xs text-text-muted">Tickets created</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-soft">
              <p className="text-xs font-medium text-text-muted">This month</p>
              <p className="mt-2 text-2xl font-semibold text-primary">—</p>
              <p className="text-xs text-text-muted">Tokens used</p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-soft">
              <p className="text-xs font-medium text-text-muted">Concurrency</p>
              <p className="mt-2 text-2xl font-semibold text-primary">—</p>
              <p className="text-xs text-text-muted">Active AI sessions</p>
            </div>
          </div>
        </>
      )}
    </motion.section>
  );
};

