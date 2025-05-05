import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Image as ImageIcon, MapPin, Type, FileText, Globe2 } from 'lucide-react';
import NavBar from '@/components/NavBar';
import { Link } from 'react-router-dom';

const initialEvent = {
  title: '',
  date: '',
  description: '',
  imageUrl: '',
  lat: '',
  lng: '',
  type: 'battle',
  period: 'ww1',
};

const AddEvent = () => {
  const [event, setEvent] = useState(initialEvent);
  const [events, setEvents] = useState([]);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEvents([...events, event]);
    // Save to localStorage
    const stored = JSON.parse(localStorage.getItem('customEvents') || '[]');
    localStorage.setItem('customEvents', JSON.stringify([...stored, event]));
    setEvent(initialEvent);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />
      <div className="flex-1 flex flex-col items-center pt-24 pb-12">
        <div className="container mx-auto px-2 sm:px-4 max-w-2xl">
          <div className="glass-panel p-4 sm:p-8 md:p-10 rounded-xl border border-white/10 shadow-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Add Historical Event
            </h1>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-base font-semibold mb-1 flex items-center gap-2"><Type className="w-5 h-5 text-blue-300" /> Title</label>
                <input name="title" value={event.title} onChange={handleChange} placeholder="Title" className="w-full p-2 rounded bg-muted focus:ring-2 focus:ring-blue-400 transition" required />
              </div>
              <div>
                <label className="block text-base font-semibold mb-1 flex items-center gap-2"><Calendar className="w-5 h-5 text-blue-300" /> Date</label>
                <input name="date" type="date" value={event.date} onChange={handleChange} className="w-full p-2 rounded bg-muted focus:ring-2 focus:ring-blue-400 transition" required />
              </div>
              <div>
                <label className="block text-base font-semibold mb-1 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-300" /> Description</label>
                <textarea name="description" value={event.description} onChange={handleChange} placeholder="Description" className="w-full p-2 rounded bg-muted focus:ring-2 focus:ring-blue-400 transition" required />
              </div>
              <div>
                <label className="block text-base font-semibold mb-1 flex items-center gap-2"><ImageIcon className="w-5 h-5 text-blue-300" /> Image URL</label>
                <input name="imageUrl" value={event.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full p-2 rounded bg-muted focus:ring-2 focus:ring-blue-400 transition" />
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-base font-semibold mb-1 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-300" /> Latitude</label>
                  <input name="lat" value={event.lat} onChange={handleChange} placeholder="Latitude" className="w-full p-2 rounded bg-muted focus:ring-2 focus:ring-blue-400 transition" required />
                </div>
                <div className="w-1/2">
                  <label className="block text-base font-semibold mb-1 flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-300" /> Longitude</label>
                  <input name="lng" value={event.lng} onChange={handleChange} placeholder="Longitude" className="w-full p-2 rounded bg-muted focus:ring-2 focus:ring-blue-400 transition" required />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-base font-semibold mb-1">Type</label>
                  <select name="type" value={event.type} onChange={handleChange} className="w-full p-2 rounded bg-muted focus:ring-2 focus:ring-blue-400 transition">
                    <option value="battle">Battle</option>
                    <option value="treaty">Treaty</option>
                    <option value="political">Political</option>
                    <option value="economic">Economic</option>
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block text-base font-semibold mb-1">Period</label>
                  <select name="period" value={event.period} onChange={handleChange} className="w-full p-2 rounded bg-muted focus:ring-2 focus:ring-blue-400 transition">
                    <option value="ww1">World War I</option>
                    <option value="interwar">Interwar</option>
                    <option value="ww2">World War II</option>
                  </select>
                </div>
              </div>
              {/* <div className="mt-6"></div> */}
              <div className="mt-8">
                <Button type="submit" className="w-full text-lg py-2">Add Event</Button>
                {success && <div className="text-green-400 text-center font-semibold mt-2">Event added!</div>}
              </div>
            </form>
            {events.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">Preview Added Events</h2>
                <ul className="space-y-4">
                  {events.map((ev, idx) => (
                    <li key={idx} className="glass-panel p-4 rounded-xl border border-white/10 shadow">
                      <div className="font-bold text-lg mb-1">{ev.title} <span className="text-sm text-muted-foreground">({ev.date})</span></div>
                      <div className="text-sm mb-2">{ev.description}</div>
                      {ev.imageUrl && <img src={ev.imageUrl} alt={ev.title} className="w-full h-32 object-cover rounded mb-2" />}
                      <div className="text-xs text-muted-foreground">Lat: {ev.lat}, Lng: {ev.lng} | Type: {ev.type} | Period: {ev.period}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="text-center text-sm text-foreground/50">
            <p>© 2025 Globes of History. Educational platform for interactive historical exploration.</p>
            <p className="mt-2">
              <Link to="/" className="underline hover:text-foreground/80">Home</Link>
              <span className="mx-2">•</span>
              <Link to="/about" className="underline hover:text-foreground/80">About</Link>
              <span className="mx-2">•</span>
              <Link to="/about#contact" className="underline hover:text-foreground/80">Contact</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AddEvent; 