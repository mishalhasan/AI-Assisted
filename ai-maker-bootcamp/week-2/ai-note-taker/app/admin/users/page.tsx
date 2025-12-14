import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function UsersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Get unique user IDs from notes and sections
  const [noteUsers, sectionUsers] = await Promise.all([
    prisma.note.findMany({
      select: { userId: true },
      distinct: ['userId'],
    }),
    prisma.section.findMany({
      select: { userId: true },
      distinct: ['userId'],
    }),
  ]);

  // Combine and get unique user IDs
  const allUserIds = new Set([
    ...noteUsers.map((n) => n.userId),
    ...sectionUsers.map((s) => s.userId),
  ]);

  // Get stats for each user
  const userStats = await Promise.all(
    Array.from(allUserIds).map(async (uid) => {
      const [noteCount, sectionCount] = await Promise.all([
        prisma.note.count({ where: { userId: uid } }),
        prisma.section.count({ where: { userId: uid } }),
      ]);

      return {
        userId: uid,
        noteCount,
        sectionCount,
      };
    })
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
            Users in Database
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Users who have created notes or sections
          </p>
        </div>

        {userStats.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <p className="text-zinc-600 dark:text-zinc-400">
              No users found in the database yet.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                      User ID (Clerk)
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                      Notes Created
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                      Sections Created
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900 dark:text-white">
                      Total Activity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {userStats.map((user, index) => (
                    <tr
                      key={user.userId}
                      className={index % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-50 dark:bg-zinc-800/50'}
                    >
                      <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white font-mono">
                        {user.userId}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {user.noteCount}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                        {user.sectionCount}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {user.noteCount + user.sectionCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> These are Clerk user IDs. User details (name, email) are managed by Clerk and not stored in this database.
            To see full user information, check your{' '}
            <a
              href="https://dashboard.clerk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-900 dark:hover:text-blue-100"
            >
              Clerk Dashboard
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

