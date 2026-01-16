import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import secretaireService from '../../services/secretaireService';
import appointmentService from '../../services/appointmentService';

export default function SecretaryAppointmentForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    visitorId: '',
    visitorFirstName: '',
    visitorLastName: '',
    visitorEmail: '',
    visitorPhone: '',
    employeeId: '',
    personneARencontrer: '',
    departement: '',
    date: new Date().toISOString().split('T')[0],
    heure: '09:00',
    motif: '',
    type: 'PLANIFIE'
  });

  // Fetch data for dropdowns
  const { data: visitors = [] } = useQuery({
    queryKey: ['secretary', 'visitors'],
    queryFn: secretaireService.getVisitors
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['secretary', 'employees'],
    queryFn: secretaireService.getEmployees
  });

  const handleVisitorChange = (e) => {
    const vid = e.target.value;
    if (vid === 'new') {
      setFormData(prev => ({ ...prev, visitorId: 'new', visitorFirstName: '', visitorLastName: '', visitorEmail: '', visitorPhone: '' }));
      return;
    }
    const visitor = visitors.find(v => v.id.toString() === vid);
    if (visitor) {
      setFormData(prev => ({
        ...prev,
        visitorId: vid,
        visitorFirstName: visitor.firstName || visitor.name.split(' ')[0] || '',
        visitorLastName: visitor.lastName || visitor.name.split(' ').slice(1).join(' ') || '',
        visitorEmail: visitor.email || '',
        visitorPhone: visitor.phoneNumber || ''
      }));
    }
  };

  const handleEmployeeChange = (e) => {
    const eid = e.target.value;
    const emp = employees.find(emp => emp.id.toString() === eid);
    if (emp) {
      setFormData(prev => ({
        ...prev,
        employeeId: eid,
        personneARencontrer: emp.name || `${emp.firstName} ${emp.lastName}`,
        departement: emp.departement || emp.secteur || ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        visitorFirstName: formData.visitorFirstName,
        visitorLastName: formData.visitorLastName,
        visitorEmail: formData.visitorEmail,
        visitorPhone: formData.visitorPhone,
        date: formData.date,
        heure: formData.heure,
        motif: formData.motif,
        personneARencontrer: formData.personneARencontrer,
        departement: formData.departement,
        type: formData.type,
        statut: 'VALIDE'
      };

      await appointmentService.createOnsiteAppointment(payload);
      toast.success('Rendez-vous créé avec succès');
      queryClient.invalidateQueries(['secretary', 'appointments']);
      navigate('/secretary/appointments');
    } catch (error) {
       toast.error(error.response?.data?.error || 'Erreur lors de la création');
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-vp-navy tracking-tight">Nouveau Rendez-vous</h1>
        <p className="text-slate-400 font-bold">Planifiez une rencontre entre un visiteur et un collaborateur.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-10 space-y-10 overflow-hidden relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Section Visiteur */}
          <div className="space-y-6">
            <h2 className="text-sm font-black text-vp-cyan uppercase tracking-widest border-l-4 border-vp-cyan pl-4">Informations Visiteur</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-black text-vp-navy uppercase">Sélectionner un visiteur</label>
              <select 
                value={formData.visitorId}
                onChange={handleVisitorChange}
                className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-none text-sm font-bold text-vp-navy focus:ring-2 focus:ring-vp-cyan transition-all appearance-none"
                required
              >
                <option value="">-- Choisir un visiteur --</option>
                <option value="new">+ Nouveau Visiteur</option>
                {visitors.map(v => (
                  <option key={v.id} value={v.id}>{v.name || `${v.firstName} ${v.lastName}`} ({v.email})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <input 
                  placeholder="Prénom"
                  value={formData.visitorFirstName}
                  onChange={e => setFormData({...formData, visitorFirstName: e.target.value})}
                  className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-none text-sm font-bold text-vp-navy focus:ring-2 focus:ring-vp-cyan transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <input 
                  placeholder="Nom"
                  value={formData.visitorLastName}
                  onChange={e => setFormData({...formData, visitorLastName: e.target.value})}
                  className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-none text-sm font-bold text-vp-navy focus:ring-2 focus:ring-vp-cyan transition-all"
                  required
                />
              </div>
            </div>

            <input 
              placeholder="Email"
              type="email"
              value={formData.visitorEmail}
              onChange={e => setFormData({...formData, visitorEmail: e.target.value})}
              className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-none text-sm font-bold text-vp-navy focus:ring-2 focus:ring-vp-cyan transition-all"
            />
            
            <input 
              placeholder="WhatsApp / Téléphone"
              value={formData.visitorPhone}
              onChange={e => setFormData({...formData, visitorPhone: e.target.value})}
              className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-none text-sm font-bold text-vp-navy focus:ring-2 focus:ring-vp-cyan transition-all"
            />
          </div>

          {/* Section RDV */}
          <div className="space-y-6">
            <h2 className="text-sm font-black text-vp-navy uppercase tracking-widest border-l-4 border-slate-200 pl-4">Détails du Rendez-vous</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-black text-vp-navy uppercase">Collaborateur à rencontrer</label>
              <select 
                value={formData.employeeId}
                onChange={handleEmployeeChange}
                className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-none text-sm font-bold text-vp-navy focus:ring-2 focus:ring-slate-200 transition-all appearance-none"
                required
              >
                <option value="">-- Choisir un employé --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name || `${emp.firstName} ${emp.lastName}`} - {emp.departement || emp.secteur}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Date</label>
                <input 
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-none text-sm font-bold text-vp-navy focus:ring-2 focus:ring-slate-200 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-1">Heure</label>
                <input 
                  type="time"
                  value={formData.heure}
                  onChange={e => setFormData({...formData, heure: e.target.value})}
                  className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-none text-sm font-bold text-vp-navy focus:ring-2 focus:ring-slate-200 transition-all"
                  required
                />
              </div>
            </div>

            <textarea 
              placeholder="Motif de la visite..."
              value={formData.motif}
              onChange={e => setFormData({...formData, motif: e.target.value})}
              className="w-full min-h-[120px] p-5 rounded-2xl bg-slate-50 border-none text-sm font-bold text-vp-navy focus:ring-2 focus:ring-slate-200 transition-all resize-none"
              required
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
          <button 
            type="button" 
            onClick={() => navigate('/secretary/appointments')}
            className="px-8 py-4 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 transition-all"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-12 py-4 rounded-2xl bg-vp-navy text-white font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-vp-navy/20 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? 'Création...' : 'Valider le rendez-vous'}
          </button>
        </div>
      </form>
    </div>
  );
}
