import { useState } from "react";
import { Users, Search, Filter, MoreVertical, Mail, Activity, ChevronRight, UserPlus } from "lucide-react";
import { motion } from "motion/react";

export default function CoachClients() {
  const [searchQuery, setSearchQuery] = useState("");

  const clients = [
    { id: 1, name: "Marko P.", goal: "Mišićna masa", status: "Aktivno", lastActive: "Danas", avatar: "M", progress: "Stagnacija" },
    { id: 2, name: "Jelena M.", goal: "Gubitak težine", status: "Aktivno", lastActive: "Juče", avatar: "J", progress: "Odličan" },
    { id: 3, name: "Nikola S.", goal: "Kondicija", status: "Neaktivno", lastActive: "Pre 5 dana", avatar: "N", progress: "Slab" },
    { id: 4, name: "Ana K.", goal: "Snaga", status: "Aktivno", lastActive: "Danas", avatar: "A", progress: "Dobar" },
  ];

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 pb-24 lg:pb-8 transition-colors duration-200">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-colors duration-200">Klijenti</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm sm:text-base transition-colors duration-200">Upravljanje i pregled svih klijenata</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-indigo-500/20 self-start sm:self-auto">
          <UserPlus className="w-4 h-4" />
          Dodaj klijenta
        </button>
      </header>

      <div className="bg-white dark:bg-zinc-900/40 rounded-3xl border border-slate-200 dark:border-zinc-800/50 backdrop-blur-sm shadow-sm dark:shadow-none overflow-hidden transition-colors duration-200">
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-zinc-800/50 flex flex-col sm:flex-row gap-4 justify-between transition-colors duration-200">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-zinc-500" />
            <input 
              type="text" 
              placeholder="Pretraži klijente..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-800/80 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors duration-200"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-zinc-950/50 text-slate-700 dark:text-zinc-300 text-sm font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors border border-slate-200 dark:border-zinc-800/80">
            <Filter className="w-4 h-4" />
            Filteri
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800/50 bg-slate-50/50 dark:bg-zinc-900/20 transition-colors duration-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Klijent</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider hidden sm:table-cell">Cilj</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider hidden md:table-cell">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider hidden lg:table-cell">Napredak</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider text-right">Akcije</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800/50 transition-colors duration-200">
              {filteredClients.map((client) => (
                <motion.tr 
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center text-sm font-bold text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700/50 transition-colors duration-200">
                        {client.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white transition-colors duration-200">{client.name}</p>
                        <p className="text-xs text-slate-500 dark:text-zinc-500 sm:hidden mt-0.5">{client.goal}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span className="text-sm text-slate-600 dark:text-zinc-400 transition-colors duration-200">{client.goal}</span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      client.status === 'Aktivno' 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' 
                        : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700'
                    } transition-colors duration-200`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className={`text-sm ${
                      client.progress === 'Odličan' ? 'text-emerald-600 dark:text-emerald-400' :
                      client.progress === 'Stagnacija' ? 'text-amber-600 dark:text-amber-400' :
                      'text-rose-600 dark:text-rose-400'
                    } transition-colors duration-200`}>
                      {client.progress}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-zinc-500">
                    Nema pronađenih klijenata za pretragu "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
