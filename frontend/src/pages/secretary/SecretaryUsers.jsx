import { useQuery } from '@tanstack/react-query';
import secretaireService from '../../services/secretaireService';

export default function SecretaryUsers() {
  const [search, setSearch] = useState('');
  
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ['secretary', 'visitors'],
    queryFn: secretaireService.getVisitors,
    staleTime: 30000,
  });

  const filteredUsers = users.filter(u => 
    (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black text-vp-navy mb-2">Annuaire & contacts</h1>
          <p className="text-slate-500 font-medium tracking-wide italic">Gestion des profils récurrents et visiteurs fréquents.</p>
        </div>
        
        <div className="relative group w-full md:w-96">
           <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-vp-cyan transition-colors">
              🔍
           </div>
           <input
             type="text"
             placeholder="Rechercher un contact..."
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             className="w-full h-14 pl-14 pr-6 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-4 focus:ring-vp-cyan/10 focus:border-vp-cyan transition-all font-bold text-vp-navy outline-none"
           />
        </div>
      </div>

      <div className="card p-0 overflow-hidden border-none shadow-2xl shadow-slate-200/60 bg-white/80 backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Profil / Identité</th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">WhatsApp</th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Statut</th>
                <th className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Dernière Entrée</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {isLoading ? (
                <tr><td colSpan="5" className="py-24 text-center"><div className="animate-spin w-8 h-8 border-3 border-vp-cyan border-t-transparent rounded-full mx-auto"></div></td></tr>
              ) : isError ? (
                <tr><td colSpan="5" className="py-24 text-center text-rose-500 font-bold">Erreur de chargement des visiteurs.</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="5" className="py-24 text-center text-slate-400 italic font-bold">Aucun contact correspondant.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-vp-cyan/[0.02] transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-vp-navy font-black text-sm group-hover:bg-vp-cyan group-hover:text-white transition-all shadow-sm">
                            {(user.name || user.firstName || 'V').charAt(0)}
                         </div>
                         <div>
                            <p className="text-lg font-black text-vp-navy group-hover:text-vp-cyan transition-colors">{user.name || `${user.firstName} ${user.lastName}`}</p>
                            <p className="text-[10px] text-slate-400 font-bold lowercase tracking-tight">{user.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-4 font-bold text-xs text-slate-600">
                       {user.whatsapp || 'Non défini'}
                    </td>
                    <td className="px-8 py-4">
                       <span className={`px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border whitespace-nowrap bg-vp-mint/10 text-vp-mint border-vp-mint/20`}>
                          {user.statutCompte || 'ACTIF'}
                       </span>
                    </td>
                    <td className="px-8 py-4 text-sm text-slate-500 font-bold">
                       {user.lastVisitDate || 'Jamais'}
                    </td>
                    <td className="px-8 py-4 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-vp-navy transition-all shadow-sm">✎</button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-12 p-8 border-2 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center text-center group cursor-pointer hover:border-vp-cyan/30 hover:bg-vp-cyan/5 transition-all">
         <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">➕</div>
         <p className="text-sm font-black text-vp-navy uppercase tracking-widest">Enregistrer un nouveau contact fréquent</p>
         <p className="text-xs text-slate-400 font-medium mt-1 italic">Facilitez les futures prises de rendez-vous en pré-enregistrant les visiteurs.</p>
      </div>
    </div>
  );
}
