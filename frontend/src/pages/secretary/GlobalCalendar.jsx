import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import fr from 'date-fns/locale/fr';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import appointmentService from '../../services/appointmentService';
import PageHeader from '../../components/ui/PageHeader';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'fr': fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function GlobalCalendar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [view, setView] = useState('month');

  // Fetch ALL appointments (using the stubbed/mocked admin endpoint for now)
  const { data: rawAppointments = [], isLoading } = useQuery({
    queryKey: ['admin', 'appointments'],
    queryFn: appointmentService.getAllAppointments,
    staleTime: 5 * 60 * 1000,
  });

  const appointments = Array.isArray(rawAppointments) ? rawAppointments : (rawAppointments?.content || []);

  const events = appointments.map(apt => {
    // Combine date and time to create start date
    // Backend format: date: "YYYY-MM-DD", time: "HH:mm"
    const startDateTime = new Date(`${apt.date}T${apt.time || '09:00'}`);
    const endDateTime = new Date(startDateTime.getTime() + (60 * 60 * 1000)); // Default 1 hour duration

    return {
      id: apt.id,
      title: `${apt.visitorName} (${apt.statut})`,
      start: startDateTime,
      end: endDateTime,
      resource: apt,
      status: apt.statut
    };
  });

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3B82F6'; // Blue default
    if (event.status === 'EN_ATTENTE') backgroundColor = '#EAB308'; // Yellow
    if (event.status === 'APPROUVEE') backgroundColor = '#10B981'; // Green
    if (event.status === 'REFUSEE') backgroundColor = '#EF4444'; // Red

    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const handleSelectEvent = (event) => {
    // Navigate to details if secretary needs to validate, or just show info
    // Assuming /secretary/appointments/:id exists or reusing a detail view
    // For now, simple alert to prove interaction as requested "opens detail"
    // Ideally: navigate(`/secretary/appointments/${event.id}`)
    alert(`Détails du Rendez-vous:\nVisiteur: ${event.resource.visitorName}\nMotif: ${event.resource.motif || 'N/A'}\nStatut: ${event.status}`);
  };

  return (
    <div className="p-6">
      <PageHeader 
        title="Calendrier Global" 
        subtitle="Vue d'ensemble des rendez-vous et de la charge"
      />
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[600px] mt-6">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          culture="fr"
          messages={{
            next: "Suivant",
            previous: "Précédent",
            today: "Aujourd'hui",
            month: "Mois",
            week: "Semaine",
            day: "Jour",
            agenda: "Agenda"
          }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          views={['month', 'week', 'day', 'agenda']}
          view={view}
          onView={setView}
        />
      </div>
    </div>
  );
}
