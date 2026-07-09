import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, MapPin } from 'lucide-react';

export default function VendorDockBooking() {
  const [docks, setDocks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/vendor-logistics/docks/available')
      .then(res => res.json())
      .then(data => setDocks(data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dock Scheduling</h1>
          <p className="text-muted-foreground">Book an available receiving bay at the destination warehouse.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Available Slots</CardTitle>
            <CardDescription>Select an open time slot to book your delivery.</CardDescription>
          </CardHeader>
          <CardContent>
            {docks.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-20" />
                No available dock schedules at this time.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {docks.map((dock: any) => (
                  <div key={dock.id} className="border rounded-lg p-4 hover:border-indigo-500 cursor-pointer transition-colors bg-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm">Slot #{dock.id.substring(0, 8)}</h4>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> Bay {dock.loadingBay?.name || 'Standard'}
                        </p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">Available</span>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-sm font-medium">{new Date(dock.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <button className="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded font-medium transition-colors">
                        Book Slot
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Bookings</CardTitle>
            <CardDescription>Upcoming appointments</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="text-center p-8 text-muted-foreground text-sm">
                You have no upcoming dock appointments.
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
